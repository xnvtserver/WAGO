<template>
  <header class="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 glass-card">
    <div class="flex items-center">
      <i class="fas fa-cubes text-xl mr-2 gradient-text"></i>
      <span class="text-lg font-bold font-futuristic gradient-text">NEXUS</span>
    </div>
    <button @click="toggleMobileMenu" class="text-gray-400 hover:text-white focus:outline-none">
      <i class="fas fa-bars text-xl"></i>
    </button>
  </header>
</template>

<script>
export default {
  name: 'MobileHeader',
  methods: {
    toggleMobileMenu() {
      this.$emit('toggle-mobile-menu')
    }
  }
}
</script>