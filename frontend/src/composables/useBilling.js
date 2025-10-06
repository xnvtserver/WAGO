//front-end/src/composables/useBilling.js
import { ref, computed, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

export function useBilling() {
  const authStore = useAuthStore();

  // State
  const loading = ref(false);
  const error = ref(null);
  const processingSale = ref(false);
  const products = ref([]); // All fetched products
  const selectedProducts = ref([]); // Products added to the bill
  const quantities = reactive({}); 
  const customer = reactive({ name: '', phone: '', address: '' });
  const searchQuery = ref('');
  const showBillPreview = ref(false);
  const billItems = ref([]);
  const billCustomer = reactive({ name: '', phone: '', address: '' });
  const billNumber = ref('');
  const billSubtotal = ref(0);
  const billDiscount = ref(0);
  const billTax = ref(0);
  const billTotal = ref(0);
// error state for barcode
const barcodeError = ref(null);
  // Constants
  const GST_RATE = 0.05;
  const DISCOUNT_RATE = 0.05;
  const DISCOUNT_THRESHOLD = 100;

  // Computed Old (using all products)
  // const cartItems = computed(() =>
  //   selectedProducts.value
  //     .filter(product => quantities[product.id] > 0)
  //     .map(product => ({ ...product, quantity: quantities[product.id] }))
  // );

  // New (using selectedProducts)
const cartItems = computed(() => 
  selectedProducts.value
    .filter(product => quantities[product.id] > 0)
    .map(product => ({
      ...product,
      quantity: quantities[product.id]
    }))
);

  const incrementQuantity = (productId) => {
    quantities[productId] = (quantities[productId] || 0) + 0.1;
  };

  const decrementQuantity = (productId) => {
    quantities[productId] = Math.max(0, (quantities[productId] || 0) - 0.1);
  };

  const updateQuantity = (productId, newQuantity) => {
    const quantity = parseFloat(newQuantity);
    if (!isNaN(quantity)) {
      quantities[productId] = Math.max(0, quantity);
    }
  };

const handleSearch = async (query) => {
  try {
    loading.value = true;
    const results = await searchProducts(query);
    products.value = results;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

  const subtotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const discount = computed(() =>
    subtotal.value > DISCOUNT_THRESHOLD ? subtotal.value * DISCOUNT_RATE : 0
  );

  const tax = computed(() =>
    (subtotal.value - discount.value) * GST_RATE
  );

  const total = computed(() =>
    subtotal.value - discount.value + tax.value
  );

  // Fetch all products (initial load)
  const fetchProducts = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await authStore.apiFetch('/v1/billing/products');

      if (response?.products) {
        products.value = response.products.map(p => ({
          ...p,
          price: parseFloat(p.price),
          stock: parseFloat(p.stock),
        }));
      }
    } catch (err) {
      error.value = err;
      console.error('Failed to fetch products:', err);
    } finally {
      loading.value = false;
    }
  };

  const clearCart = () => {
    selectedProducts.value.forEach(product => {
      delete quantities[product.id];
    });
    selectedProducts.value = [];
  };

  // Fetch product by search query
const searchProducts = async (query) => {
  try {
    const results = await authStore.apiFetch(`/v1/billing/products?search=${encodeURIComponent(query)}`);
    return results?.products || [];
  } catch (err) {
    error.value = err;
    return [];
  }
};

  // Fetch product by barcode
const fetchProductByBarcode = async (barcode) => {
  try {
    const response = await authStore.apiFetch(`/v1/billing/products?barcode=${encodeURIComponent(barcode)}`);
    
    if (!response?.products?.length) {
      throw new Error('No products found');
    }
    
    return {
      ...response.products[0],
      price: parseFloat(response.products[0].price),
      stock: parseFloat(response.products[0].stock)
    };
  } catch (err) {
    console.error('Barcode scan failed:', err);
    throw err; // Re-throw for error handling
  }
};

// Updated addProductToBill to handle stock checks
const addProductToBill = (product) => {
  if (product.stock <= 0) {
    error.value = 'Product out of stock';
    return;
  }
  
  if (!selectedProducts.value.some(p => p.id === product.id)) {
    selectedProducts.value.push({ ...product });
    quantities[product.id] = quantities[product.id] || 0;
  }
};

const availableProducts = computed(() => 
  products.value.filter(p => 
    !selectedProducts.value.some(sp => sp.id === p.id)
  )
);

const handleBarcodeScan = async (barcode) => {
  try {
    loading.value = true;
    barcodeError.value = null;
    
    const product = await fetchProductByBarcode(barcode);
    
    if (product) {
      addProductToBill(product);
    } else {
      barcodeError.value = 'Product not found for barcode: ' + barcode;
    }
  } catch (err) {
    barcodeError.value = 'Failed to scan barcode: ' + err.message;
  } finally {
    loading.value = false;
  }
};

const closeBillPreview = () => {
  showBillPreview.value = false; // Make sure this is properly implemented
};
  // Handle product selected from search
  const selectProduct = (product) => {
    addProductToBill(product);
  };

// 
const generateBill = async () => {
  processingSale.value = true;
  try {
    // Force deep clone of cart items
    billItems.value = JSON.parse(JSON.stringify(cartItems.value));
    
    // Clone customer details
    billCustomer.name = customer.name;
    billCustomer.phone = customer.phone;
    billCustomer.address = customer.address;
    
    // Update totals
    billSubtotal.value = subtotal.value;
    billDiscount.value = discount.value;
    billTax.value = tax.value;
    billTotal.value = total.value;
    
    showBillPreview.value = true;
  } catch (err) {
    error.value = err.message;
    console.error('Bill generation failed:', err);
  } finally {
    processingSale.value = false;
  }
};

const printBill = () => {
  const printContent = `
    <div class="bill-print">
      <h2>${shopDetails.name}</h2>
      <p>${shopDetails.address}</p>
      <!-- Add bill content here -->
    </div>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Bill Print</title>
        <style>
          body { font-family: 'Arial'; }
          .bill-print { padding: 20px; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
};

const shopDetails = reactive({
  name: "ഹരിത പച്ചക്കറി കട",
  address: "തൃശൂർ, കേരളം",
  phone: "+91 1234567890",
  upiId: "harithagrocery@upi"
});

  // Initial load
  onMounted(() => {
    fetchProducts();
  });

  return {
    showBillPreview,
    closeBillPreview,
    shopDetails,
    barcodeError,
    // State
    loading,
    error,
    processingSale,
    products,
    selectedProducts,
    quantities,
    customer,
    searchQuery,
    showBillPreview,
    billItems,
    billCustomer,
    billNumber,
    billSubtotal,
    billDiscount,
    billTax,
    billTotal,

    // Constants
    GST_RATE,
    DISCOUNT_RATE,
    DISCOUNT_THRESHOLD,

    availableProducts,

    // Computed
    cartItems,
    subtotal,
    discount,
    tax,
    total,

    // Methods
    fetchProducts,
    searchProducts,
    fetchProductByBarcode,
    handleBarcodeScan,
    handleSearch,
    selectProduct,
    addProductToBill,
    generateBill,
    printBill,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
  };
}
