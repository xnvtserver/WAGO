<template>
  <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full max-w-sm">
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-blue-600 to-violet-500">
        <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" class="w-full h-full object-cover" />
        <div v-else class="text-xl font-bold text-white">AM</div>
      </div>
      <div>
        <div class="text-white font-semibold">{{ name }}</div>
        <div class="text-sm text-white/60">{{ grade }}</div>
      </div>
    </div>

    <div class="mt-4">
      <div class="text-xs text-white/60 mb-2">Course Progress</div>
      <div class="w-full h-3 rounded-full bg-white/8 overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-blue-400 to-teal-300" style="width:67%" />
      </div>
      <div class="flex items-center justify-between mt-2 text-xs text-white/60">
        <span>67% complete</span>
        <span>Streak: <strong class="text-white">12 🔥</strong></span>
      </div>

      <div class="mt-3 flex gap-2">
        <span class="px-2 py-1 rounded-full text-xs bg-white/4">Badge: Fast Learner</span>
        <span class="px-2 py-1 rounded-full text-xs bg-white/4">Badge: Quiz Master</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileCard',
  props: {
    name: { type: String, default: 'Alex Morgan' },
    grade: { type: String, default: 'Grade 11' },
    avatarUrl: { type: String, default: '' }
  }
}
</script>
