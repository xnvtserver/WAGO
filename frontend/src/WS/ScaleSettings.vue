<template>
  <div class="scale-settings">
    <h3>Scale Configuration</h3>
    
    <form @submit.prevent="saveConfig">
      <div class="form-group">
        <label>Protocol Type</label>
        <select v-model="config.protocol">
          <option value="CAS_CI201A">CAS CI-201A</option>
          <option value="AVERY_BERKEL">Avery Berkel</option>
          <option value="METTLER_TOLEDO">Mettler Toledo</option>
          <option value="CUSTOM">Custom</option>
        </select>
      </div>

      <div v-if="config.protocol === 'CUSTOM'" class="custom-config">
        <div class="form-group">
          <label>Data Regex</label>
          <input v-model="config.data_parsing_config.regex" 
                 placeholder="e.g., \d+\.\d+">
        </div>
      </div>

      <button type="submit">Save Configuration</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShopStore } from '../stores/shop';

const shopStore = useShopStore();
const config = ref({
  protocol: 'CAS_CI201A',
  serial_config: {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
  },
  data_parsing_config: {
    regex: ''
  }
});

const saveConfig = async () => {
  await shopStore.updateScaleConfig(config.value);
};
</script>