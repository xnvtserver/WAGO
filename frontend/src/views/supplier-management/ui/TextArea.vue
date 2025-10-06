<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :rows="rows"
    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  ></textarea>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, default: '' },
    rows: { type: [Number, String], default: 3 }
  },
  emits: ['update:modelValue']
};
</script>