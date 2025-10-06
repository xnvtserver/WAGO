<template>
  <div class="scale-integration">
    <!-- Connection Status -->
    <div :class="['status', connectionStatus]">
      {{ statusMessages[connectionStatus] }}
    </div>
    
    <!-- Scale Selection -->
    <div v-if="availableDevices.length" class="device-list">
      <select v-model="selectedDevice" @change="connectDevice">
        <option v-for="device in availableDevices" :value="device.path">
          {{ device.manufacturer }} - {{ device.path }}
        </option>
      </select>
    </div>

    <!-- Weight Display -->
    <div v-if="currentWeight" class="weight-display">
      <span class="label">Current Weight:</span>
      <span class="value">{{ currentWeight }} kg</span>
    </div>

    <!-- Quantity Input -->
    <input 
      type="number"
      :value="quantity"
      @input="handleManualInput"
      :class="{ 'auto-update': !manualOverride }"
      step="0.01"
      min="0"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const currentWeight = ref<number | null>(null);
const availableDevices = ref<SerialPort[]>([]);
const selectedDevice = ref<string>('');
const manualOverride = ref(false);
const quantity = ref(0);
const connectionStatus = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

const statusMessages = {
  disconnected: 'Scale Disconnected',
  connecting: 'Connecting to Scale...',
  connected: 'Scale Connected',
  error: 'Connection Error'
};

let socket: WebSocket;

onMounted(async () => {
  // Get available devices
  const devices = await navigator.serial.getPorts();
  availableDevices.value = devices.filter(d => 
    d.getInfo().usbVendorId === authStore.currentShop?.scaleVendorId
  );

  // Connect WebSocket
  socket = new WebSocket(`wss://your-domain.com/scale-ws?shopId=${authStore.currentShop?.id}`);
  
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
      case 'weight':
        if (!manualOverride.value) {
          currentWeight.value = data.weight;
          quantity.value = data.weight;
        }
        break;
      case 'error':
        connectionStatus.value = 'error';
        break;
    }
  });
});

const connectDevice = async () => {
  connectionStatus.value = 'connecting';
  try {
    await socket.send(JSON.stringify({
      type: 'connect-scale',
      deviceId: selectedDevice.value
    }));
    connectionStatus.value = 'connected';
  } catch (err) {
    connectionStatus.value = 'error';
  }
};

const handleManualInput = (event: Event) => {
  manualOverride.value = true;
  quantity.value = parseFloat((event.target as HTMLInputElement).value);
};

onBeforeUnmount(() => {
  socket?.close();
});
</script>