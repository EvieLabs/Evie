<script setup lang="ts">
import axios from "axios";
import { parseMarkdown } from "../util/parseMarkdown";
</script>

<script lang="ts">
export default {
  name: "App",
  data: function () {
    return {
      obj: {
        html: "loading...",
      },
    };
  },
  created: async function () {
    this.obj.html = await this.getHtml();
  },
  methods: {
    getHtml: async function () {
      const resp = await axios.get(
        "https://raw.githubusercontent.com/TeamEvie/Evie/main/README.md"
      );
      return parseMarkdown(resp.data);
    },
  },
};
</script>

<template>
  <div
    class="prose prose-invert prose-pre:text-neutral-content prose-pre:p-3 prose-pre:rounded prose-pre:overflow-x-auto max-w-none prose-a:text-primary prose-a:no-underline prose-img:inline prose-img:m-1 prose-p:m-1 prose-h1:border-border prose-h1:border-b prose-h1:mt-1 prose-h1:text-bold prose-h2:border-b prose-h2:mt-1 prose-h2:text-bold prose-h2:border-solid prose-h2:border-border flex items-stretch flex-col m-auto py-2.5 px-4 mt-3.5 shadow-lg hover:shadow-xl rounded-lg"
    v-html="obj.html"
  ></div>
</template>
