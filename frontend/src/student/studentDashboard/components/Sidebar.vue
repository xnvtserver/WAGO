<template>
  <aside class="w-20 md:w-56 flex flex-col items-center md:items-start p-3 md:px-4 space-y-6 bg-gradient-to-b from-[#071023] via-[#06121a] to-[#041018] border-r border-white/5">
    <div class="w-full flex items-center justify-center md:justify-between">
      <div class="text-white font-bold text-lg md:text-xl tracking-wide">felidae</div>
      <div class="hidden md:block text-xs text-white/60">Online School</div>
    </div>

    <nav class="w-full flex flex-col gap-2">
      <button v-for="it in items" :key="it.name" class="flex items-center gap-3 w-full p-2 md:px-3 rounded-lg hover:scale-[1.01] transition transform ring-1 ring-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.18)]">
        <svg class="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path :d="it.icon" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="hidden md:inline text-sm text-white/80">{{ it.name }}</span>
      </button>
    </nav>

    <div class="mt-auto w-full">
      <button class="w-full py-2 rounded-lg backdrop-blur bg-white/3 text-sm font-medium text-white/90">Help & Support</button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      items: [
        { name: 'Dashboard', icon: 'M3 12h18M3 6h18M3 18h18' },
        { name: 'Courses', icon: 'M4 6h16v12H4z' },
        { name: 'Assignments', icon: 'M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z' },
        { name: 'Exams', icon: 'M12 2l3 6 6 .5-4.5 4 1 6L12 14l-5.5 4 1-6L3 8.5 9 8z' },
        { name: 'Messages', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
        { name: 'Support', icon: 'M18 8a6 6 0 1 0-12 0v4' },
      ]
    }
  }
}
</script>
