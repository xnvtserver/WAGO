<template>
    <div v-if="hasMultipleShops" class="shop-selector">
      <select v-model="activeShop" @change="updateShop">
        <option v-for="shop in shops" :key="shop.id" :value="shop.id">
          {{ shop.name }} ({{ shop.location }})
        </option>
      </select>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'pinia';
  import { useAuthStore } from '@/stores/auth';
  
  export default {
    computed: {
      ...mapState(useAuthStore, ['shops', 'activeShop', 'hasMultipleShops'])
    },
    methods: {
      ...mapActions(useAuthStore, ['setActiveShop']),
      updateShop(e) {
        this.setActiveShop(parseInt(e.target.value));
      }
    }
  };
  </script>