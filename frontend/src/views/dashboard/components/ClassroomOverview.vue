<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">Classroom Overview</div>
        <div class="text-xs text-white/60">Courses taught & schedules</div>
      </div>
      <div class="text-xs text-white/60">{{ classes.length }} classes</div>
    </div>
    <div class="mt-4 grid gap-3">
      <div v-for="c in classes" :key="c.id" class="p-3 rounded-lg bg-white/4 flex items-center justify-between border border-white/10">
        <div>
          <div class="text-sm text-white/90 font-semibold">{{ c.title }}</div>
          <div class="text-xs text-white/60">{{ c.students }} students • Next: {{ c.next }}</div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <button class="px-3 py-1 rounded-md text-sm bg-gradient-to-r from-sapphire-500 to-emerald-400">Open</button>
          <div class="text-xs text-white/60">Roster</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  classes: Array
})
</script>
