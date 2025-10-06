<!-- frontend/src/components/dashboard/StatsCard.vue -->
<template>
  <div
    class="card-hover rounded-lg shadow p-6 transition duration-300"
    :class="[isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900']"
  >
    <div class="flex items-center">
      <div :class="'p-3 rounded-full ' + bgColor + ' ' + textColor">
        <i :class="icon + ' text-xl'"></i>
      </div>
      <div class="ml-4">
        <div :class="isDark ? 'text-gray-300' : 'text-gray-500'">{{ title }}</div>
        <div class="text-2xl font-bold">
          {{ isNumeric ? formattedAnimatedValue : value }}
        </div>
      </div>
    </div>
    <div class="mt-4 text-sm flex items-center" :class="trendColor">
      <i :class="trendIcon + ' mr-1'"></i>
      <span>{{ trendText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore.js';
import { useThemeStore } from '@/stores/theme.js';

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const dashboardStore = useDashboardStore();
onMounted(async () => {
  await dashboardStore.fetchStats();
});

const props = defineProps({
  icon: String,
  title: String,
  value: [String, Number],
  trendText: String,
  trendColor: String,
  trendIcon: String,
  bgColor: String,
  textColor: String,
  isNumeric: Boolean,
  formattedAnimatedValue: String
});

// Parse numeric value and prefix/suffix
const numericMatch = computed(() => {
  if (typeof props.value === 'number') return { num: props.value, prefix: '', suffix: '' };
  if (typeof props.value === 'string') {
    const m = props.value.match(/^([^0-9\-+]*)([0-9,\.]+)([^0-9]*)$/);
    if (m) {
      const raw = m[2].replace(/,/g, '');
      const num = parseFloat(raw);
      return { num, prefix: m[1] || '', suffix: m[3] || '' };
    }
  }
  return null;
});

const isNumeric = computed(() => numericMatch.value !== null && !isNaN(numericMatch.value.num));
const animatedValue = ref(0);

const animateValue = (start, end, duration = 1000) => {
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    animatedValue.value = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
    else animatedValue.value = end;
  };
  requestAnimationFrame(step);
};

watch(
  () => props.value,
  () => {
    if (isNumeric.value) animateValue(0, numericMatch.value.num, 1000);
    else animatedValue.value = props.value;
  },
  { immediate: true }
);

const formattedAnimatedValue = computed(() => {
  if (!isNumeric.value) return props.value;
  const { prefix, suffix } = numericMatch.value;
  const formatted = Intl.NumberFormat('en-US').format(animatedValue.value);
  return `${prefix}${formatted}${suffix}`;
});
</script>
