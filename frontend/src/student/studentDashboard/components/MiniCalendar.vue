<template>
  <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6">
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-white font-semibold">Calendar</div>
        <div class="text-xs text-white/60">Upcoming deadlines</div>
      </div>
      <button class="px-3 py-1 rounded-lg bg-white/6 text-xs">Add Event</button>
    </div>

    <div class="grid grid-cols-7 gap-2 text-center text-xs">
      <div
        v-for="d in days"
        :key="d"
        class="py-2 rounded-md"
        :class="d === today ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold' : 'bg-white/4 text-white/70'"
      >
        {{ d }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniCalendar',
  data() {
    return {
      today: new Date().getDate(),
      days: Array.from({ length: 30 }, (_, i) => i + 1)
    }
  }
}
</script>
