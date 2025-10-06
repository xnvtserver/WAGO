<template>
  <div class="bg-gray-50 p-4 md:p-8">
    <div class="watermark text-blue-200 top-1/4 left-1/4">PURCHASE ORDER</div>
    
    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden print:shadow-none">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold">PURCHASE ORDER</h1>
            <p class="text-blue-100 mt-2">Retail Shop Management System</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-semibold">PO # <span class="bg-blue-500 px-3 py-1 rounded">{{ poNumber }}</span></div>
            <p class="mt-2 text-blue-100">Date: {{ currentDate }}</p>
            <button @click="printPage" class="no-print mt-3 bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              <i class="fas fa-print mr-1"></i> Print PO
            </button>
          </div>
        </div>
      </div>
      
      <!-- Company & Vendor Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
        <div>
          <h2 class="text-lg font-semibold text-blue-700 mb-3 flex items-center">
            <i class="fas fa-store mr-2"></i> From (Retailer)
          </h2>
          <div class="space-y-1">
            <p class="font-medium">{{ shop.name }}</p>
            <p>{{ shop.address }}</p>
            <p>{{ shop.city }}, {{ shop.state }} {{ shop.zip }}</p>
            <p><i class="fas fa-phone mr-1 text-blue-600"></i> {{ shop.phone }}</p>
            <p><i class="fas fa-envelope mr-1 text-blue-600"></i> {{ shop.email }}</p>
          </div>
        </div>
        
        <div>
          <h2 class="text-lg font-semibold text-blue-700 mb-3 flex items-center">
            <i class="fas fa-truck mr-2"></i> To (Vendor)
          </h2>
          <div class="mb-2">
            <label class="block text-sm text-gray-500 mb-1">Vendor Name</label>
            <select v-model="selectedSupplier" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier">
                {{ supplier.name }}
              </option>
            </select>
          </div>
          <div class="mb-2">
            <label class="block text-sm text-gray-500 mb-1">Vendor Address</label>
            <input type="text" v-model="selectedSupplier.address" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-500 mb-1">Contact</label>
              <input type="text" v-model="selectedSupplier.contact_name" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-1">Phone</label>
              <input type="text" v-model="selectedSupplier.contact_phone" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Shipping & Payment Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b bg-gray-50">
        <div class="space-y-4">
          <div>
            <h3 class="text-md font-medium text-blue-700 flex items-center mb-2">
              <i class="fas fa-shipping-fast mr-2"></i> Shipping Information
            </h3>
            <select v-model="shippingMethod" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option v-for="method in shippingMethods" :key="method" :value="method">{{ method }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-500 mb-1">Requested Delivery Date</label>
            <input type="date" v-model="deliveryDate" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <h3 class="text-md font-medium text-blue-700 flex items-center mb-2">
              <i class="fas fa-money-bill-wave mr-2"></i> Payment Terms
            </h3>
            <select v-model="paymentTerms" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option v-for="term in paymentTermsOptions" :key="term" :value="term">{{ term }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-500 mb-1">GST Rate (%)</label>
              <input type="number" v-model="gstRate" min="0" max="30" step="0.1" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-1">Discount (%)</label>
              <input type="number" v-model="discount" min="0" max="100" step="1" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Order Items Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider no-print">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in orderItems" :key="item.id" class="highlight-row">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select v-model="item.product_id" @change="updateProductInfo(index)" class="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option v-for="product in shopProducts" :key="product.id" :value="product.id">
                    {{ product.product_name }} ({{ product.sku }})
                  </option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="text" v-model="item.sku" readonly class="w-full px-2 py-1 border rounded bg-gray-100">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="mr-1">$</span>
                  <input type="number" v-model="item.unit_price" min="0" step="0.01" @input="calculateItemTotal(index)" class="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="number" v-model="item.quantity" min="0" @input="calculateItemTotal(index)" class="w-16 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">${{ itemTotal(item).toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium no-print">
                <button @click="removeItem(index)" class="text-red-600 hover:text-red-900">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="7" class="px-6 py-3 text-right no-print">
                <button @click="addNewItem" class="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
                  <i class="fas fa-plus-circle mr-1"></i> Add Item
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- Totals Section -->
      <div class="p-6 border-t bg-gray-50">
        <div class="flex justify-end">
          <div class="w-full md:w-1/3">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="font-medium">Subtotal:</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Discount ({{ discount }}%):</span>
                <span>${{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">GST ({{ gstRate }}%):</span>
                <span>${{ gstAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Shipping:</span>
                <span>${{ shippingCost.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between border-t pt-2 text-lg font-bold text-blue-700">
                <span>Grand Total:</span>
                <span>${{ grandTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Notes & Signatures -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-t">
        <div>
          <h3 class="text-md font-medium text-blue-700 mb-2 flex items-center">
            <i class="fas fa-sticky-note mr-2"></i> Notes
          </h3>
          <textarea v-model="notes" rows="4" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any special instructions for this order..."></textarea>
        </div>
        
        <div class="space-y-4">
          <div class="pb-4">
            <h3 class="text-md font-medium text-blue-700 mb-2 flex items-center">
              <i class="fas fa-file-signature mr-2"></i> Authorized By
            </h3>
            <div class="mt-6">
              <div class="mb-1">_________________________</div>
              <div class="text-sm text-gray-600 ml-4">Signature</div>
            </div>
            <div class="mt-6">
              <div class="mb-1">{{ user.name }}</div>
              <div class="text-sm text-gray-600">{{ user.role }}</div>
            </div>
            <div class="mt-2">
              <div class="text-sm text-gray-500">Date: {{ currentDate }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-4 bg-blue-50 text-center text-sm text-blue-700 border-t">
        <p>Thank you for your prompt processing of this order. Please reference PO #{{ poNumber }} on all correspondence.</p>
        <p class="mt-1">Email confirmations to <span class="font-medium">{{ shop.email }}</span></p>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="no-print mt-6 flex justify-end space-x-4 max-w-6xl mx-auto">
      <button @click="saveDraft" class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
        Save Draft
      </button>
      <button @click="submitOrder" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Submit Purchase Order
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePurchaseOrderStore } from '@/stores/purchaseOrderStore'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'

const route = useRoute()
const store = usePurchaseOrderStore()

// Shop data (would typically come from another store)
const shop = ref({
  id: parseInt(route.params.shopId),
  name: 'Mega Retail Solutions Inc.',
  address: '789 Commerce Street, Suite 305',
  city: 'Retail City',
  state: 'RC',
  zip: '98765',
  phone: '(555) 789-0123',
  email: 'orders@megaretail.com'
})

// User data (would come from auth)
const user = ref({
  name: 'Sarah Johnson',
  role: 'Purchasing Manager'
})

// Reactive data
const suppliers = ref([])
const shopProducts = ref([])
const selectedSupplier = ref({
  id: null,
  name: '',
  address: '',
  contact_name: '',
  contact_phone: '',
  gstin: ''
})
const shippingMethod = ref('Standard Ground (5-7 business days)')
const shippingMethods = ref([
  'Standard Ground (5-7 business days)',
  'Express Shipping (2-3 business days)',
  'Overnight Shipping',
  'Vendor Pickup'
])
const paymentTerms = ref('Net 15 Days')
const paymentTermsOptions = ref([
  'Net 30 Days',
  'Net 15 Days',
  'Net 60 Days',
  'Due on Receipt',
  '50% Advance, 50% on Delivery'
])
const deliveryDate = ref('')
const gstRate = ref(7.5)
const discount = ref(5)
const notes = ref('Please pack all fragile items with extra padding. Include all relevant documentation with the shipment.')
const orderItems = ref([])

// Generate PO number
const poNumber = computed(() => Math.floor(10000 + Math.random() * 90000).toString())

// Current date
const currentDate = computed(() => format(new Date(), 'MMMM d, yyyy'))

// Calculate item total
const itemTotal = (item) => {
  return (item.unit_price * item.quantity) || 0
}

// Calculate subtotal
const subtotal = computed(() => {
  return orderItems.value.reduce((sum, item) => {
    return sum + (item.unit_price * item.quantity)
  }, 0)
})

// Calculate discount
const discountAmount = computed(() => {
  return subtotal.value * (discount.value / 100)
})

// Calculate GST
const gstAmount = computed(() => {
  return (subtotal.value - discountAmount.value) * (gstRate.value / 100)
})

// Shipping cost
const shippingCost = computed(() => {
  if (shippingMethod.value.includes('Express')) return 45.00
  if (shippingMethod.value.includes('Overnight')) return 75.00
  if (shippingMethod.value.includes('Pickup')) return 0
  return 25.00
})

// Grand total
const grandTotal = computed(() => {
  return subtotal.value - discountAmount.value + gstAmount.value + shippingCost.value
})

// Add new item
const addNewItem = () => {
  orderItems.value.push({
    id: Date.now(),
    product_id: null,
    sku: '',
    product_name: '',
    quantity: 1,
    unit_price: 0,
    discount_per_item: 0,
    gst_rate_percentage: gstRate.value
  })
}

// Remove item
const removeItem = (index) => {
  orderItems.value.splice(index, 1)
}

// Update product info when selected
const updateProductInfo = (index) => {
  const productId = orderItems.value[index].product_id
  const product = shopProducts.value.find(p => p.id === productId)
  
  if (product) {
    orderItems.value[index].sku = product.sku
    orderItems.value[index].product_name = product.product_name
    orderItems.value[index].unit_price = product.purchase_price
    orderItems.value[index].gst_rate_percentage = gstRate.value
  }
}

// Calculate item total
const calculateItemTotal = (index) => {
  // Recalculate totals automatically via computed properties
}

// Print page
const printPage = () => {
  window.print()
}

// Save draft
const saveDraft = async () => {
  const orderData = {
    shop_id: shop.value.id,
    supplier_id: selectedSupplier.value.id,
    status: 'draft',
    order_date: new Date().toISOString().split('T')[0],
    expected_date: deliveryDate.value,
    total_amount: grandTotal.value,
    notes: notes.value,
    items: orderItems.value.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_per_item: item.discount_per_item,
      gst_rate_percentage: item.gst_rate_percentage
    }))
  }

  try {
    await store.createPurchaseOrder(orderData)
    alert('Purchase order draft saved successfully!')
  } catch (error) {
    console.error('Error saving draft:', error)
    alert('Failed to save draft. Please try again.')
  }
}

// Submit order
const submitOrder = async () => {
  const orderData = {
    shop_id: shop.value.id,
    supplier_id: selectedSupplier.value.id,
    status: 'ordered',
    order_date: new Date().toISOString().split('T')[0],
    expected_date: deliveryDate.value,
    total_amount: grandTotal.value,
    notes: notes.value,
    items: orderItems.value.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_per_item: item.discount_per_item,
      gst_rate_percentage: item.gst_rate_percentage
    }))
  }

  try {
    await store.createPurchaseOrder(orderData)
    alert('Purchase order submitted successfully!')
  } catch (error) {
    console.error('Error submitting order:', error)
    alert('Failed to submit order. Please try again.')
  }
}

// Initialize component
onMounted(async () => {
  // Set default delivery date to 7 days from now
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  deliveryDate.value = nextWeek.toISOString().split('T')[0]
  
  // Fetch data
  suppliers.value = await store.fetchSuppliers(shop.value.id)
  shopProducts.value = await store.fetchShopProducts(shop.value.id)
  
  // Set default supplier if available
  if (suppliers.value.length > 0) {
    selectedSupplier.value = {...suppliers.value[0]}
  }
  
  // Add initial empty item
  addNewItem()
})
</script>

<style scoped>
/* Same styles as original HTML */
.watermark {
  position: fixed;
  opacity: 0.1;
  font-size: 20rem;
  z-index: -1;
  transform: rotate(-30deg);
  pointer-events: none;
  user-select: none;
}

.print-only {
  display: none;
}

@media print {
  body {
    background-color: white;
  }
  .no-print {
    display: none;
  }
  .print-only {
    display: block;
  }
  .watermark {
    opacity: 0.05;
  }
}

.highlight-row:hover {
  background-color: #f1f5f9;
}

.signature-line {
  border-top: 1px dashed #333;
  position: relative;
  top: -10px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>