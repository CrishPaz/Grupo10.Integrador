import { useColorMode } from '@vueuse/core'

export const useTheme = () => {
    // Use VueUse's useColorMode for better browser support
    const colorMode = useColorMode({
        attribute: 'class',
        modes: {
            light: 'light',
            dark: 'dark'
        }
    })

    const isDark = computed(() => colorMode.value === 'dark')

    const toggleTheme = () => {
        colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
    }

    // Initialize theme (VueUse handles this automatically)
    const initTheme = () => {
        // Nothing needed - VueUse handles initialization
    }

    return {
        isDark: readonly(isDark),
        initTheme,
        toggleTheme
    }
}
