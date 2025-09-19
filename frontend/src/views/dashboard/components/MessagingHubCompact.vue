<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">Messages</div>
        <div class="text-xs text-white/60">Recent communication</div>
      </div>
      <div class="text-xs text-white/60">{{ messages.length }}</div>
    </div>
    <div class="mt-3 grid gap-2">
      <div v-for="m in messages.slice(0,3)" :key="m.id" class="p-2 rounded-lg bg-white/4 flex items-center justify-between">
        <div>
          <div class="text-sm text-white/90 font-semibold">{{ m.from }}</div>
          <div class="text-xs text-white/60">{{ m.subject }} • {{ m.excerpt }}</div>
        </div>
        <div class="text-xs text-white/60">{{ m.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ messages: Array })
</script>
