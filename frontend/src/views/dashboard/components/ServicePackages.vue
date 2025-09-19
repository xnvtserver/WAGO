<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">Service Packages</div>
        <div class="text-xs text-white/60">Available wash & detailing packages</div>
      </div>
      <button class="px-3 py-1 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500 text-sm">
        Add Package
      </button>
    </div>

    <div class="mt-4 grid gap-3">
      <div v-for="pkg in packages" :key="pkg.id" 
        class="p-4 rounded-xl bg-white/4 flex flex-col gap-2 border border-white/10">
        <div class="flex justify-between items-center">
          <div>
            <div class="text-white font-semibold">{{ pkg.name }}</div>
            <div class="text-xs text-white/60">{{ pkg.description }}</div>
          </div>
          <div class="text-lg font-bold text-emerald-400">₹{{ pkg.price }}</div>
        </div>
        <div class="flex gap-2 mt-2">
          <button class="px-3 py-1 rounded-md bg-white/6 text-sm">Edit</button>
          <button class="px-3 py-1 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500 text-sm">Book</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ packages: Array })
</script>
