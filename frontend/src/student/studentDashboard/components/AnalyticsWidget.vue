<template>
  <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6">
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-white font-semibold">Analytics</div>
        <div class="text-xs text-white/60">Learning progress this week</div>
      </div>
      <div class="text-xs text-white/60">Weekly</div>
    </div>

    <div class="flex gap-3 items-end h-28">
      <div
        v-for="(val, i) in data"
        :key="i"
        class="flex-1 flex flex-col items-center"
      >
        <div
          class="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-teal-400"
          :style="{ height: (val * 100) + '%' }"
        />
        <div class="text-[10px] mt-1 text-white/60">{{ labels[i] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnalyticsWidget",
  data() {
    return {
      data: [0.4, 0.6, 0.8, 0.3, 0.7, 0.5, 0.9],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  }
}
</script>
