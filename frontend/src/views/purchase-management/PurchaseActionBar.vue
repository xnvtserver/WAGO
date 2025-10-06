<template>
  <div
    :class="[
      'rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4 transition-colors',
      themeStore.isDark ? 'bg-gray-800' : 'bg-white'
    ]"
  >
    <div class="flex items-center space-x-3">
      <button
        @click="$emit('new-purchase')"
        class="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition"
      >
        <i class="fas fa-plus"></i>
        <span>New Purchase</span>
      </button>
      <button
        :class="[
          'flex items-center space-x-2 border px-4 py-2 rounded-lg transition',
          themeStore.isDark
            ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        <i class="fas fa-filter"></i>
        <span>Filters</span>
      </button>
    </div>
    <div class="flex items-center space-x-3">
      <div class="relative">
        <select
          :class="[
            'appearance-none py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition',
            themeStore.isDark
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-gray-50 border-gray-300 text-gray-700'
          ]"
        >
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
          <option>Custom Range</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
          :class="themeStore.isDark ? 'text-white' : 'text-gray-700'"
        >
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
      <button
        :class="[
          'p-2 rounded-lg border transition',
          themeStore.isDark
            ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        <i class="fas fa-download"></i>
      </button>
      <button
        :class="[
          'p-2 rounded-lg border transition',
          themeStore.isDark
            ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        <i class="fas fa-print"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme';

defineEmits(['new-purchase']);

const themeStore = useThemeStore();
</script>
