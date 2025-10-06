<!-- SupplierManagement.vue -->
<template>
  <div class="container mx-auto px-2 py-4 md:px-4 md:py-8">
    <!-- Header -->
    <header
      class="mb-4 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
      <div>
        <h1 class="text-xl md:text-3xl font-bold text-gray-800">📦 വിതരണക്കാരുടെ നിയന്ത്രണം</h1>
        <p class="text-gray-600 text-sm md:text-base">
          ഷോപ്പിനുള്ള വിതരണക്കാരെ നിയന്ത്രിക്കുക: <span class="font-semibold text-blue-600">{{ shopId }}</span>
        </p>
      </div>
      <button @click="showAddSupplierModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-5 md:py-2 rounded-md shadow-md transition text-sm md:text-base">
        <i class="fas fa-plus mr-1 md:mr-2"></i>വിതരണക്കാരെ ചേർക്കുക
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Left Sidebar - Supplier List -->
      <div class="bg-white rounded-xl shadow-md p-4 md:p-6 lg:sticky top-4 h-fit">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-lg md:text-xl font-semibold text-gray-800">
            വിതരണക്കാർ
            <span class="bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-full">{{ suppliers.length }}</span>
          </h2>
        </div>
        <input v-model="searchQuery" placeholder="വിതരണക്കാരെ തിരയുക..."
          class="w-full px-3 py-1 md:px-4 md:py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base" />
        <ul class="divide-y divide-gray-200 max-h-[420px] overflow-y-auto scrollbar-thin">
          <li v-for="supplier in filteredSuppliers" :key="supplier.id" @click="selectSupplier(supplier)"
            :class="['p-2 md:p-3 rounded-lg transition hover:bg-blue-50 cursor-pointer', selectedSupplier?.id === supplier.id ? 'bg-blue-50 border-l-4 border-blue-500' : '']">
            <div class="flex justify-between items-center">
              <div class="w-3/4">
                <h3 class="font-semibold text-gray-800 truncate">{{ supplier.name }}</h3>
                <p class="text-xs md:text-sm text-gray-500 truncate">{{ supplier.email }}</p>
              </div>
              <div class="flex space-x-1 md:space-x-2">
                <button @click.stop="editSupplierDialog(supplier)"
                  class="text-blue-500 hover:text-blue-700 text-sm md:text-base">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click.stop="unlinkSupplierFromShop(supplier)"
                  class="text-red-500 hover:text-red-700 text-sm md:text-base">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>
        <p v-if="suppliers.length === 0" class="text-center text-gray-500 py-4 text-sm md:text-base">
          വിതരണക്കാർ കണ്ടെത്തിയില്ല
        </p>
      </div>

      <!-- Right Panel - Supplier Detail -->
      <div class="lg:col-span-2">
        <div v-if="selectedSupplier" class="bg-white rounded-xl shadow-md p-4 md:p-6">
          <!-- Supplier Header -->
          <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4 md:mb-6">
            <div class="mb-3 md:mb-0">
              <h2 class="text-xl md:text-2xl font-bold text-gray-800 truncate">{{ selectedSupplier.name }}</h2>
              <p class="text-gray-500 truncate">{{ selectedSupplier.email }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="editSupplierDialog(selectedSupplier)"
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md flex items-center text-sm md:text-base">
                <i class="fas fa-edit mr-1 md:mr-2" @click.stop="editSupplierDialog(supplier)"></i>എഡിറ്റ് ചെയ്യുക
              </button>
              <button @click="fetchPurchaseOrders(selectedSupplier.id)" :disabled="loadingOrders"
                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md flex items-center text-sm md:text-base"
                :class="{ 'opacity-70 cursor-not-allowed': loadingOrders }">
                <i v-if="!loadingOrders" class="fas fa-file-invoice-dollar mr-1 md:mr-2"></i>
                <i v-else class="fas fa-spinner fa-spin mr-1 md:mr-2" href="/purchaseManagement"></i>
                ഓർഡറുകൾ
              </button>

              <button @click="openCreatePOModal"
                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md flex items-center text-sm md:text-base">
                <i class="fas fa-plus mr-1 md:mr-2"></i> പർച്ചേസ് ഓർഡർ
              </button>
            </div>
          </div>
          <CreatePOModal v-if="showPOModal" :supplierId="selectedSupplier.id" @close="closeCreatePOModal" />

          <!-- Purchase Orders -->
<div v-show="loadingOrders" class="text-center py-4 text-gray-500">ഓർഡറുകൾ ലോഡ് ചെയ്യുന്നു...</div>
<div v-show="ordersError && !loadingOrders" class="text-center py-4 text-red-500">{{ ordersError }}</div>
<div v-show="!ordersError && !loadingOrders && purchaseOrders.length === 0" class="text-center py-4 text-gray-400">ഓർഡറുകൾ ലഭ്യമല്ല.</div>
<ul v-show="!ordersError && !loadingOrders && purchaseOrders.length > 0" class="divide-y divide-gray-200 max-h-[420pfetchPurchaseOrdersx] overflow-y-auto scrollbar-thin">
  <li v-for="order in purchaseOrders" :key="order.id">
    <p class="py-2">{{ order.order_number }} - ₹{{ order.total_amount }}</p>
  </li>
</ul>



<div class="mt-6">
  <h3 class="text-md md:text-lg font-semibold text-gray-700 mb-2">പർച്ചേസ് ഓർഡറുകൾ</h3>
  <ul class="divide-y divide-gray-200">
    <li v-for="po in purchaseOrders" :key="po.id" class="py-2">
      <div class="flex justify-between items-center">
        <div>
          <p class="font-semibold">PO #{{ po.id }} - ₹{{ po.total_amount }}</p>
          <p class="text-sm text-gray-500">സ്ഥിതി: {{ getStatusText(po.status) }}</p>
        </div>
        <div class="flex space-x-2">
          <button v-if="po.status === 'draft'" @click="updatePOStatus(po.id, 'pending_approval')"
            class="text-blue-500 hover:text-blue-700 text-sm">അംഗീകൃതിക്ക് അയക്കുക</button>
          <button v-if="po.status === 'pending_approval'" @click="updatePOStatus(po.id, 'approved')"
            class="text-green-500 hover:text-green-700 text-sm">അംഗീകരിക്കുക</button>
          <button v-if="po.status !== 'cancelled'" @click="updatePOStatus(po.id, 'cancelled')"
            class="text-red-500 hover:text-red-700 text-sm">റദ്ദാക്കുക</button>
        </div>
      </div>
    </li>
  </ul>
</div>


          <!-- Supplier Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
            <div>
              <h3 class="text-md md:text-lg font-semibold text-gray-700 mb-2">ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ</h3>
              <p class="text-sm md:text-base"><strong>ഇമെയിൽ:</strong> {{ selectedSupplier.contact_email || 'N/A' }}</p>
              <p class="text-sm md:text-base"><strong>ഫോൺ:</strong> {{ selectedSupplier.contact_phone || 'N/A' }}</p>
              <p class="text-sm md:text-base"><strong>വിലാസം:</strong> {{ selectedSupplier.address.full || 'N/A' }}</p>
            </div>
            <div>
              <h3 class="text-md md:text-lg font-semibold text-gray-700 mb-2">വിശദാംശങ്ങൾ</h3>
              <p class="text-sm md:text-base"><strong>ടാക്സ് ഐഡി:</strong> {{ selectedSupplier.gstin || 'N/A' }}</p>
              <p class="text-sm md:text-base"><strong>നിബന്ധനകൾ:</strong> {{ selectedSupplier.paymentTerms || 'N/A' }}
              </p>
              <p class="text-sm md:text-base"><strong>കുറിപ്പുകൾ:</strong> {{ selectedSupplier.notes ||
                'കുറിപ്പുകളൊന്നുമില്ല' }}</p>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-xl shadow-md p-6 md:p-12 text-center text-gray-400">
          <i class="fas fa-user-friends text-3xl md:text-5xl mb-3 md:mb-4"></i>
          <p class="text-sm md:text-lg">വിശദാംശങ്ങൾ കാണാൻ ഒരു വിതരണക്കാരെ തിരഞ്ഞെടുക്കുക</p>
        </div>
      </div>
    </div>

    <!-- Add Supplier Modal -->
    <Modal v-if="showAddSupplierModal" title="വിതരണക്കാരെ ചേർക്കുക" @close="showAddSupplierModal = false">
      <SupplierForm :supplier="newSupplier" @save="addSupplier" @cancel="showAddSupplierModal = false" />
    </Modal>

    <!-- Edit Supplier Modal -->
    <Modal v-if="showEditSupplierModal" title="വിതരണക്കാരെ എഡിറ്റ് ചെയ്യുക" @close="showEditSupplierModal = false">
      <SupplierForm :supplier="editSupplier" @save="updateSupplier" @cancel="showEditSupplierModal = false" />
    </Modal>
  </div>
</template>

<script>
import Modal from '../../components/SupplierManagement/Modal.vue';
import SupplierForm from '../../components/SupplierManagement/SupplierForm.vue';
import { apiFetch } from '@/utils/api.js';
import CreatePOModal from './CreatePOModal.vue'

export default {
  name: 'SupplierManagement',
  components: { CreatePOModal,Modal, SupplierForm },
  data() {
    return {
      shopId: 1,
      selectedSupplier: null,
      suppliers: [],
      purchaseOrders: [],
      loadingOrders: false,
      ordersError: null,
      newSupplier: {},
      editSupplier: {},
      showAddSupplierModal: false,
      showEditSupplierModal: false,
      searchQuery: '',
      isMounted: true,
      showPOModal: false
    };
  },

  
  computed: {
    filteredSuppliers() {
      return this.suppliers.filter(s =>
        s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (s.phone && s.phone.includes(this.searchQuery))
      );
    }
  },
  methods: {
    openCreatePOModal() {
      this.showPOModal = true;
    },
    closeCreatePOModal() {
      this.showPOModal = false;
    },
    async updatePOStatus(poId, newStatus) {
    try {
      await apiFetch(`/api/purchase-orders/${poId}/status`, {
        method: 'PATCH',
        body: { status: newStatus }
      });
      alert('✅ പർച്ചേസ് ഓർഡർ നില പുതുക്കി!');
      this.fetchPurchaseOrders(this.selectedSupplier.id);
    } catch (error) {
      console.error('Error updating PO status:', error);
      alert('❌ പർച്ചേസ് ഓർഡർ നില പുതുക്കുന്നതിൽ പിശക് സംഭവിച്ചു');
    }
  },

    async fetchSuppliers() {
      try {
        const data = await apiFetch(`/suppliers/shops/${this.shopId}/suppliers`);
        this.suppliers = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        alert('വിതരണക്കാരെ ലഭ്യമാക്കുന്നതിൽ പിശക് സംഭവിച്ചു');
      }
    },
    selectSupplier(supplier) {
      this.selectedSupplier = supplier;
      this.purchaseOrders = [];
    },
    async addSupplier(supplier) {
      try {
        await apiFetch(`/suppliers/shops/${this.shopId}/suppliers`, {
          method: 'POST',
          body: { ...supplier, shop_id: this.shopId }
        });
        this.showAddSupplierModal = false;
        this.newSupplier = {};
        await this.fetchSuppliers();
        alert('✅ വിതരണക്കാരൻ വിജയകരമായി ചേർത്തു!');
      } catch (error) {
        console.error('Error adding supplier:', error);
        alert('❌ വിതരണക്കാരനെ ചേർക്കുന്നതിൽ പിശക് സംഭവിച്ചു');
      }
    },
    async updateSupplier(supplier) {
      try {
          await apiFetch(`/suppliers/shops/${this.shopId}/suppliers/${supplier.id}/update`, {
          method: 'PUT',
          body: supplier
        });
        this.showEditSupplierModal = false;
        if (this.selectedSupplier?.id === supplier.id) {
          this.selectedSupplier = { ...supplier };
        }
        await this.fetchSuppliers();
      } catch (error) {
        console.error('Error updating supplier:', error);
        alert('വിതരണക്കാരെ അപ്ഡേറ്റ് ചെയ്യുന്നതിൽ പിശക് സംഭവിച്ചു');
      }
    },
    async unlinkSupplierFromShop(supplier) {
      if (confirm(`${supplier.name} എന്ന വിതരണക്കാരെ ഈ കടയിൽ നിന്നും ഒഴിവാക്കണോ?`)) {
        try {
          await apiFetch(`/suppliers/shops/${this.shopId}/suppliers/${supplier.id}/unlink`, {
            method: 'PUT'
          });
          if (this.selectedSupplier?.id === supplier.id) {
            this.selectedSupplier = null;
          }
          await this.fetchSuppliers();
          alert(`⚠️ "${supplier.name}" എന്ന വിതരണക്കാരനെ 🧑‍🌾 ഈ കടയിൽ നിന്നു ഒഴിവാക്കി 🛒`);
        } catch (error) {
          console.error('Error unlinking supplier:', error);
          alert('വിതരണക്കാരെ ഒഴിവാക്കുന്നതിൽ പിശക് സംഭവിച്ചു');
        }
      }
    },
async fetchPurchaseOrders(supplierId) {
  this.loadingOrders = true;
  this.ordersError = null;
  try {
    const response = await apiFetch(`/suppliers/shops/${this.shopId}/suppliers/${supplierId}/purchase-orders`);
    if (this.isMounted) {
      this.purchaseOrders = response || [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (this.isMounted) {
      this.ordersError = 'ഓർഡറുകൾ ലഭ്യമാക്കുന്നതിൽ പിശക് സംഭവിച്ചു';
    }
  } finally {
    if (this.isMounted) {
      this.loadingOrders = false;
    }
  }
},

    editSupplierDialog(supplier) {
      this.editSupplier = { ...supplier };
      this.showEditSupplierModal = true;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ml-IN');
    },
    getStatusText(status) {
      return {
        completed: 'പൂർത്തിയായി',
        pending: 'തീർച്ചപ്പെടുത്താത്തത്',
        cancelled: 'റദ്ദാക്കി'
      }[status] || status;
    }
  },
  mounted() {
    this.fetchSuppliers();
  },
  unmounted() {
    this.isMounted = false;
  }
};
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #c5c5c5;
  border-radius: 3px;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
