<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="roleClass">
    {{ roleLabel }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  role: string
}

const props = defineProps<Props>()

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  admissions: 'Admisiones',
  doctor: 'Médico',
  lab: 'Laboratorio',
  patient: 'Paciente'
}

const roleClasses: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  admissions: 'bg-blue-100 text-blue-800',
  doctor: 'bg-green-100 text-green-800',
  lab: 'bg-yellow-100 text-yellow-800',
  patient: 'bg-gray-100 text-gray-800'
}

const roleLabel = computed(() => roleLabels[props.role] || props.role)
const roleClass = computed(() => roleClasses[props.role] || 'bg-gray-100 text-gray-800')
</script>
