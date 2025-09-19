<template>
  <div class="p-3 rounded-lg bg-white/4 flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <div class="text-sm font-medium text-white/90">{{ title }}</div>
      <span class="text-xs text-white/60">Due {{ deadline }}</span>
    </div>
    <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        class="h-full rounded-full"
        :class="{
          'bg-blue-400': color === 'blue',
          'bg-teal-400': color === 'teal',
          'bg-purple-400': color === 'purple'
        }"
        :style="{ width: (progress * 100) + '%' }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseCard',
  props: {
    title: { type: String, required: true },
    deadline: { type: String, required: true },
    progress: { type: Number, default: 0 },
    color: { type: String, default: 'blue' }
  }
}
</script>
