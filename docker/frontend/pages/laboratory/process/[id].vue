
<template>
  <LaboratoryLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
           <div class="flex items-center">
             <button @click="goBack" class="mr-4 text-gray-500 hover:text-gray-700">
               <ArrowLeftIcon class="h-5 w-5" />
             </button>
             <div>
                <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
                  Procesamiento de Muestra
                </h2>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Ingreso de resultados y control de calidad</p>
             </div>
           </div>
        </div>

        <ResultsEntry :sampleId="sampleId" />
      </div>
    </div>
  </LaboratoryLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import LaboratoryLayout from '~/components/LaboratoryLayout.vue'
import ResultsEntry from '~/components/Laboratory/ResultsEntry.vue'

const route = useRoute()
const router = useRouter()
const sampleId = computed(() => route.params.id as string)

const goBack = () => {
  router.push('/laboratory')
}

definePageMeta({
  middleware: ['auth']
})
</script>
