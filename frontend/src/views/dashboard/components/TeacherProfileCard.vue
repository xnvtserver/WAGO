<template>
  <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full max-w-sm">
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-emerald-500 to-sapphire-500">
        <div class="text-xl font-bold text-white">{{ staff.avatarInitials }}</div>
      </div>
      <div>
        <div class="text-white font-semibold text-lg">{{ staff.name }}</div>
        <div class="text-sm text-white/60">{{ staff.specialties.join(' • ') }}</div>
      </div>
    </div>
    <div class="mt-4">
      <div class="text-xs text-white/60 mb-2">Current Load</div>
      <div class="flex items-center gap-4">
        <div>
          <div class="text-sm text-white/60">Bookings</div>
          <div class="text-xl font-bold text-white">{{ staff.load.bookings }}</div>
        </div>
        <div>
          <div class="text-sm text-white/60">Weekly Hrs</div>
          <div class="text-xl font-bold text-white">{{ staff.load.weeklyHours }}</div>
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button class="px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-emerald-400 to-sapphire-500">Assign Booking</button>
        <button class="px-3 py-1 rounded-lg text-sm bg-white/6">View Schedule</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  staff: Object
})
</script>
