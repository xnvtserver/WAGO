<template>
  <Modal title="പർച്ചേസ് ഓർഡർ ചേർക്കുക" @close="closeModal">
    <form @submit.prevent="createPO" class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">📝 പർച്ചേസ് ഓർഡർ ഫോം</h2>

      <!-- Hidden Status -->
      <input type="hidden" v-model="status" />

      <!-- Dates with Validation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">തീയതി <span class="text-red-500">*</span></label>
          <DatePicker v-model="orderDate" :max-date="new Date()" required />
          <ValidationError :error="errors.orderDate" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">പ്രതീക്ഷിക്കുന്ന തീയതി</label>
          <DatePicker v-model="expectedDate" :min-date="orderDate" />
          <ValidationError :error="errors.expectedDate" />
        </div>
      </div>

      <!-- Product Items Table -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-gray-700 font-medium">ഉൽപ്പന്നങ്ങൾ <span class="text-red-500">*</span></label>
          <button type="button" @click="addItem" :disabled="!canAddMoreItems"
            class="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
            + ഉൽപ്പന്നം ചേർക്കുക
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th v-for="header in tableHeaders" :key="header.key"
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ header.label }}
                </th>
                <th class="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <ProductItem v-for="(item, index) in items" :key="item.id || index" :ref="`item-${index}`" :item="item"
                :index="index" :products="products" :errors="errors.items?.[index] || {}"
                @update:item="updateItem(index, $event)" @remove="removeItem(index)" />
            </tbody>
          </table>
        </div>

        <div v-if="errors.items" class="mt-2 text-red-500 text-sm">
          {{ errors.items }}
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">കുറിപ്പുകൾ</label>
        <TextArea v-model="notes" rows="3" />
      </div>

      <!-- Buttons with Loading State -->
      <div class="flex justify-between">
        <button type="button" @click="confirmSaveDraft" :disabled="isSubmitting"
          class="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50">
          <Spinner v-if="isSubmitting" size="sm" />
          <span v-else>💾 ഡ്രാഫ്റ്റായി സംരക്ഷിക്കുക</span>
        </button>

        <button type="submit" :disabled="isSubmitting"
          class="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50">
          <Spinner v-if="isSubmitting" size="sm" />
          <span v-else>📤 ഓർഡർ സമർപ്പിക്കുക</span>
        </button>
      </div>
    </form>

    <ConfirmationDialog v-if="showConfirmation" :message="confirmationMessage" @confirm="handleConfirmation"
      @cancel="showConfirmation = false" />
  </Modal>
</template>

<script>
import { apiFetch } from '../../utils/api';
import { formatDate } from '@/utils/formatdate.js';
import { showToast } from '@/utils/showtoast.js';
import { useAuthStore } from '@/stores/auth';
import { validateForm } from './ui/purchaseOrderValidator';

import ConfirmationDialog from './ConfirmationDialog.vue';
import DatePicker from './ui/DatePicker.vue';
import ProductItem from './ProductItem.vue';
import Spinner from './ui/Spinner.vue';
import TextArea from './ui/TextArea.vue';
import ValidationError from './ui/ValidationError.vue';

export default {
  components: {
    ConfirmationDialog,
    DatePicker,
    ProductItem,
    Spinner,
    TextArea,
    ValidationError
  },
  props: {
    supplierId: { type: Number, required: true }
  },
  data() {
    const defaultExpectedDate = new Date();
    defaultExpectedDate.setDate(defaultExpectedDate.getDate() + 3);

    return {
      status: 'draft',
      orderDate: new Date(),
      expectedDate: defaultExpectedDate,
      notes: '',
      items: [this.emptyItem()],
      errors: {},
      isSubmitting: false,
      showConfirmation: false,
      confirmationAction: null,
      products: [],
      isLoadingProducts: false,
      tableHeaders: [
        { key: 'product', label: 'ഉൽപ്പന്നം' },
        { key: 'quantity', label: 'അളവ്' },
        { key: 'price', label: 'യൂണിറ്റ് വില' },
        { key: 'discount', label: 'ഡിസ്കൗണ്ട്' },
        { key: 'gst', label: 'GST %' },
        { key: 'amount', label: 'തുക' }
      ]
    };
  },
  computed: {
    computedSubtotal() {
      return this.items.reduce((sum, item) => sum + item.taxable_value, 0).toFixed(2);
    },
    computedTotalTax() {
      return this.items.reduce((sum, item) => (
        sum + item.cgst_amount + item.sgst_amount + item.igst_amount + item.cess_amount
      ), 0).toFixed(2);
    },
    computedGrandTotal() {
      return (parseFloat(this.computedSubtotal) + parseFloat(this.computedTotalTax)).toFixed(2);
    },
    canAddMoreItems() {
      return this.items.length < 50 &&
        this.items.every(item => item.product_id && item.quantity > 0);
    }
  },
  async created() {
    await this.fetchShopProducts();
  },
  methods: {
    emptyItem() {
      return {
        id: Date.now() + Math.random(),
        product_id: '',
        product_name: '',
        quantity: 1,
        unit_price: 0,
        discount: 0,
        gst_applicable: true,
        gst_rate: 0,
        taxable_value: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        cess_amount: 0,
        total_item_amount: 0
      };
    },

    async fetchShopProducts() {
      const authStore = useAuthStore();
      const shopId = authStore.getShopId();

      if (!shopId) {
        showToast('❌ ഷോപ്പ് ഐഡി ലഭ്യമല്ല', 'error');
        return;
      }

      this.isLoadingProducts = true;
      try {
        const data = await apiFetch(`/purchase-orders/shops/${shopId}/shop-products`);
        this.products = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching products:', error);
        showToast('❌ ഉൽപ്പന്നങ്ങൾ ലഭ്യമാക്കുന്നതിൽ പിശക്', 'error');
      } finally {
        this.isLoadingProducts = false;
      }
    },

    async createPO() {
      await this.submitPO('ordered');
    },

    confirmSaveDraft() {
      this.confirmationMessage = 'ഡ്രാഫ്റ്റായി സംരക്ഷിക്കണോ?';
      this.confirmationAction = 'saveDraft';
      this.showConfirmation = true;
    },

    async saveAsDraft() {
      await this.submitPO('draft');
    },

    handleConfirmation() {
      this.showConfirmation = false;
      if (this.confirmationAction === 'saveDraft') {
        this.saveAsDraft();
      }
    },

    async submitPO(status) {
      const authStore = useAuthStore();
      const shopId = authStore.getShopId();

      if (!shopId) {
        showToast('❌ ഷോപ്പ് ഐഡി ലഭ്യമല്ല', 'error');
        return;
      }

      this.status = status;
      this.errors = {};

      if (!this.validateForm()) return;

      this.isSubmitting = true;

      try {
        const payload = {
          shop_id: shopId,
          supplier_id: this.supplierId,
          status: this.status,
          order_date: formatDate(this.orderDate),
          expected_date: this.expectedDate ? formatDate(this.expectedDate) : null,
          total_amount: this.computedGrandTotal,
          notes: this.notes,
items: this.items.map(item => {
  const product = this.products.find(p => p.shop_product_id === item.product_id);
  const qty = Number(item.quantity) || 0;
  const price = Number(item.unit_price) || 0;
  const discount = Number(item.discount) || 0;
  const gstRate = Number(item.gst_rate) || 0;

  const baseAmount = qty * price;
  const discountAmount = (baseAmount * discount) / 100;
  const taxable = baseAmount - discountAmount;
  const gstAmount = (taxable * gstRate) / 100;
  const total = taxable + gstAmount;

  return {
    product_id: item.product_id,
product_name: item.product_name || product?.name || 'Unknown',
    quantity: qty,
    unit_price: price,
    discount: discount,
    gst_applicable: item.gst_applicable,
    gst_rate_percentage: gstRate,
    taxable_value: taxable,
    total_item_amount: total,
    sgst_amount_per_item: 0,
    cgst_amount_per_item: 0,
    igst_amount_per_item: 0,
    cess_amount_per_item: 0,
    hsn_sac_code: product?.hsn || null
  };
}),

        };

        const response = await apiFetch('/purchase-orders', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        this.$emit('poCreated');
        this.closeModal();
        showToast(`✅ പർച്ചേസ് ഓർഡർ ${this.status === 'draft' ? 'ഡ്രാഫ്റ്റായി സംരക്ഷിച്ചു' : 'സമർപ്പിച്ചു'}!`);
      } catch (err) {
        console.error('PO submission error:', err);
        showToast(`❌ പിശക്: ${err.message}`, 'error');
      } finally {
        this.isSubmitting = false;
      }
    },

    validateForm() {
      this.errors = validateForm({
        orderDate: this.orderDate,
        expectedDate: this.expectedDate,
        items: this.items
      });
      return Object.keys(this.errors).length === 0;
    },

    updateItem(index, updatedItem) {
      this.items[index] = { ...updatedItem };
    },

    addItem() {
      if (this.canAddMoreItems) {
        this.items.push(this.emptyItem());
        this.$nextTick(() => {
          const newItemIndex = this.items.length - 1;
          const newItemRef = this.$refs[`item-${newItemIndex}`]?.[0];
          if (newItemRef) newItemRef.focusProductSearch();
        });
      }
    },

    removeItem(index) {
      if (this.items.length > 1) {
        this.items.splice(index, 1);
      } else {
        showToast('ഒരു ഇനമെങ്കിലും ഉണ്ടായിരിക്കണം', 'warning');
      }
    },

    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

