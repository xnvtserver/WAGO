<template>
  <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">Service Analytics</div>
        <div class="text-xs text-white/60">Bookings • Revenue • Customer Feedback</div>
      </div>
      <div class="text-xs text-white/60">Last 30 days</div>
    </div>

    <div class="mt-4 grid gap-3">
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="p-3 rounded-lg bg-white/4">
          <div class="text-sm text-white/60">Total Bookings</div>
          <div class="text-2xl font-bold text-white mt-1">{{ analytics.totalBookings }}</div>
        </div>
        <div class="p-3 rounded-lg bg-white/4">
          <div class="text-sm text-white/60">Revenue</div>
          <div class="text-2xl font-bold text-white mt-1">₹{{ analytics.revenue }}</div>
        </div>
        <div class="p-3 rounded-lg bg-white/4">
          <div class="text-sm text-white/60">Avg Rating</div>
          <div class="text-2xl font-bold text-white mt-1">{{ analytics.avgRating }}/5</div>
        </div>
      </div>

      <div class="p-3 rounded-lg bg-white/5">
        <div class="text-xs text-white/60">Booking Trend</div>
        <div class="mt-2 h-20 flex items-end gap-2">
          <div v-for="(v,i) in analytics.trends.bookings" :key="i" class="flex-1">
            <div class="mx-auto h-full max-h-20 rounded-md" 
              :style="{ height: Math.max(10,(v/100)*100)+'%', background: 'linear-gradient(180deg, rgba(59,130,246,0.7), rgba(16,185,129,0.6))'}">
            </div>
          </div>
        </div>
      </div>

      <div class="p-3 rounded-lg bg-white/5">
        <div class="text-xs text-white/60">Revenue Trend</div>
        <div class="mt-2 h-20 flex items-end gap-2">
          <div v-for="(v,i) in analytics.trends.revenue" :key="i" class="flex-1">
            <div class="mx-auto h-full max-h-20 rounded-md" 
              :style="{ height: Math.max(10,(v/100)*100)+'%', background: 'linear-gradient(180deg, rgba(139,92,246,0.7), rgba(99,102,241,0.6))'}">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ analytics: Object })
</script>
