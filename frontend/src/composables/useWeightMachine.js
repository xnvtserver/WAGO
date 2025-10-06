// front-end/src/composables/useWeightMachine.js
import { ref, onBeforeUnmount } from 'vue';

export function useWeightMachine(quantities, products,selectedProducts) {
  const activeProductId = ref(null);
  const weightInput = ref('');
  const isWeightInputActive = ref(false);
  const hasManualInput = ref(false);
  const currentWeight = ref(0);
  const ws = ref(null);

const connectWebSocket = () => {
  ws.value = new WebSocket('ws://localhost:8080/weight');
  
  ws.value.onmessage = (event) => {
    if (isWeightInputActive.value && activeProductId.value && !hasManualInput.value) {
      const weight = parseFloat(event.data);
      if (!isNaN(weight)) {
        currentWeight.value = weight;
        weightInput.value = weight.toFixed(1);
        updateQuantityFromMachine(activeProductId.value, weight);
      }
    }
  };
};

  const updateQuantityFromMachine = (productId, weight) => {
    const product = selectedProducts.find(p => p.id === productId);
    if (!product) return;
    const precision = product.name.toLowerCase().includes('തേങ്ങ') ? 0 : 1;
    quantities[productId] = parseFloat(weight.toFixed(precision));
  };

  const handleQuantityFocus = (productId) => {
    activeProductId.value = productId;
    isWeightInputActive.value = true;
    hasManualInput.value = false;
    weightInput.value = '0.0';
  };

  const handleQuantityBlur = () => {
    isWeightInputActive.value = false;
    activeProductId.value = null;
  };

  onBeforeUnmount(() => {
    if (ws.value) {
      ws.value.close();
    }
  });

  connectWebSocket();

  return {
    handleQuantityFocus,
    handleQuantityBlur,
    weightInput,
    isWeightInputActive
  };
}