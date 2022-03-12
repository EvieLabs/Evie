<script setup lang="ts">
import { ClockIcon } from "@heroicons/vue/outline";
</script>

<template>
  <div className="flex flex-col items-center justify-center h-screen">
    <p class="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3">
      <span>wait a minute! <ClockIcon class="h-8 inline" /></span>
    </p>
    <p class="text-xl text-gray-300 lg:mx-auto mb-3">
      This page doesn't seem to exist.
    </p>
    <router-link to="/"
      ><button
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Come Back Home!
      </button>
    </router-link>
  </div>
</template>
