<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">Messaging Hub</div>
        <div class="text-xs text-white/60">Chat with students & parents</div>
      </div>
      <div class="text-xs text-white/60">Inbox</div>
    </div>
    <div class="mt-4 grid gap-2">
      <div v-for="m in messages" :key="m.id" class="p-3 rounded-lg bg-white/4 flex items-center justify-between hover:scale-[1.01] transition">
        <div>
          <div class="text-sm text-white/90 font-semibold">{{ m.from }}</div>
          <div class="text-xs text-white/60">{{ m.subject }} • {{ m.excerpt }}</div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <div class="text-xs text-white/60">{{ m.time }}</div>
          <div class="flex gap-2">
            <button @click="openMessage(m.id)" class="px-2 py-1 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500 text-sm">Open</button>
            <button class="px-2 py-1 rounded-md bg-white/6 text-sm">Reply</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ messages: Array })
const openMessage = id => alert(`Open message ${id}`)
</script>
