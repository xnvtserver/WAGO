<template>
  <div>
    <input
      type="date"
      :value="formattedDate"
      @input="updateDate($event.target.value)"
      :min="minDate ? formatDate(minDate) : null"
      :max="maxDate ? formatDate(maxDate) : null"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</template>

<script>
import { formatDate as format } from '../../../utils/formatdate';

export default {
  props: {
    modelValue: { type: [Date, String], default: null },
    minDate: { type: [Date, String], default: null },
    maxDate: { type: [Date, String], default: null }
  },
  emits: ['update:modelValue'],
  computed: {
    formattedDate() {
      if (!this.modelValue) return '';
      return this.formatDate(this.modelValue);
    }
  },
  methods: {
    formatDate(date) {
      return format(date);
    },
    updateDate(value) {
      this.$emit('update:modelValue', value ? new Date(value) : null);
    }
  }
};
</script>