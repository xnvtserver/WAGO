<template>
  <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
</template>

<script>
export default {
  props: {
    error: { type: String, default: '' }
  }
};
</script>