<template>
  <div v-if="error"
    class="error-boundary p-4 sm:p-6 bg-red-100 border-2 border-red-300 text-red-700 rounded-lg shadow-lg m-4 flex flex-col items-center justify-center min-h-screen">
    <div class="text-center">
      <i class="fas fa-exclamation-triangle text-4xl sm:text-5xl text-red-500 mb-3"></i>
      <h3 class="font-bold text-xl sm:text-2xl mb-2">ഒരു പിശക് സംഭവിച്ചു!</h3>
      <p class="text-sm sm:text-base mb-4 text-gray-700">
        {{ error.message || 'അജ്ഞാതമായ ഒരു പിശക് സംഭവിച്ചു. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.' }}
      </p>
      <button @click="retryOperation"
        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-md transition-colors duration-150 text-sm sm:text-base flex items-center justify-center">
        <i class="fas fa-redo mr-2"></i> വീണ്ടും ശ്രമിക്കുക
      </button>
    </div>
  </div>

  <div v-else :class="[isDark ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900']" class="min-h-screen bg-gray-100 p-2 sm:p-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div class="lg:col-span-2 space-y-4 sm:space-y-6">

        <div class="bg-dark rounded-xl shadow-lg bill-card p-3 sm:p-5">
          <div class="flex items-center justify-between mb-4 border-b border-green-200 pb-3">
            <h2 class="text-xl sm:text-2xl font-bold text-green-700">{{ shopDetails.name }} ബില്ലിംഗ് വിഭാഗം</h2>
            <!-- <button onclick="openScanner()"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center">
              <i class="fas fa-barcode mr-1"></i>
              <span data-ml="ബാർകോഡ്" data-en="Barcode">ബാർകോഡ്</span>
            </button> -->
            <!-- <button @click="themeStore.toggleTheme"
  class="px-4 py-2 rounded-md bg-gray-200 hover:bg-white-300 dark:bg-white-700 dark:hover:bg-white-600 transition">
  <span v-if="isDark">🌙 </span>
  <span v-else>☀️ </span>
</button> -->
          </div>

          <!--start of barcode section-->
          <div class="mb-4 sm:mb-5">
            <div class="relative">
              <input type="text" v-model.trim="barcodeInput" @keyup.enter="handleBarcodeScan"
                placeholder="ബാർക്കോഡ് സ്കാൻ ചെയ്യുക അല്ലെങ്കിൽ ബാർക്കോഡ് നൽകുക"
                :class="[isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-black']" class="red-placeholder w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base"
                :disabled="loading" />
              <i class="fas fa-barcode absolute right-3 top-3.5 text-gray-400"></i>
            </div>
            <p v-if="barcodeError" class="text-red-500 text-sm mt-1.5">{{ barcodeError }}</p>
          </div>
          <!-- end of barcode section -->
          <!-- start of product search section -->
          <div class="mb-4 relative">
            <input type="text" v-model="searchQuery" @keyup.enter="handleSearchEnter" placeholder="ഉൽപ്പന്നം തിരയുക..."
              :class="[isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-black']" class="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
            <ul v-if="filteredProducts.length"
              class="absolute z-10 w-full bg-white border shadow-lg mt-1 max-h-60 overflow-auto">
              <li v-for="product in filteredProducts" :key="product.id" @click="selectProduct(product)"
                class="p-2 hover:bg-gray-100 cursor-pointer">
                {{ product.name }} ({{ product.price }})
              </li>
            </ul>
          </div>
          <!-- end of product search section -->

          <div v-if="loading" class="text-center py-10">
            <i class="fas fa-spinner fa-spin text-3xl text-green-500"></i>
            <p class="mt-3 text-gray-600">ഉൽപ്പന്നങ്ങൾ ലോഡ് ചെയ്യുന്നു...</p>
          </div>
          <div v-else-if="products.length === 0 && !loading" class="text-center py-10 text-gray-500">
            <i class="fas fa-store-slash text-3xl mb-2"></i>
            <p>ക്ഷമിക്കണം, ഇപ്പോൾ ഉൽപ്പന്നങ്ങൾ ലഭ്യമല്ല.</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div v-for="product in selectedProducts" :key="product.id"
              class="border border-gray-200 rounded-lg p-3 transition-all duration-300 hover:shadow-md"
              :class="{ 'opacity-60 bg-gray-50': product.stock === 0 }">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div class="mb-2 sm:mb-0">
                  <h3 class="font-bold text-gray-800 text-md sm:text-lg">{{ product.name }}</h3>
                  <p class="text-sm text-gray-600">₹{{ product.price.toFixed(2) }} / കിലോ</p>
                  <p class="text-xs mt-1"
                    :class="product.stock > 0 && product.stock <= 5 ? 'text-orange-500 font-semibold' : product.stock === 0 ? 'text-red-600 font-bold' : 'text-gray-500'">
                    <span v-if="product.stock > 0">സ്റ്റോക്ക്: {{ product.stock }} കിലോ</span>
                    <span v-else>സ്റ്റോക്ക് ലഭ്യമല്ല</span>
                  </p>
                </div>
                <div class="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto justify-end">
                  <button @click="decrementQuantity(product.id)"
                    class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="getProductQuantity(product.id) <= 0 || product.stock === 0">
                    <i class="fas fa-minus text-sm"></i>
                  </button>
                  <input type="number" :value="getProductQuantity(product.id)"
                    @input="handleManualInput(product.id, $event)" min="0" :max="product.stock" step="1"
                    @focus="handleQuantityFocus(product.id)" @blur="handleQuantityBlur"
                    class="w-16 sm:w-20 h-8 text-center border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    :disabled="product.stock === 0" aria-label="Quantity for product" ref="quantityInput" />

                  <div v-if="isWeightInputActive" class="text-sm text-blue-600 mt-1">
                    <i class="fas fa-weight-hanging mr-2"></i>
                    {{ weightInput || '0.0' }}
                  </div>
                  <button @click="incrementQuantity(product.id)"
                    class="w-8 h-8 bg-green-200 hover:bg-green-300 text-green-800 rounded-md flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="getProductQuantity(product.id) >= product.stock || product.stock === 0">
                    <i class="fas fa-plus text-sm"></i>
                  </button>
                </div>
              </div>
              <div v-if="product.stock > 0"
                class="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                <span class="text-sm text-gray-500">ആകെ: </span>
                <span class="font-medium text-gray-800">₹{{ (getProductQuantity(product.id) * product.price).toFixed(2)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div :class="[isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-black']" class="bg-white rounded-xl shadow-lg bill-card p-3 sm:p-5">
          <h2 class="text-xl sm:text-2xl font-bold text-green-700 mb-4 border-b border-green-200 pb-3">വാങ്ങുന്ന ആളുടെ
            പേര് വിവരങ്ങൾ
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">പേര്</label>
              <input id="customerName" v-model="customer.name" type="text"
                :class="[isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-black']" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
                placeholder="ഉദാ: ശ്രീനിവാസൻ">
            </div>
            <div>
              <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-1">ഫോൺ നമ്പർ</label>
              <input id="customerPhone" v-model="customer.phone" type="tel"
                :class="[isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-black']" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
                placeholder="ഉദാ: 9xxxxxxxxx">
            </div>
            <div class="md:col-span-2">
              <label for="customerAddress" class="block text-sm font-medium text-gray-700 mb-1">വിലാസം</label>
              <textarea id="customerAddress" v-model="customer.address"
                :class="[isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-black']" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3"
                rows="2" placeholder="വീട്ടുപേര്, സ്ഥലം"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:sticky lg:top-4 sm:top-6">
        <div :class="[isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-black']" class="bg-white rounded-xl shadow-lg bill-card p-3 sm:p-5">
          <h2
            class="text-xl sm:text-2xl font-bold text-green-700 mb-4 border-b border-green-200 pb-3 flex justify-between items-center">
            <span>ബിൽ</span>
            <button v-if="cartItems.length > 0" @click="() => { clearCart(); removeProduct(product.id); }"
              title="Clear Cart"
              class="text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-150">
              <i class="fas fa-trash-alt mr-1"></i> ഒഴിവാക്കുക
            </button>
          </h2>
          <div class="space-y-2 mb-4 max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar pr-1">
            <div v-if="cartItems.length === 0" class="text-center py-6 text-gray-500">
              <i class="fas fa-shopping-cart text-2xl mb-2"></i>
              <p>ഇതുവരെ ഒന്നും തിരഞ്ഞെടുത്തിട്ടില്ല.</p>
            </div>
            <div v-for="item in cartItems" :key="item.id"
              class="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0">
              <div>
                <span class="block font-medium text-gray-700 text-sm">{{ item.name }}</span>
                <span class="text-xs text-gray-500">{{ item.quantity.toFixed(2) }} കിലോ × ₹{{ item.price.toFixed(2)
                }}</span>
              </div>
              <span class="font-semibold text-gray-800 text-sm">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-green-200 pt-3 space-y-1.5">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">ആകെ തുക</span>
              <span class="font-medium text-gray-700">₹{{ subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
              <span>ഡിസ്കൗണ്ട് ({{ (DISCOUNT_RATE * 100).toFixed(0) }}%)</span>
              <span>-₹{{ discount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">സി.ജി.എസ്.ടി ({{ (CGST_RATE * 100).toFixed(1) }}%)</span>
              <span class="font-medium text-gray-700">₹{{ cgst.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">എസ്.ജി.എസ്.ടി ({{ (SGST_RATE * 100).toFixed(1) }}%)</span>
              <span class="font-medium text-gray-700">₹{{ sgst.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">സെസ് ({{ (CESS_RATE * 100).toFixed(1) }}%)</span>
              <span class="font-medium text-gray-700">₹{{ cess.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm font-semibold">
              <span class="text-gray-800">മൊത്തം നികുതി:</span>
              <span class="text-gray-900">₹{{ tax.toFixed(2) }}</span>
            </div>
            <!-- <div class="flex justify-between text-sm">
              <span class="text-gray-600">ജിഎസ്ടി ({{ (GST_RATE * 100).toFixed(0) }}%)</span>
              <span class="font-medium text-gray-700">₹{{ tax.toFixed(2) }}</span>
            </div> -->
            <div class="flex justify-between font-bold text-lg sm:text-xl border-t border-gray-200 pt-2 mt-2">
              <span>മൊത്തം തുക</span>
              <span>₹{{ total.toFixed(2) }}</span>
            </div>
          </div>
<!-- Payment Method Selection -->
<div class="mt-4">
  <label class="block text-gray-700 font-medium mb-2">Payment Method</label>
  <div class="grid grid-cols-3 gap-3">
    <!-- Box: Cash -->
    <div
      @click="paymentMethod = 'cash'"
      :class="[
        'cursor-pointer border rounded-lg px-4 py-3 text-center transition',
        paymentMethod === 'cash' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-300 hover:border-green-400'
      ]"
    >
      <div class="text-2xl">💵</div>
      <div class="mt-1 font-semibold text-gray-700">പണം</div>
      <div class="text-sm text-gray-500">(Cash)</div>
    </div>

    <!-- Box: UPI -->
    <div
      @click="paymentMethod = 'upi'"
      :class="[
        'cursor-pointer border rounded-lg px-4 py-3 text-center transition',
        paymentMethod === 'upi' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-300 hover:border-green-400'
      ]"
    >
      <div class="text-2xl">📱</div>
      <div class="mt-1 font-semibold text-gray-700">യു.പി.ഐ</div>
      <div class="text-sm text-gray-500">(UPI)</div>
    </div>

    <!-- Box: Card -->
    <div
      @click="paymentMethod = 'card'"
      :class="[
        'cursor-pointer border rounded-lg px-4 py-3 text-center transition',
        paymentMethod === 'card' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-300 hover:border-green-400'
      ]"
    >
      <div class="text-2xl">💳</div>
      <div class="mt-1 font-semibold text-gray-700">കാർഡ്</div>
      <div class="text-sm text-gray-500">(Card)</div>
    </div>
  </div>
</div>


          <button @click="generateBill" :disabled="cartItems.length === 0 || processingSale"
            class="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 rounded-lg font-bold mt-5 sm:mt-6 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-lg">
            <i v-if="processingSale" class="fas fa-spinner fa-spin mr-2"></i>
            {{ processingSale ? 'തയ്യാറാക്കുന്നു...' : 'ബിൽ പ്രിന്റ് ചെയ്യുക' }}
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showBillPreview"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 transition-opacity duration-300"
        @click.self="closeBillPreview">
        <div
          class="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto bill-preview-content custom-scrollbar shadow-xl">

          <!-- shop details -->
          <div class="text-center mb-4 sm:mb-5">
            <h2 class="text-xl sm:text-2xl font-bold text-green-700">{{ shopDetails.name }}</h2>
            <p class="text-xs sm:text-sm text-gray-600">{{ shopDetails.address }}</p>
            <p class="text-xs sm:text-sm text-gray-600 mt-1">ഫോൺ: {{ shopDetails.phone }}</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-2">ബിൽ നമ്പർ: <span class="font-semibold">{{ billNumber
                }}</span></p>
            <p class="text-xs sm:text-sm text-gray-500">തീയതി:
              <span class="font-semibold">
                {{ new Date().toLocaleDateString('ml-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
              </span>
            </p>
          </div>

          <!-- customer details -->
          <div v-if="billCustomer.name || billCustomer.phone || billCustomer.address"
            class="border-t border-b border-gray-200 py-2 my-3 text-xs sm:text-sm">
            <h3 class="font-semibold text-gray-700 mb-1.5">ഉപഭോക്താവ്:</h3>
            <div v-if="billCustomer.name" class="flex justify-between">
              <span class="text-gray-600">പേര്:</span>
              <span class="font-medium text-gray-800">{{ billCustomer.name }}</span>
            </div>
            <div v-if="billCustomer.phone" class="flex justify-between">
              <span class="text-gray-600">ഫോൺ:</span>
              <span class="font-medium text-gray-800">{{ billCustomer.phone }}</span>
            </div>
            <div v-if="billCustomer.address" class="flex justify-between">
              <span class="text-gray-600">വിലാസം:</span>
              <span class="font-medium text-gray-800 text-right">{{ billCustomer.address }}</span>
            </div>
          </div>

          <!-- Item List -->
          <div class="mb-3 sm:mb-4">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr>
                  <th class="pb-1 font-semibold text-gray-700 border-b-2 border-gray-300">വിവരം</th>
                  <th class="pb-1 font-semibold text-gray-700 text-right border-b-2 border-gray-300">അളവ്</th>
                  <th class="pb-1 font-semibold text-gray-700 text-right border-b-2 border-gray-300">വില</th>
                  <th class="pb-1 font-semibold text-gray-700 text-right border-b-2 border-gray-300">തുക</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in billItems" :key="item.id" class="border-b border-gray-100 last:border-b-0">
                  <td class="py-1.5 text-gray-700">{{ item.name }}</td>
                  <td class="py-1.5 text-right text-gray-600">{{ item.quantity.toFixed(2) }} കിലോ</td>
                  <td class="py-1.5 text-right text-gray-600">₹{{ item.price.toFixed(2) }}</td>
                  <td class="py-1.5 text-right font-medium text-gray-800">₹{{ (item.price * item.quantity).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="border-t border-gray-300 pt-2 space-y-1 text-xs sm:text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">ആകെ തുക:</span>
              <span class="font-medium text-gray-800">₹{{ billSubtotal.toFixed(2) }}</span>
            </div>
            <div v-if="billDiscount > 0" class="flex justify-between text-green-600">
              <span>ഡിസ്കൗണ്ട് ({{ (DISCOUNT_RATE * 100).toFixed(0) }}%):</span>
              <span class="font-medium">-₹{{ billDiscount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">സി.ജി.എസ്.ടി ({{ (CGST_RATE * 100).toFixed(1) }}%)</span>
              <span class="font-medium text-gray-700">₹{{ cgst.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">എസ്.ജി.എസ്.ടി ({{ (SGST_RATE * 100).toFixed(1) }}%)</span>
              <span class="font-medium text-gray-700">₹{{ sgst.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">സെസ് ({{ (CESS_RATE * 100).toFixed(1) }}%)</span>
              <span class="font-medium text-gray-700">₹{{ cess.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm font-semibold">
              <span class="text-gray-800">മൊത്തം നികുതി:</span>
              <span class="text-gray-900">₹{{ tax.toFixed(2) }}</span>
            </div>
            <!-- <div class="flex justify-between">
          <span class="text-gray-600">ജിഎസ്ടി ({{ (GST_RATE * 100).toFixed(0) }}%):</span>
          <span class="font-medium text-gray-800">₹{{ billTax.toFixed(2) }}</span>
        </div> -->
            <div class="flex justify-between font-bold text-md sm:text-lg border-t-2 border-gray-300 pt-1.5 mt-1.5">
              <span>മൊത്തം അടയ്‌ക്കേണ്ട തുക:</span>
              <span>₹{{ billTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- QR Code -->
<div class="mt-4 border-t pt-4 text-center">
  <template v-if="upiId">
    <p class="text-sm text-gray-600 mb-2">സ്കാൻ ചെയ്ത് പണം അടയ്ക്കുക</p>
    <qrcode-vue :value="upiPaymentUrl" :size="160" level="H" class="mx-auto mb-2" />
    <p class="text-xs text-gray-500">{{ upiId }}</p>
  </template>
  <template v-else>
    <p class="text-sm text-red-600 mb-2">UPI ID ലഭ്യമായില്ല. ദയവായി ഷോപ്പിൽ യൂ പി ഐ ഐഡി ചേർക്കുക .</p>
  </template>
</div>

          <div class="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
            <p>നന്ദി! വീണ്ടും വരിക.</p>
          </div>

          <!-- Action Buttons -->
          <div
            class="mt-5 sm:mt-6 flex flex-col sm:flex-row justify-around space-y-2 sm:space-y-0 sm:space-x-3 bill-preview-actions">
            <button @click="printBill"
              class="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-150 text-sm sm:text-base">
              <i class="fas fa-print mr-1.5"></i> പ്രിന്റ്
            </button>
            <!-- Fixed: Use method instead of inline function -->
            <button @click="confirmClose"
              class="w-full sm:w-auto flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-150 text-sm sm:text-base">
              <i class="fas fa-times mr-1.5"></i> അടയ്ക്കുക
            </button>

          </div>

        </div>
      </div>
    </transition>
  </div>

  <!-- QR Scanner Modal (new functionality) -->
  <div v-if="showScanner" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-4 w-full max-w-md">
      <h3 class="text-lg font-bold mb-3">QR/Barcode Scanner</h3>
      <div class="scanner-container relative" style="height: 300px">
        <!-- Video element for camera stream -->
        <video ref="scannerVideo" class="w-full h-full object-cover border rounded-lg"></video>
        <!-- Visual scanning indicator -->
        <div class="scanner-overlay absolute inset-0 flex items-center justify-center">
          <div class="scanner-frame border-2 border-blue-400 rounded-lg w-64 h-64"></div>
        </div>
      </div>
      <div class="mt-4 flex justify-between">
        <button @click="closeScanner" class="bg-gray-500 text-white px-4 py-2 rounded">
          അടയ്ക്കുക
        </button>
        <button @click="toggleCamera" class="bg-blue-500 text-white px-4 py-2 rounded">
          {{ usingFrontCamera ? 'പിന്നിലെ ക്യാമറ' : 'മുന്നിലെ ക്യാമറ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive, nextTick, onBeforeUnmount } from 'vue';
import { useAuthStore } from '../stores/auth';
import QrcodeVue from 'qrcode.vue';
import { BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
const isDark = themeStore.isDark;
const paymentMethod = ref('upi') // default selection

const set_default_product_quantity = 1;
const activeProductId = ref<string | null>(null);
const weightInput = ref('');
const isWeightInputActive = ref(false);
const hasManualInput = ref(false);
const currentWeight = ref(0);
// const selectedProducts = ref([]);
const selectedProducts = ref<Product[]>([]);
// Adding WebSocket connection for weighing machine
const ws = ref<WebSocket | null>(null);
const refreshKey = ref(0);
// --- Barcode input and error state ---
const barcodeInput = ref('');
const barcodeError = ref('');
// New variables that were undefined
const invoiceNumber = ref(''); // Initialize with an empty string or suitable default
const supplyType = ref(''); // Initialize with an empty string or suitable default
const totalTaxableValue = ref(0); // Initialize with 0
const totalCgstAmount = ref(0); // Initialize with 0
const totalSgstAmount = ref(0); // Initialize with 0
const totalIgstAmount = ref(0); // Initialize with 0
const totalCessAmount = ref(0); // Initialize with 0
const documentType = ref('invoice'); // Initialize with default
const isB2B = ref(false); // Initialize with default
const isReverseCharge = ref(false); // Initialize with default

//also need these for the bill preview if you added them:
const billTotalTaxableValue = ref(0);
const billTotalCgstAmount = ref(0);
const billTotalSgstAmount = ref(0);
const billTotalIgstAmount = ref(0);
const billTotalCessAmount = ref(0);

// --- QR Scanner Implementation ---
const showScanner = ref(false);
const scannerVideo = ref<HTMLVideoElement | null>(null);
const codeReader = new BrowserMultiFormatReader();
const scanActive = ref(false);
const usingFrontCamera = ref(false);
let currentDeviceId: string | null = null;

// Available cameras
const cameras = ref<MediaDeviceInfo[]>([]);

const upiId = ref(null); // this will hold the UPI ID

// Open scanner
const openScanner = async () => {
  try {
    document.getElementById('scanner-modal').classList.remove('hidden');
    // Reset state
    barcodeError.value = '';
    showScanner.value = true;

    // Get available cameras
    cameras.value = await codeReader.listVideoInputDevices();

    // Start scanning when modal is shown
    await nextTick();
    startScanning();
  } catch (err) {
    console.error('Scanner error:', err);
    barcodeError.value = 'സ്കാനർ തുറക്കാൻ കഴിഞ്ഞില്ല. ക്യാമറ അനുവദനീയമാണെന്ന് ഉറപ്പാക്കുക.';
  }
};

// Start scanning process
const startScanning = async () => {
  if (!scannerVideo.value) return;

  try {
    scanActive.value = true;

    // Select camera (front or back)
    const cameraId = usingFrontCamera.value
      ? cameras.value.find(cam => cam.label.includes('front'))?.deviceId
      : cameras.value[0]?.deviceId;

    // Start decoding
    codeReader.decodeFromVideoDevice(
      cameraId || undefined,
      scannerVideo.value,
      (result) => {
        if (result) {
          barcodeInput.value = result.getText();
          closeScanner();
          handleBarcodeScan();
        }
      }
    );
  } catch (err) {
    console.error('Scanning error:', err);
    barcodeError.value = 'സ്കാൻ ചെയ്യുന്നതിൽ പിശക് സംഭവിച്ചു.';
  }
};

// Stop scanning
const stopScanning = () => {
  if (scanActive.value) {
    codeReader.reset();
    scanActive.value = false;
  }
};

// Close scanner
const closeScanner = () => {
  stopScanning();
  showScanner.value = false;
};

// Switch between front/back camera
const toggleCamera = () => {
  usingFrontCamera.value = !usingFrontCamera.value;
  stopScanning();
  startScanning();
};

// Clean up when component unmounts
onBeforeUnmount(() => {
  stopScanning();
});

function confirmClose() {
  if (confirm('നിലവിലുള്ള ബിൽ ക്ലോസ് ചെയ്യണോ? മാറ്റങ്ങൾ നഷ്ടപ്പെടും.')) {
    closeBillPreview();
  }
};

const selectProduct = (product) => {
  const exists = selectedProducts.value.find(p => p.id === product.id);
  if (!exists) {
    selectedProducts.value.push({ ...product });
  }

  const step = product.name.toLowerCase() ? set_default_product_quantity : 1;
  const currentQty = quantities[product.id] ?? 0;
  const newQty = Math.min(currentQty + step, product.stock);
  quantities[product.id] = newQty;

  searchQuery.value = '';
  filteredProducts.value = [];
};

const removeProduct = (productId) => {
  this.selectedProducts = this.selectedProducts.filter(p => p.id !== productId);
};

// --- Handle Barcode Scan Method ---
const handleBarcodeScan = async () => {
  barcodeError.value = '';
  const barcode = barcodeInput.value.trim();

  if (!barcode) {
    barcodeError.value = 'ദയവായി ഒരു ബാർക്കോഡ് നൽകുക';
    return;
  }

  try {
    const response = await authStore.apiFetch(`/v1/billing/products/by-barcode/${barcode}`);

    if (!response?.product) {
      barcodeError.value = 'ബാർക്കോഡ് സാധുവല്ല';
      barcodeInput.value = '';
      return;
    }

    const product = products.value.find(p => p.id === response.product.id);

    if (!product) {
      barcodeError.value = 'ഉൽപ്പന്നം ലഭ്യമല്ല';
      barcodeInput.value = '';
      return;
    }

    if (product.stock <= 0) {
      barcodeError.value = 'ഈ ഉൽപ്പന്നത്തിന് സ്റ്റോക്ക് ലഭ്യമല്ല';
      barcodeInput.value = '';
      return;
    }

    // NEW: Add to selectedProducts if not already there
    const exists = selectedProducts.value.find(p => p.id === product.id);
    if (!exists) {
      selectedProducts.value.push(product);
    }

    const currentQty = getProductQuantity(product.id);
    const step = product.name.toLowerCase() ? 1 : 1;

    if ((currentQty + step) > product.stock) {
      barcodeError.value = `പരമാവധി സ്റ്റോക്ക്: ${product.stock.toFixed(1)} കിലോ`;
      return;
    }

    incrementQuantity(product.id);
    barcodeInput.value = '';

  } catch (err) {
    handleError(err, 'barcodeScan');
    barcodeError.value = 'ബാർക്കോഡ് പ്രോസസ്സ് ചെയ്യുന്നതിൽ പിശക്';
  }
};

// --- TypeScript Interfaces (assuming these are correct) ---
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}
interface CartItem extends Product {
  quantity: number;
}
interface Customer {
  name: string;
  phone: string;
  address: string;
}

// --- Component State ---
const loading = ref(true);
const processingSale = ref(false);
const products = ref<Product[]>([]);
const quantities = reactive<{ [key: string]: number }>({});
const error = ref<Error | null>(null);

const customer = ref<Customer>({ name: '', phone: '', address: '' });

// --- Pinia Store ---
const authStore = useAuthStore();
// Use a computed property to access the getter reactively
const userShopName = computed(() => authStore.userShopName);
// NEW: Computed property for shop details from authStore
const shopDetails = computed(() => {
  const storeShop = authStore.currentShop;
  // Ensure storeShop and its properties are accessed safely, providing fallbacks
  const name = storeShop?.name || 'ഹരിത ഫ്രഷ് മാർക്കറ്റ് (വിവരം ലഭ്യമല്ല)';
  const address = storeShop?.address || 'വിലാസം ലഭ്യമല്ല';
  const phone = storeShop?.phone || 'ഫോൺ നമ്പർ ലഭ്യമല്ല';
  // const gst = storeShop?.gst_number || 'GSTIN ലഭ്യമല്ല'; // Example for another field
  return { name, address, phone /*, gst */ };
});

// Fetch UPI ID using apiFetch from the store
async function fetchUPI() {
  loading.value = true;
  error.value = null;
  try {
    // Assuming useAuthStore is a function that returns the store instance
    const store = useAuthStore();
    const activeShop = store.activeShop;
    const data = await store.apiFetch(`/utility/shops/${activeShop}/upi`);
    upiId.value = data.upi_id;
  } catch (err) {
    console.error('Error fetching UPI ID:', err);
    error.value = err.message || 'Failed to fetch UPI ID';
  } finally {
    loading.value = false;
  }
}

// UPI URL computed
const upiPaymentUrl = computed(() => {
  // Use the reactive upiId value instead of fetchUPI.upiId (fetchUPI is a function, no upiId property)
  const upi = upiId.value;
  return `upi://pay?pa=${encodeURIComponent(upi)}&am=${billTotal.value.toFixed(2)}&cu=INR`;
});

function refresh() {
  refreshKey.value++;
}
function refreshBrowser() {
  // ✅ Reset cart by clearing quantities (since cartItems is computed)
  Object.keys(quantities).forEach(productId => {
    quantities[productId] = 0;
  });

  // ✅ Reset form and state
  showBillPreview.value = false;
  processingSale.value = false; // ✅ Use .value
  resetForm();
}

// Add search functionality
const searchQuery = ref('');
const filteredProducts = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.barcode?.includes(query)
  );
});

const handleSearchEnter = () => {
  if (filteredProducts.value.length) {
    selectProduct(filteredProducts.value[0]);
  }
};

// Bill Preview State
const showBillPreview = ref(false);
const billNumber = ref('');
const billItems = ref<CartItem[]>([]);
const billCustomer = ref<Customer>({ name: '', phone: '', address: '' });
const billSubtotal = ref(0);
const billDiscount = ref(0);
const billTax = ref(0);
const billTotal = ref(0);

// --- Constants ---
// const GST_RATE = 0.05; // Total GST (5%)
const CGST_RATE = 0.025; // 2.5%
const SGST_RATE = 0.025; // 2.5%
const CESS_RATE = 0.01; // example: 1% cess, adjust as needed
const DISCOUNT_RATE = 0.02;
const DISCOUNT_THRESHOLD = 100;


// --- Error Handling ---
const handleError = (err: any, context?: string) => {
  const errorMessage = err instanceof Error ? err.message : String(err.message || err || 'An unknown error occurred.');
  console.error(`Error during ${context || 'operation'}:`, err); // Keep detailed log
  error.value = new Error(errorMessage); // Set for the error boundary
};

const retryOperation = async () => {
  error.value = null;
  loading.value = true;
  await fetchProducts();
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Initialize WebSocket connection to local weighing machine bridge
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
  // Initialize auth store if it has an async initialize method and it's not auto-called
  // if (authStore.isInitialized === false && typeof authStore.initialize === 'function') {
  //   await authStore.initialize();
  // }
  await fetchProducts();
});

const handleManualInput = (productId: string, event: Event) => {
  hasManualInput.value = true;
  const value = (event.target as HTMLInputElement).value;
  updateQuantity(productId, value);
};

const updateQuantityFromMachine = (productId: string, weight: number) => {
  const product = products.value.find(p => p.id === productId);
  if (!product) return;

  const precision = product.name.toLowerCase().includes('തേങ്ങ') ? 0 : 1;
  const finalQuantity = Math.min(weight, product.stock);
  quantities[productId] = parseFloat(finalQuantity.toFixed(precision));
};


onBeforeUnmount(() => {
  if (ws.value) {
    ws.value.close();
  }
});

// Add focus/blur handlers
const handleQuantityFocus = (productId: string) => {
  activeProductId.value = productId;
  isWeightInputActive.value = true;
  hasManualInput.value = false;
  weightInput.value = '0.0';
  //   currentWeight.value = 0;// Optional: Clear previous weight measurement
  // // Focus on the input to allow manual override
  // nextTick(() => {
  //   const input = document.querySelector(`[data-product-id="${productId}"]`) as HTMLInputElement;
  //   if (input) {
  //     input.focus();
  //     input.select();
  //   }
  // });
};

const handleQuantityBlur = () => {
  isWeightInputActive.value = false;
  activeProductId.value = null;
};

// Modify updateQuantity function to handle manual input
const updateQuantity = (productId: string, newQuantityValue: string | number) => {
  const product = products.value.find(p => p.id === productId);
  if (!product) return;

  // Use manual input if available, otherwise use weight input
  let numQuantity = typeof newQuantityValue === 'string' ?
    parseFloat(newQuantityValue) :
    newQuantityValue;

  if (isNaN(numQuantity) || numQuantity < 0) numQuantity = 0;

  const precision = product.name.toLowerCase().includes('തേങ്ങ') ? 0 : 1;
  const finalQuantity = Math.min(numQuantity, product.stock);

  quantities[productId] = parseFloat(finalQuantity.toFixed(precision));

  // Clear weight input after update
  weightInput.value = '';
};
// --- Product & Quantity Logic (existing functions presumed okay, but check for unhandled errors) ---
const fetchProducts = async () => {
  try {
    error.value = null;
    loading.value = true;
    const response = await authStore.apiFetch('/v1/billing/products');
    if (response && response.products) {
      products.value = response.products.map((p: any) => ({
        ...p,
        price: parseFloat(p.price),
        stock: parseFloat(p.stock)
      }));
      products.value.forEach(product => {
        quantities[product.id] = quantities[product.id] || 0;
      });
    } else {
      handleError(new Error(response?.message || 'ഉൽപ്പന്നങ്ങൾ ലോഡ് ചെയ്യുന്നതിൽ പിഴവ് സംഭവിച്ചു.'), 'fetchProducts');
    }
  } catch (err) {
    handleError(err, 'fetchProducts');
  } finally {
    loading.value = false;
  }
};

const getProductQuantity = (productId: string): number => quantities[productId] || 0;

const incrementQuantity = (productId: string) => {
  const product = products.value.find(p => p.id === productId);
  if (product && product.stock > 0) {
    const currentQuantity = getProductQuantity(productId);
    const incrementStep = product.name.toLowerCase().includes('തേങ്ങ') ? 1 : 1; // Example: whole units for coconut
    let newQuantity = parseFloat((currentQuantity + incrementStep).toFixed(product.name.toLowerCase().includes('തേങ്ങ') ? 0 : 2));
    if (newQuantity > product.stock) newQuantity = product.stock;
    quantities[productId] = newQuantity;
  }
};

const decrementQuantity = (productId: string) => {
  const currentQuantity = getProductQuantity(productId);
  if (currentQuantity > 0) {
    const decrementStep = products.value.find(p => p.id === productId)?.name.toLowerCase().includes('തേങ്ങ') ? 1 : 0.1;
    quantities[productId] = parseFloat(Math.max(0, currentQuantity - decrementStep).toFixed(products.value.find(p => p.id === productId)?.name.toLowerCase().includes('തേങ്ങ') ? 0 : 2));
  }
};

// const updateQuantity = (productId: string, newQuantityValue: string | number) => {
//   const product = products.value.find(p => p.id === productId);
//   if (!product) return;
//   let numQuantity = typeof newQuantityValue === 'string' ? parseFloat(newQuantityValue) : newQuantityValue;
//   if (isNaN(numQuantity) || numQuantity < 0) numQuantity = 0;
//   const precision = product.name.toLowerCase().includes('തേങ്ങ') ? 0 : 2;
//   quantities[productId] = parseFloat(Math.min(Math.max(0, numQuantity), product.stock).toFixed(precision));
// };


// --- Cart & Billing Computeds (existing) ---
const cartItems = computed<CartItem[]>(() => products.value
  .filter(product => getProductQuantity(product.id) > 0)
  .map(product => ({ ...product, quantity: getProductQuantity(product.id) })));
const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0));
const discount = computed(() => subtotal.value > DISCOUNT_THRESHOLD ? subtotal.value * DISCOUNT_RATE : 0);
const taxableAmount = computed(() => subtotal.value - discount.value);

const cgst = computed(() => taxableAmount.value * CGST_RATE);
const sgst = computed(() => taxableAmount.value * SGST_RATE);
const cess = computed(() => taxableAmount.value * CESS_RATE);
const tax = computed(() => cgst.value + sgst.value + cess.value);
// const tax = computed(() => (subtotal.value - discount.value) * GST_RATE);
const total = computed(() => Math.max(0, subtotal.value - discount.value + tax.value));

// --- Actions (with fixes) ---
const clearCart = () => {
  if (confirm('കാർട്ടിലുള്ള എല്ലാ ഉൽപ്പന്നങ്ങളും ഒഴിവാക്കണോ?')) {
    products.value.forEach(product => { quantities[product.id] = 0; });
  }
};

const resetForm = () => {
  nextTick(() => {
    products.value.forEach(product => { quantities[product.id] = 0; });
    customer.value = { name: '', phone: '', address: '' };
  });
};

// Define paymentDetails as a reactive reference
const paymentDetails = ref({
  method: '',         // e.g., 'cash', 'upi', 'card'
  amount_paid: 0,     // total amount received
  transaction_id: ''  // optional for UPI/card
})
const generateBill = async () => {
  if (cartItems.value.length === 0) {
    alert('ദയവായി ഉൽപ്പന്നങ്ങൾ കാർട്ടിലേക്ക് ചേർക്കുക.'); // Please add products to the cart.
    return;
  }
  // FIX: Set processing state here only
  processingSale.value = true;
  error.value = null;

  // --- Gather GST and billing related data with fallbacks ---
  const currentInvoiceNumber = invoiceNumber.value || `INV-${Date.now()}`;
  const currentSupplyType = supplyType.value || 'intra_state';
  const currentTotalTaxableValue = totalTaxableValue.value || 0.00;
  const currentTotalCgstAmount = totalCgstAmount.value || 0.00;
  const currentTotalSgstAmount = totalSgstAmount.value || 0.00;
  const currentTotalIgstAmount = totalIgstAmount.value || 0.00;
  const currentTotalCessAmount = totalCessAmount.value || 0.00;
  const currentDocumentType = documentType.value || 'invoice';
  const currentIsB2B = isB2B.value || false;
  const currentIsReverseCharge = isReverseCharge.value || false;

  // --- Basic Validation ---
  if (!currentInvoiceNumber) {
    alert('ഇൻവോയ്സ് നമ്പർ നിർബന്ധമാണ്.');
    processingSale.value = false;
    return;
  }
  if (!currentSupplyType) {
    alert('സപ്ലൈ തരം നിർബന്ധമാണ് (ഉദാ: ഇൻട്രാ-സ്റ്റേറ്റ്, ഇൻ്റർ-സ്റ്റേറ്റ്).');
    processingSale.value = false;
    return;
  }

  try {
    // --- Prepare Cart Items for Submission ---
    const itemsToProcess = cartItems.value.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_sale: item.price,
      cgst_rate: CGST_RATE,
      sgst_rate: SGST_RATE,
      cess_rate: CESS_RATE

    }));

    // --- Update Bill Preview State ---
    billItems.value = [...cartItems.value];
    billCustomer.value = { ...customer.value };
    billSubtotal.value = subtotal.value;
    billDiscount.value = discount.value;
    billTotal.value = total.value;
    billTotalTaxableValue.value = currentTotalTaxableValue;
    billTotalCgstAmount.value = currentTotalCgstAmount;
    billTotalSgstAmount.value = currentTotalSgstAmount;
    billTotalIgstAmount.value = currentTotalIgstAmount;
    billTotalCessAmount.value = currentTotalCessAmount;

    // --- API Request ---
    const response = await authStore.apiFetch('/v1/billing/process-sale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: customer.value?.id || null,
        customer_gstin: customer.value?.gstin || null,
        billCustomer : billCustomer.value,
        invoice_number: currentInvoiceNumber,
        document_type: currentDocumentType,
        supply_type: currentSupplyType,
        is_b2b: currentIsB2B,
        is_reverse_charge: currentIsReverseCharge,
        items: itemsToProcess,
        discount: billDiscount.value,
        total_taxable_value: currentTotalTaxableValue,
        total_cgst_amount: currentTotalCgstAmount,
        total_sgst_amount: currentTotalSgstAmount,
        total_igst_amount: currentTotalIgstAmount,
        total_cess_amount: currentTotalCessAmount,
        total_amount: billTotal.value,
        payment_details: paymentMethod.value || {},
      })
    });

    // --- Handle API Response ---
    if (response && response.success) {
      billNumber.value = response.sale_id || currentInvoiceNumber;
      showBillPreview.value = true;

      await fetchProducts(); // Refresh stock or product list

      // Optional: reset form fields
      // resetForm();
    } else {
      const errorMessage = response?.details || response?.error || 'ബിൽ പ്രോസസ്സ് ചെയ്യുന്നതിൽ പിഴവ് സംഭവിച്ചു.';
      handleError(new Error(errorMessage), 'generateBill');
      alert(`ബിൽ പ്രോസസ്സ് ചെയ്യുന്നതിൽ പിഴവ്: ${errorMessage}`);
    }

  } catch (err) {
    console.error('Bill generation error:', err);
    handleError(err, 'generateBill');
    alert(`ബിൽ പ്രോസസ്സ് ചെയ്യുന്നതിൽ പിഴവ്: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    processingSale.value = false;
    refresh();
    refreshBrowser();
  }
};


// FIXED: Create a proper close method
const closeBillPreview = () => {
  showBillPreview.value = false;
  processingSale.value = false;

  // Reset preview state
  billItems.value = [];
  billCustomer.value = { name: '', phone: '', address: '' };
  billNumber.value = '';
  billSubtotal.value = 0;
  billDiscount.value = 0;
  billTax.value = 0;
  billTotal.value = 0;

  // Reset main form
  resetForm();
  window.location.reload(); // force browser refresh --> temp fix for the issue The issue is that processingSale isn't properly reset after bill generation.

};

const printBill = () => {
  nextTick(async () => {
    if (error.value) {
      alert("നിലവിൽ ഒരു പിശക് കാണിക്കുന്നു. പ്രിന്റ് ചെയ്യുന്നതിന് മുമ്പ് ദയവായി അത് പരിഹരിക്കുക.");
      return;
    }
    // if (!showBillPreview.value) {
    //   // This case should ideally not happen if print button is only in the preview
    //   alert("ബിൽ പ്രിവ്യൂ ദൃശ്യമല്ല kk. പ്രിന്റ് ചെയ്യാൻ കഴിയില്ല.");
    //   return;
    // }

    const printContentsElement = document.querySelector('.bill-preview-content');
    if (!printContentsElement) {
      alert('പ്രിന്റ് ചെയ്യാനുള്ള ബിൽ ഉള്ളടക്കം കണ്ടെത്താനായില്ല.');
      return;
    }

    const printWindow = window.open('', '_blank', 'height=700,width=900');
    if (!printWindow) {
      alert('പ്രിന്റ് വിൻഡോ തുറക്കാൻ കഴിഞ്ഞില്ല. നിങ്ങളുടെ ബ്രൗസർ പോപ്പ്-അപ്പ് ക്രമീകരണങ്ങൾ പരിശോധിക്കുക.');
      return;
    }

    try {
      const clonedContent = printContentsElement.cloneNode(true) as HTMLElement;
      const actionsDiv = clonedContent.querySelector('.bill-preview-actions');
      if (actionsDiv) actionsDiv.remove();

      // Use shopDetails for dynamic shop info in print
      const currentShopDetails = shopDetails.value;

      const headHTML = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bill Receipt - ${currentShopDetails.name}</title>
        <style>
          body { font-family: 'Noto Sans Malayalam UI', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #333; font-size: 13px; line-height: 1.5; }
          .text-center { text-align: center; } .mb-4 { margin-bottom: 1rem; } .mb-5 { margin-bottom: 1.25rem; }
          .mt-1 { margin-top: 0.25rem; } .mt-2 { margin-top: 0.5rem; } .mt-5 { margin-top: 1.25rem; }
          .py-1_5 { padding-top: 0.375rem; padding-bottom: 0.375rem; } .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .my-3 { margin-top: 0.75rem; margin-bottom: 0.75rem; }
          .border-t { border-top: 1px solid #e2e8f0; } .border-b { border-bottom: 1px solid #e2e8f0; }
          .border-gray-100 { border-color: #f3f4f6; } .border-gray-200 { border-color: #e2e8f0; } .border-gray-300 { border-color: #cbd5e1; }
          .border-b-2 { border-bottom-width: 2px; }
          .pt-1_5 { padding-top: 0.375rem; } .pt-2 { padding-top: 0.5rem; }
          .space-y-1 > * + * { margin-top: 0.25rem; } .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .font-medium { font-weight: 500; } .font-semibold { font-weight: 600; } .font-bold { font-weight: 700; }
          .text-xs { font-size: 0.75rem; } .text-sm { font-size: 0.875rem; } .text-md { font-size: 1rem; } .text-lg { font-size: 1.125rem; }
          .text-green-700 { color: #047857; } .text-gray-600 { color: #4b5563; } .text-gray-500 { color: #6b7280; } .text-gray-700 { color: #374151; } .text-gray-800 { color: #1f2937; }
          .text-green-600 { color: #059669; } .text-right { text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; margin-bottom: 0.5rem; }
          th, td { padding: 6px 3px; vertical-align: top; }
          th { text-align: left; border-bottom: 2px solid #4b5563; }
          tr.border-b { border-bottom: 1px solid #f3f4f6; }
          tr.last\\:border-b-0:last-child { border-bottom: 0; } /* Adjusted for colon escaping */
          td.text-right, th.text-right { text-align: right; }
          .bill-preview-actions { display: none !important; }
          @media print { body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>`;
      const bodyHTML = clonedContent.innerHTML;

      printWindow.document.open();
      printWindow.document.write(`<!DOCTYPE html><html><head>${headHTML}</head><body>${bodyHTML}</body></html>`);
      printWindow.document.close(); // Important: Finish document loading

      // Delay print command slightly to ensure content is rendered
      await new Promise(resolve => setTimeout(resolve, 250));

      printWindow.focus(); // Focus the new window
      printWindow.print(); // This will block until print dialog is closed

      // Optional: A longer timeout before attempting to close, but generally not needed
      // as the user or browser might close the print window/tab.
      // setTimeout(() => {
      //   if (printWindow && !printWindow.closed) {
      //     printWindow.close();
      //   }
      // }, 2000);

    } catch (err) {
      handleError(err, 'printBill (execution)');
      alert(`പ്രിന്റ് തയ്യാറാക്കുന്നതിൽ പിഴവ്: ${err instanceof Error ? err.message : String(err)}`);
      if (printWindow && !printWindow.closed) {
        printWindow.close(); // Close only if an error occurred during setup/print
      }
    }
  });
};

onMounted(() => {
  fetchUPI();
  themeStore.initTheme();
});
</script>
<style>
/* place holder display in red color  */
.red-placeholder::placeholder {
  color: rgb(4, 4, 4);
}

/* Scanner overlay styling */
.scanner-overlay {
  background: rgba(0, 0, 0, 0.3);
}

.scanner-frame {
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
}

/* Animation for scanning effect */
@keyframes scan {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(100%);
  }
}

.scanner-frame::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(59, 130, 246, 0.8);
  animation: scan 2s infinite linear;
}
</style>
