<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Contenido Principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Removed Header since it is empty -->
      
      <!-- Aquí es donde se inyecta el código que tú me pasaste -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
        <slot /> 
      </main>
    </div>
  </div>
</template>