<script setup lang="ts">
import { SpeakerphoneIcon } from "@heroicons/vue/outline";
</script>

<template>
  <div class="bg-indigo-600">
    <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between flex-wrap">
        <div class="w-0 flex-1 flex items-center">
          <span class="flex p-2 rounded-lg bg-indigo-800">
            <SpeakerphoneIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <p class="ml-3 font-medium text-white truncate">
            <span class="md:hidden"> Evie is changing! </span>
            <span class="hidden md:inline">
              Evie is Changing! We're currently in the process of building the
              future of Evie!
            </span>
          </p>
        </div>
        <div
          class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto"
        >
          <a
            href="https://tristancamejo.notion.site/Re-write-031959a4cda54e8b8ca4848bd7782067"
            class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
