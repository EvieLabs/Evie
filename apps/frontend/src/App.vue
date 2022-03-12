<script setup lang="ts">
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import "./index.css";
</script>

<template>
  <Header />
  <router-view />
  <Footer />
</template>
