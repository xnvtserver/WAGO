<template>
  <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">AI Insights</div>
        <div class="text-xs text-white/60">Students at risk & recommended strategies</div>
      </div>
      <div class="px-3 py-1 text-xs rounded-lg bg-white/4">Model: Adaptive</div>
    </div>

    <div class="mt-4 grid gap-3">
      <div class="p-3 rounded-lg bg-white/5">
        <div class="text-xs text-white/60">At-risk students</div>
        <div class="mt-2">
          <div v-for="s in insights.atRisk" :key="s.student" class="flex items-center justify-between py-2">
            <div>
              <div class="text-sm text-white/90 font-semibold">{{ s.student }}</div>
              <div class="text-xs text-white/60">{{ s.class }} • Score: {{ s.score }}% • Attendance: {{ s.attendance }}</div>
            </div>
            <button class="px-2 py-1 rounded-md text-sm bg-gradient-to-r from-emerald-400 to-sapphire-500">Coach</button>
          </div>
        </div>
      </div>

      <div class="p-3 rounded-lg bg-white/5">
        <div class="text-xs text-white/60">Suggested strategies</div>
        <ul class="mt-2 list-inside list-disc text-xs text-white/70">
          <li v-for="(s, i) in insights.suggestions" :key="i" class="py-1 flex items-center justify-between">
            <span>{{ s }}</span>
            <button @click="useStrategy(s)" class="ml-2 text-xs px-2 py-1 rounded bg-white/6">Use</button>
          </li>
        </ul>
      </div>

      <div class="p-3 rounded-lg bg-white/5">
        <div class="text-xs text-white/60">Engagement</div>
        <div class="text-lg font-bold text-white mt-1">{{ insights.engagement }}</div>
        <div class="text-xs text-white/60 mt-1">Realtime suggestions: Use live polls & group breakout to boost attention.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ insights: Object })
const useStrategy = (s) => alert(`Use strategy: ${s}`)
</script>
