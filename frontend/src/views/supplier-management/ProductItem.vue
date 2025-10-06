<template>
  <tr>
    <!-- Product Search with Autocomplete -->
    <td class="px-3 py-2">
      <div class="relative">
        <select
          v-model="item.product_id"
          @change="selectProduct"
          class="w-full px-2 py-1 border border-gray-300 rounded-md"
          ref="productSelect"
        >
          <option value="" disabled>ഉൽപ്പന്നം തിരഞ്ഞെടുക്കുക</option>
<option 
  v-for="product in availableProducts" 
  :key="product.shop_product_id" 
  :value="product.shop_product_id"
>
  {{ product.name }} ({{ product.sku || product.shop_product_id }})
</option>

        </select>
      </div>
      <ValidationError :error="errors.product_id" />
    </td>

    <!-- Quantity -->
    <td class="px-3 py-2">
      <input
        v-model.number="item.quantity"
        type="number"
        min="0.01"
        step="0.01"
        @input="emitUpdate"
        class="w-full px-2 py-1 border border-gray-300 rounded-md"
      />
      <ValidationError :error="errors.quantity" />
    </td>

    <!-- Unit Price -->
    <td class="px-3 py-2">
      <input
        v-model.number="item.unit_price"
        type="number"
        min="0"
        step="0.01"
        @input="emitUpdate"
        class="w-full px-2 py-1 border border-gray-300 rounded-md"
      />
      <ValidationError :error="errors.unit_price" />
    </td>

    <!-- Discount -->
    <td class="px-3 py-2">
      <input
        v-model.number="item.discount"
        type="number"
        min="0"
        step="0.01"
        @input="emitUpdate"
        class="w-full px-2 py-1 border border-gray-300 rounded-md"
      />
      <ValidationError :error="errors.discount" />
    </td>

    <!-- GST -->
    <td class="px-3 py-2">
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          v-model="item.gst_applicable"
          class="h-4 w-4 text-blue-600 rounded"
          @change="onGstApplicableChange"
        />
        <input
          v-model.number="item.gst_rate"
          type="number"
          min="0"
          step="0.01"
          :disabled="!item.gst_applicable"
          @input="emitUpdate"
          class="flex-1 px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <ValidationError :error="errors.gst_rate" />
    </td>

    <!-- Total Amount (readonly) -->
    <td class="px-3 py-2">
      <input :value="item.total_item_amount.toFixed(2)" readonly class="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded-md" />
    </td>

    <!-- Remove button -->
    <td class="px-3 py-2 text-center">
      <button type="button" @click="$emit('remove')" class="text-red-600 hover:text-red-800">✖️</button>
    </td>
  </tr>
</template>

<script>
import { computed } from 'vue';
import ValidationError from './ui/ValidationError.vue';

export default {
  components: { ValidationError },
  props: {
    item: { type: Object, required: true },
    index: { type: Number, required: true },
    products: { type: Array, required: true },
    errors: { type: Object, default: () => ({}) }
  },
  emits: ['update:item', 'remove'],
  setup(props, { emit }) {
const availableProducts = computed(() => props.products);



function selectProduct() {
  const product = props.products.find(p => p.shop_product_id === props.item.product_id);
  if (!product) return;

  const updatedItem = {
    ...props.item,
    product_name: product.name, // Set name from selected product
    unit_price: product.purchase_price || 0,
    gst_rate: product.default_tax_rate ?? 0,
  };

  updatedItem.taxable_value = (updatedItem.quantity * updatedItem.unit_price) - updatedItem.discount;

  if (updatedItem.gst_applicable) {
    const gst = updatedItem.taxable_value * (updatedItem.gst_rate / 100);
    updatedItem.cgst_amount = gst / 2;
    updatedItem.sgst_amount = gst / 2;
    updatedItem.igst_amount = 0;
    updatedItem.cess_amount = 0;
    updatedItem.total_item_amount = updatedItem.taxable_value + gst;
  } else {
    updatedItem.cgst_amount = 0;
    updatedItem.sgst_amount = 0;
    updatedItem.igst_amount = 0;
    updatedItem.cess_amount = 0;
    updatedItem.total_item_amount = updatedItem.taxable_value;
  }

  emit('update:item', updatedItem);
}




    function onGstApplicableChange() {
      if (!props.item.gst_applicable) {
        props.item.gst_rate = 0;
      }
      calculateItemTotal();
    }

function calculateItemTotal() {
  const item = props.item;
  const updatedItem = { ...item };

  updatedItem.taxable_value = Math.max(0, (item.quantity * item.unit_price) - item.discount);

  if (updatedItem.gst_applicable) {
    const gst = updatedItem.taxable_value * (updatedItem.gst_rate / 100);
    updatedItem.cgst_amount = gst / 2;
    updatedItem.sgst_amount = gst / 2;
    updatedItem.igst_amount = 0;
    updatedItem.cess_amount = 0;
    updatedItem.total_item_amount = updatedItem.taxable_value + gst;
  } else {
    updatedItem.cgst_amount = 0;
    updatedItem.sgst_amount = 0;
    updatedItem.igst_amount = 0;
    updatedItem.cess_amount = 0;
    updatedItem.total_item_amount = updatedItem.taxable_value;
  }

  emit('update:item', updatedItem);
}


function emitUpdate() {
  const product = props.products.find(p => p.shop_product_id === props.item.product_id);
  emit('update:item', {
    ...props.item,
    product_name: product?.name || props.item.product_name || '',
  });
}



    function focusProductSearch() {
      this.$refs.productSelect?.focus();
    }

    return {
      availableProducts,
      selectProduct,
      onGstApplicableChange,
      calculateItemTotal,
      emitUpdate,
      focusProductSearch
    };
  },
  mounted() {
    if (this.item.product_id) {
      const product = this.products.find(p => p.id === this.item.product_id);
      if (product) {
        this.item.product_name = product.name;
        this.item.unit_price = product.purchase_price || 0;
        this.item.gst_rate = product.default_tax_rate || 0;
      }
    }
  }
};
</script>