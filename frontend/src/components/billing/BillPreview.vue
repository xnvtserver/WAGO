<!-- src/components/billing/BillPreview.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center mb-4">
          <h3 class="text-lg font-bold">ഹരിത പച്ചക്കറി കട</h3>
          <p class="text-xs text-gray-600">തൃശൂർ, കേരളം</p>
        </div>
        
        <!-- Customer Details -->
        <div class="text-xs mb-4">
          <p>ഉപഭോക്താവ്: {{ customer.name || "ക്ലയന്റ്" }}</p>
          <p>ഫോൺ: {{ customer.phone || "N/A" }}</p>
          <p>തീയതി: {{ currentDate }}</p>
        </div>
  
        <!-- Bill Items -->
        <table class="w-full text-xs mb-2">
          <thead>
            <tr class="border-b">
              <th class="text-left py-1">പച്ചക്കറി</th>
              <th class="text-right py-1">അളവ്</th>
              <th class="text-right py-1">തുക</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id">
              <td class="py-1">{{ item.name }}</td>
              <td class="text-right py-1">{{ item.quantity.toFixed(2) }} കിലോ</td>
              <td class="text-right py-1">₹{{ (item.quantity * item.price).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Totals -->
        <table class="w-full text-xs">
        <tbody>
            <tr class="border-t">
            <td class="py-1">ആകെ തുക</td>
            <td class="text-right py-1">₹{{ subtotal.toFixed(2) }}</td>
            </tr>
            <tr>
            <td class="py-1">ഡിസ്കൗണ്ട് (5%)</td>
            <td class="text-right py-1">₹{{ discount.toFixed(2) }}</td>
            </tr>
            <tr>
            <td class="py-1">ജിഎസ്ടി (5%)</td>
            <td class="text-right py-1">₹{{ tax.toFixed(2) }}</td>
            </tr>
            <tr class="border-t font-bold">
            <td class="py-1">മൊത്തം തുക</td>
            <td class="text-right py-1">₹{{ total.toFixed(2) }}</td>
            </tr>
        </tbody>
        </table>
  
        <div class="text-center text-xs mt-4">
          <p>നന്ദി! വീണ്ടും വരൂ!</p>
        </div>
  
        <!-- Actions -->
        <div class="mt-6 flex gap-4">
          <button 
            @click="printBill"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold"
          >
            <i class="fas fa-print mr-2"></i> പ്രിന്റ്
          </button>
          <button 
            @click="$emit('close')"
            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-bold"
          >
            അടയ്ക്കുക
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    customer: Object,
    cartItems: Array,
    subtotal: Number,
    discount: Number,
    tax: Number,
    total: Number
  })
  
  const emit = defineEmits(['close'])
  
  const currentDate = computed(() => 
    new Date().toLocaleDateString('ml-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  )
  
  const printBill = () => {
    const printContent = `
    <div class="bill-print-content">
      <div class="text-center mb-4">
        <h3 class="text-lg font-bold">ഹരിത പച്ചക്കറി കട</h3>
        <p class="text-xs text-gray-600">തൃശൂർ, കേരളം</p>
      </div>
      
      <!-- Add rest of the bill content using props -->
      <div class="text-xs mb-4">
        <p>ഉപഭോക്താവ്: ${props.customer.name || "ക്ലയന്റ്"}</p>
        <p>ഫോൺ: ${props.customer.phone || "N/A"}</p>
        <p>തീയതി: ${currentDate.value}</p>
      </div>

      <!-- Add all other bill sections using props data -->
      
    </div>
  `
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Bill Print</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;700&display=swap');
          body { font-family: 'Noto Sans Malayalam', sans-serif; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
  }
  </script>
  
  <style scoped>
  .bill-print-content {
    width: 80mm;
    margin: 0 auto;
    padding: 10px;
    font-family: 'Noto Sans Malayalam', sans-serif;
  }
  </style>