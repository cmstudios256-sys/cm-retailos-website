<template>
  <div class="cm-site-root" v-html="content"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { initAll } from '../theme.js';
import { initializePageInteractions } from './page-interactions.js';

const props = defineProps({
  page: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

let cleanupInteractions = null;

onMounted(() => {
  initAll();
  cleanupInteractions = initializePageInteractions(props.page);
});

onUnmounted(() => {
  if (typeof cleanupInteractions === 'function') {
    cleanupInteractions();
  }
});
</script>
