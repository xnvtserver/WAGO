<template>
  <div class="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4 w-full">
    <img
      :src="staff.avatar || '/default-avatar.png'"
      alt="Avatar"
      class="w-14 h-14 rounded-full object-cover border border-white/20"
    />
    <div class="flex-1">
      <div class="text-white font-semibold">{{ staff.name }}</div>
      <div class="text-xs text-white/60">{{ staff.role }}</div>
      <div class="text-xs text-white/50">{{ staff.phone }}</div>
    </div>
    <button
      class="bg-emerald-500 text-black text-xs px-3 py-1 rounded-lg hover:bg-emerald-400"
      @click="$emit('view-profile', staff.id)"
    >
      View
    </button>
  </div>
</template>

<script setup>
defineProps({
  staff: {
    type: Object,
    required: true,
    default: () => ({
      name: 'John Doe',
      role: 'Washer',
      phone: '9999999999',
      avatar: null,
    }),
  },
})
</script>
