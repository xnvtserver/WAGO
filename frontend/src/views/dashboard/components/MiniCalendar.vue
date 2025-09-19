<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="text-white font-semibold text-sm mb-2">Mini Calendar</div>
    <div class="grid grid-cols-7 gap-1 text-center text-xs text-white/50">
      <div v-for="d in ['S','M','T','W','T','F','S']" :key="d" class="font-semibold">{{ d }}</div>
      <div v-for="n in 30" :key="n" class="p-1 rounded-full hover:bg-white/10 cursor-pointer">{{ n }}</div>
    </div>
  </div>
</template>
