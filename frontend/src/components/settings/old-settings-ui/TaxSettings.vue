
<!-- components/settings/TaxSettings.vue -->
 <template>
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Tax Settings</h2>
        <p class="mt-1 text-sm text-gray-500">Configure tax rates and rules for your stores.</p>
      </div>
      
      <div class="px-6 py-4 space-y-6">
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-medium text-gray-900">Tax Rates</h3>
            <button @click="openAddTaxModal" class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <i class="fas fa-plus mr-1"></i> Add Tax Rate
            </button>
          </div>
          
          <div class="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <!-- Table content from original HTML -->
            </table>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-base font-medium text-gray-900">Tax Calculation Settings</h3>
          <!-- Form elements from original HTML -->
        </div>
      </div>
  
      <div class="px-6 py-4 bg-gray-50 text-right">
        <button @click="saveTaxSettings" class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Save Tax Settings
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
      setup(props, { emit }) {
    const store = useStore();
    const taxSettings = ref({
      inclusive: false,
      shippingTax: true,
      rates: []
    });

    const saveTaxSettings = async () => {
      try {
        const shopId = store.state.shops.activeShop;
        await taxApi.updateTaxSettings(shopId, taxSettings.value);
        emit('tax-updated');
      } catch (error) {
        console.error('Error saving tax settings:', error);
      }
    };

    return { taxSettings, saveTaxSettings };
  },

  
    data() {
      return {
        taxSettings: {
          inclusive: false,
          shippingTax: true,
          rates: []
        }
      }
    },
    methods: {
      openAddTaxModal() {
        this.$emit('open-tax-modal')
      },
      async saveTaxSettings() {
        try {
          // API call to save tax settings
          const response = await this.$axios.put('/api/tax-settings', this.taxSettings)
          this.$toast.success('Tax settings saved successfully')
        } catch (error) {
          this.$toast.error('Error saving tax settings')
        }
      }
    }
  }
  </script>