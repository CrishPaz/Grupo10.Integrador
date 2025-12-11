import { ref, computed } from 'vue';
import type {
    InventarioItem,
    MovimientoInventario,
    SeguimientoLogistico,
    AlertaInventario
} from '~/types/inventario-logistica';

export const useInventarioLogistica = () => {
    // Estados
    const inventario = ref<InventarioItem[]>([]);
    const movimientos = ref<MovimientoInventario[]>([]);
    const seguimientos = ref<SeguimientoLogistico[]>([]);
    const alertas = ref<AlertaInventario[]>([]);
    const proveedores = ref<any[]>([]);

    const loading = ref(false);
    const error = ref<string | null>(null);

    // Inventario
    const fetchInventario = async (filtros: any = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const query = new URLSearchParams(filtros).toString();
            const response: any = await $fetch(`/api/inventario-logistica/inventario/items?${query}`);
            inventario.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al cargar inventario';
            console.error('Error fetching inventory:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchItemById = async (itemId: string) => {
        loading.value = true;

        try {
            const response: any = await $fetch(`/api/inventario-logistica/inventario/items/${itemId}`);
            return response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al cargar ítem';
            console.error('Error fetching item:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const crearItem = async (itemData: any) => {
        loading.value = true;

        try {
            const response: any = await $fetch('/api/inventario-logistica/inventario/items/create', {
                method: 'POST',
                body: itemData
            });

            // Actualizar lista local
            if (response.data) {
                inventario.value.unshift(response.data);
            }

            return response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al crear ítem';
            console.error('Error creating item:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const actualizarItem = async (itemId: string, itemData: any) => {
        try {
            const response: any = await $fetch(`/api/inventario-logistica/inventario/items/${itemId}/update`, {
                method: 'PATCH' as any,
                body: itemData
            });

            // Actualizar en lista local
            const index = inventario.value.findIndex(item => item.id === itemId);
            if (index !== -1) {
                inventario.value[index] = { ...inventario.value[index], ...response.data };
            }

            return response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al actualizar ítem';
            console.error('Error updating item:', err);
            throw err;
        }
    };

    // Movimientos
    const fetchMovimientos = async (filtros: any = {}) => {
        try {
            const query = new URLSearchParams(filtros).toString();
            const response: any = await $fetch(`/api/inventario-logistica/inventario/movimientos?${query}`);
            movimientos.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al cargar movimientos';
            console.error('Error fetching movements:', err);
        }
    };

    const crearMovimiento = async (movimientoData: any) => {
        loading.value = true;

        try {
            const response: any = await $fetch('/api/inventario-logistica/inventario/movimientos/create', {
                method: 'POST',
                body: movimientoData
            });

            // Actualizar lista local
            if (response.data) {
                movimientos.value.unshift(response.data);
            }

            // Actualizar stock en inventario local (optimista)
            const itemIndex = inventario.value.findIndex(item => item.id === movimientoData.item_id);
            if (itemIndex !== -1) {
                const item = inventario.value[itemIndex];
                const cantidad = Number(movimientoData.cantidad);
                if (movimientoData.tipo_movimiento === 'ENTRADA') {
                    item.stock_actual = Number(item.stock_actual) + cantidad;
                } else if (movimientoData.tipo_movimiento === 'SALIDA') {
                    item.stock_actual = Number(item.stock_actual) - cantidad;
                }
            }

            return response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al registrar movimiento';
            console.error('Error creating movement:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Seguimiento Logístico
    const fetchSeguimientos = async (filtros: any = {}) => {
        try {
            const query = new URLSearchParams(filtros).toString();
            const response: any = await $fetch(`/api/inventario-logistica/logistica/seguimiento?${query}`);
            seguimientos.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al cargar seguimientos';
            console.error('Error fetching tracking:', err);
        }
    };

    const crearSeguimiento = async (seguimientoData: any) => {
        try {
            const response: any = await $fetch('/api/inventario-logistica/logistica/seguimiento/create', {
                method: 'POST',
                body: seguimientoData
            });

            if (response.data) {
                seguimientos.value.unshift(response.data);
            }

            return response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al crear seguimiento';
            console.error('Error creating tracking:', err);
            throw err;
        }
    };

    const actualizarEstadoSeguimiento = async (seguimientoId: string, estadoData: any) => {
        try {
            const response: any = await $fetch('/api/inventario-logistica/logistica/estados/update', {
                method: 'POST',
                body: { seguimiento_id: seguimientoId, ...estadoData }
            });

            // Actualizar en lista local
            const index = seguimientos.value.findIndex(s => s.id === seguimientoId);
            if (index !== -1) {
                seguimientos.value[index] = { ...seguimientos.value[index], ...response.data };
            }

            return response.data;
        } catch (err: any) {
            error.value = err.message || 'Error al actualizar estado';
            console.error('Error updating status:', err);
            throw err;
        }
    };

    // Utilitarios
    const calcularNivelStock = (item: InventarioItem): string => {
        const stock = Number(item.stock_actual);
        const min = Number(item.stock_minimo);
        const reorden = Number(item.punto_reorden || min * 1.5);

        if (stock <= 0) return 'AGOTADO';
        if (stock <= min) return 'CRITICO';
        if (stock <= reorden) return 'BAJO';
        return 'NORMAL';
    };

    const calcularEstadoCaducidad = (item: InventarioItem): string => {
        if (!item.fecha_vencimiento) return 'NO_APLICA';

        const hoy = new Date();
        const vencimiento = new Date(item.fecha_vencimiento);
        const diffTime = vencimiento.getTime() - hoy.getTime();
        const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDias < 0) return 'VENCIDO';
        if (diffDias <= 30) return 'POR_VENCER';
        return 'VIGENTE';
    };

    return {
        // Estados
        inventario,
        movimientos,
        seguimientos,
        alertas,
        proveedores,
        loading,
        error,

        // Métodos Inventario
        fetchInventario,
        fetchItemById,
        crearItem,
        actualizarItem,

        // Métodos Movimientos
        fetchMovimientos,
        crearMovimiento,

        // Métodos Logística
        fetchSeguimientos,
        crearSeguimiento,
        actualizarEstadoSeguimiento,

        // Utilitarios
        calcularNivelStock,
        calcularEstadoCaducidad
    };
};