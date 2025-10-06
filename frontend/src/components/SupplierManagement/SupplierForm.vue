<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700">വിതരണക്കാരുടെ പേര് *</label>
        <input v-model="form.name" required type="text" class="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700">ഇമെയിൽ *</label>
          <input v-model="form.contact_email" required type="email" class="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">ഫോൺ *</label>
          <input v-model="form.contact_phone" required type="tel" class="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">വിലാസം</label>
        <textarea v-model="form.addressText" rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700">ടാക്സ് ഐഡി (GSTIN)</label>
          <input v-model="form.gstin" type="text" class="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">പേയ്മെന്റ് നിബന്ധനകൾ</label>
          <input v-model="form.paymentTerms" type="text" class="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">കുറിപ്പുകൾ</label>
        <textarea v-model="form.notes" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
      </div>
    </div>

    <div class="mt-4 flex justify-end space-x-2">
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
        റദ്ദാക്കുക
      </button>
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
        <i class="fas fa-save mr-2"></i> സംരക്ഷിക്കുക
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SupplierForm',
  props: {
    supplier: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        name: '',
        contact_email: '',
        contact_phone: '',
        gstin: '',
        paymentTerms: '',
        notes: '',
        addressText: '',
        ...this.supplier,
        addressText: this.supplier?.address?.full || ''
      }
    };
  },
  watch: {
    supplier: {
      handler(newVal) {
        this.form = {
          ...newVal,
          addressText: newVal?.address?.full || ''
        };
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSubmit() {
      const cleanedForm = {
        ...this.form,
        address: { full: this.form.addressText }
      };
      delete cleanedForm.addressText;
      this.$emit('save', cleanedForm);
    }
  }
};
</script>
