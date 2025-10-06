<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <div class="sidebar bg-white w-64 border-r border-gray-200 flex flex-col">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-blue-600 flex items-center">
          <i class="fas fa-store mr-2"></i> RetailPro
        </h1>
        <div class="mt-2 text-sm text-gray-500">Settings Dashboard</div>
      </div>
      
      <div class="flex-1 overflow-y-auto scrollbar-hide">
        <div class="p-4">
          <!-- Company -->
          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Company</h3>
            <ul>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'company-profile' }]"
                  @click.prevent="activeTab = 'company-profile'"
                  data-tab="company-profile"
                >
                  <i class="fas fa-building mr-3 text-gray-500"></i>
                  <span>Company Profile</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'billing' }]"
                  @click.prevent="activeTab = 'billing'"
                  data-tab="billing"
                >
                  <i class="fas fa-credit-card mr-3 text-gray-500"></i>
                  <span>Billing</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'locations' }]"
                  @click.prevent="activeTab = 'locations'"
                  data-tab="locations"
                >
                  <i class="fas fa-map-marker-alt mr-3 text-gray-500"></i>
                  <span>Locations & Shops</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Users & Permissions -->
          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Users & Permissions</h3>
            <ul>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'users' }]"
                  @click.prevent="activeTab = 'users'"
                  data-tab="users"
                >
                  <i class="fas fa-users mr-3 text-gray-500"></i>
                  <span>User Management</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'roles' }]"
                  @click.prevent="activeTab = 'roles'"
                  data-tab="roles"
                >
                  <i class="fas fa-user-shield mr-3 text-gray-500"></i>
                  <span>Roles & Permissions</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Inventory -->
          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Inventory</h3>
            <ul>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'products' }]"
                  @click.prevent="activeTab = 'products'"
                  data-tab="products"
                >
                  <i class="fas fa-boxes mr-3 text-gray-500"></i>
                  <span>Products & Categories</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'suppliers' }]"
                  @click.prevent="activeTab = 'suppliers'"
                  data-tab="suppliers"
                >
                  <i class="fas fa-truck mr-3 text-gray-500"></i>
                  <span>Suppliers & Distributors</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Sales & Orders -->
          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sales & Orders</h3>
            <ul>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'checkout' }]"
                  @click.prevent="activeTab = 'checkout'"
                  data-tab="checkout"
                >
                  <i class="fas fa-cash-register mr-3 text-gray-500"></i>
                  <span>Checkout Settings</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'tax' }]"
                  @click.prevent="activeTab = 'tax'"
                  data-tab="tax"
                >
                  <i class="fas fa-receipt mr-3 text-gray-500"></i>
                  <span>Tax & Invoicing</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'delivery' }]"
                  @click.prevent="activeTab = 'delivery'"
                  data-tab="delivery"
                >
                  <i class="fas fa-shipping-fast mr-3 text-gray-500"></i>
                  <span>Delivery & Shipping</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Integrations -->
          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Integrations</h3>
            <ul>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'pos' }]"
                  @click.prevent="activeTab = 'pos'"
                  data-tab="pos"
                >
                  <i class="fas fa-terminal mr-3 text-gray-500"></i>
                  <span>POS & Hardware</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'api' }]"
                  @click.prevent="activeTab = 'api'"
                  data-tab="api"
                >
                  <i class="fas fa-plug mr-3 text-gray-500"></i>
                  <span>API & Webhooks</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  :class="['settings-tab flex items-center p-2 rounded-md mb-1', { active: activeTab === 'notifications' }]"
                  @click.prevent="activeTab = 'notifications'"
                  data-tab="notifications"
                >
                  <i class="fas fa-bell mr-3 text-gray-500"></i>
                  <span>Notifications</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="fas fa-user text-blue-600"></i>
          </div>
          <div class="ml-3">
            <div class="font-medium">Admin User</div>
            <div class="text-xs text-gray-500">Owner</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Settings</h2>
        <div class="flex items-center space-x-4">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            <i class="fas fa-save mr-2"></i> Save Changes
          </button>
        </div>
      </div>
      
      <!-- Settings Content -->
      <div class="p-6">
        <!-- Company Profile Tab (Active by default) -->
        <div v-show="activeTab === 'company-profile'" class="settings-content">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800">Company Information</h3>
              <button class="text-blue-600 hover:text-blue-800">
                <i class="fas fa-pencil-alt"></i> Edit
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="RetailPro Inc.">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="TAX123456789">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="ultimate" selected>Ultimate</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                <div class="flex items-center">
                  <div class="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                    <i class="fas fa-building text-gray-400 text-2xl"></i>
                  </div>
                  <button class="ml-4 text-sm text-blue-600 hover:text-blue-800">Upload New</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Enabled Features</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="toggleStates.featureInventory" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-gray-700">Inventory Management</span>
                </label>
              </div>
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="toggleStates.featureMultiLocation" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-gray-700">Multi-Location</span>
                </label>
              </div>
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="toggleStates.featureAdvancedReports" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-gray-700">Advanced Reports</span>
                </label>
              </div>
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="toggleStates.featureBarcode" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-gray-700">Barcode Scanning</span>
                </label>
              </div>
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="toggleStates.featureGst" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-gray-700">GST Compliance</span>
                </label>
              </div>
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="toggleStates.featureApi" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-gray-700">API Access</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Billing Tab -->
        <div v-show="activeTab === 'billing'" class="settings-content">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Current Plan</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="text-sm font-medium text-gray-500 mb-1">Plan</div>
                <div class="text-xl font-semibold text-blue-600">Ultimate</div>
              </div>
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="text-sm font-medium text-gray-500 mb-1">Billing Cycle</div>
                <div class="text-xl font-semibold">Annual</div>
              </div>
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="text-sm font-medium text-gray-500 mb-1">Next Billing</div>
                <div class="text-xl font-semibold">Jan 15, 2024</div>
              </div>
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="text-sm font-medium text-gray-500 mb-1">Amount</div>
                <div class="text-xl font-semibold">$299.00/mo</div>
              </div>
            </div>
            
            <div class="mb-6">
              <h4 class="text-md font-semibold text-gray-700 mb-3">Plan Features</h4>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <li class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>Unlimited Products</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>10 Locations</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>25 Users</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>Advanced Reporting</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>Priority Support</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>API Access</span>
                </li>
              </ul>
            </div>
            
            <div class="flex justify-between items-center border-t border-gray-200 pt-4">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Upgrade Plan
              </button>
              <button class="text-red-600 hover:text-red-800">
                <i class="fas fa-exclamation-triangle mr-1"></i> Cancel Subscription
              </button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Billing Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div class="flex items-center">
                  <div class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    •••• •••• •••• 4242
                  </div>
                  <button class="ml-2 text-blue-600 hover:text-blue-800">Change</button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Billing Email</label>
                <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="billing@retailpro.com">
              </div>
            </div>
            
            <h4 class="text-md font-semibold text-gray-700 mb-3">Billing History</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 15, 2023</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ultimate Plan - Annual</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$3,588.00</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">Paid</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <a href="#" class="hover:underline">Download</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jul 15, 2022</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ultimate Plan - Annual</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$3,588.00</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">Paid</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <a href="#" class="hover:underline">Download</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Locations & Shops Tab -->
        <div v-show="activeTab === 'locations'" class="settings-content">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800">Shop Locations</h3>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-plus mr-2"></i> Add New Location
              </button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <i class="fas fa-store text-blue-600"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">Main Retail Store</div>
                          <div class="text-sm text-gray-500">ID: SHP001</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">123 Market St</div>
                      <div class="text-sm text-gray-500">New York, NY 10001</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">contact@mainstore.com</div>
                      <div class="text-sm text-gray-500">(212) 555-1234</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22AAAAA0000A1Z5</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Deactivate</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <i class="fas fa-store text-blue-600"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">Downtown Outlet</div>
                          <div class="text-sm text-gray-500">ID: SHP002</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">456 Center Ave</div>
                      <div class="text-sm text-gray-500">New York, NY 10001</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">contact@downtown.com</div>
                      <div class="text-sm text-gray-500">(212) 555-5678</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22BBBBB0000B1Z5</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Deactivate</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <i class="fas fa-store text-blue-600"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">Westside Warehouse</div>
                          <div class="text-sm text-gray-500">ID: SHP003</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">789 Industrial Blvd</div>
                      <div class="text-sm text-gray-500">Brooklyn, NY 11201</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">contact@westside.com</div>
                      <div class="text-sm text-gray-500">(718) 555-9012</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22CCCCC0000C1Z5</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Needs Update</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Deactivate</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Default Shop Settings</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="USD" selected>US Dollar (USD)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="America/New_York" selected>(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option value="Asia/Kolkata">(UTC+05:30) India Standard Time</option>
                  <option value="Europe/London">(UTC+00:00) London</option>
                </select>
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Default UPI ID</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="yourname@upi">
            </div>
            
            <div class="flex items-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="toggleStates.enableMultiLocation" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-gray-700">Enable inventory sharing between locations</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Users Tab -->
        <div v-show="activeTab === 'users'" class="settings-content">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800">User Management</h3>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-user-plus mr-2"></i> Add User
              </button>
            </div>
            
            <div class="mb-6">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input type="text" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search users...">
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <i class="fas fa-user text-blue-600"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">John Smith</div>
                          <div class="text-sm text-gray-500">Owner</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@retailpro.com</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Owner</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <i class="fas fa-user text-purple-600"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">Sarah Johnson</div>
                          <div class="text-sm text-gray-500">Manager</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sarah@retailpro.com</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Manager</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day ago</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <i class="fas fa-user text-green-600"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">Mike Chen</div>
                          <div class="text-sm text-gray-500">Cashier</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">mike@retailpro.com</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Cashier</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 days ago</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <i class="fas fa-user text-yellow-600"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">Lisa Wong</div>
                          <div class="text-sm text-gray-500">Inventory Staff</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">lisa@retailpro.com</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Inventory</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 week ago</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Invite New User</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter full name">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter email">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Select a role</option>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                  <option value="inventory">Inventory Staff</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Assigned Shops</label>
                <select multiple class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="1">Main Retail Store</option>
                  <option value="2">Downtown Outlet</option>
                  <option value="3">Westside Warehouse</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-paper-plane mr-2"></i> Send Invitation
              </button>
            </div>
          </div>
        </div>
        
        <!-- Products Tab -->
        <div v-show="activeTab === 'products'" class="settings-content">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800">Product Categories</h3>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-plus mr-2"></i> Add Category
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">Electronics</h4>
                    <p class="text-sm text-gray-500">45 products</p>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">Clothing</h4>
                    <p class="text-sm text-gray-500">112 products</p>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">Groceries</h4>
                    <p class="text-sm text-gray-500">78 products</p>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">Home & Kitchen</h4>
                    <p class="text-sm text-gray-500">63 products</p>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">Toys & Games</h4>
                    <p class="text-sm text-gray-500">29 products</p>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">Sports & Outdoors</h4>
                    <p class="text-sm text-gray-500">37 products</p>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Product Settings</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Default Unit of Measurement</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="piece" selected>Piece</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="l">Liter (l)</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="m">Meter (m)</option>
                  <option value="cm">Centimeter (cm)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Barcode Type</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="ean13" selected>EAN-13</option>
                  <option value="upc">UPC</option>
                  <option value="code128">Code 128</option>
                  <option value="code39">Code 39</option>
                </select>
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Default HSN/SAC Code</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter default HSN/SAC code">
            </div>
            
            <div class="flex items-center mb-6">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="toggleStates.autoGenerateBarcode" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-gray-700">Auto-generate barcodes for new products</span>
              </label>
            </div>
            
            <div class="flex items-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="toggleStates.lowStockAlerts" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-gray-700">Enable low stock alerts</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Tax & Invoicing Tab -->
        <div v-show="activeTab === 'tax'" class="settings-content">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Tax Settings</h3>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tax Calculation Method</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="exclusive" selected>Exclusive (Add tax to product price)</option>
                <option value="inclusive">Inclusive (Tax included in product price)</option>
              </select>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Default Tax Category</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter default tax category">
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Tax Rates</label>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (%)</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN/SAC</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GST 5%</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5.00</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GST</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GST 12%</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.00</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GST</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GST 18%</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18.00</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GST</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GST 28%</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28.00</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GST</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-plus mr-2"></i> Add Tax Rate
              </button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Invoice Settings</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="INV-">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Next Invoice Number</label>
                <input type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="1001">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Default Terms</label>
                <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">Payment due within 15 days</textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Default Notes</label>
                <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">Thank you for your business!</textarea>
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Logo</label>
              <div class="flex items-center">
                <div class="w-32 h-20 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300">
                  <i class="fas fa-file-invoice text-gray-400 text-2xl"></i>
                </div>
                <button class="ml-4 text-sm text-blue-600 hover:text-blue-800">Upload New</button>
              </div>
            </div>
            
            <div class="flex items-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="toggleStates.autoEmailInvoices" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-gray-700">Automatically email invoices to customers</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- POS & Hardware Tab -->
        <div v-show="activeTab === 'pos'" class="settings-content">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">POS Hardware Configuration</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Default Receipt Printer</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">None</option>
                  <option value="epson" selected>Epson TM-T20II</option>
                  <option value="star">Star TSP100</option>
                  <option value="custom">Custom Printer</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Printer Paper Size</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="58mm" selected>58mm (2.28")</option>
                  <option value="80mm">80mm (3.15")</option>
                </select>
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Receipt Header</label>
              <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">RetailPro Inc.
123 Market St, New York, NY 10001
Phone: (212) 555-1234
GSTIN: 22AAAAA0000A1Z5</textarea>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Receipt Footer</label>
              <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">Thank you for shopping with us!
Visit us again soon
www.retailpro.com</textarea>
            </div>
            
            <div class="flex items-center mb-6">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="toggleStates.printAutomatically" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-gray-700">Print receipts automatically after sale</span>
              </label>
            </div>
            
            <div class="flex items-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="toggleStates.showDiscounts" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-gray-700">Show discounts on receipts</span>
              </label>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Scale Configuration</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Scale Protocol</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="CAS_CI201A" selected>CAS CI201A</option>
                  <option value="AVERY_BERKEL">Avery Berkel</option>
                  <option value="METTLER_TOLEDO">Mettler Toledo</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Baud Rate</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="9600" selected>9600</option>
                  <option value="19200">19200</option>
                  <option value="38400">38400</option>
                  <option value="57600">57600</option>
                  <option value="115200">115200</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data Bits</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="7">7</option>
                  <option value="8" selected>8</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parity</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="none" selected>None</option>
                  <option value="even">Even</option>
                  <option value="odd">Odd</option>
                </select>
              </div>
            </div>
            
            <div class="flex items-center mb-6">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="toggleStates.autoTare" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-gray-700">Enable auto-tare functionality</span>
              </label>
            </div>
            
            <div class="flex justify-end">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-cog mr-2"></i> Test Connection
              </button>
            </div>
          </div>
        </div>

        <!-- Other tabs would follow the same pattern -->
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      activeTab: 'company-profile',
      toggleStates: {
        featureInventory: true,
        featureMultiLocation: true,
        featureAdvancedReports: false,
        featureBarcode: true,
        featureGst: true,
        featureApi: false,
        enableMultiLocation: true,
        autoGenerateBarcode: true,
        lowStockAlerts: true,
        autoEmailInvoices: true,
        printAutomatically: true,
        showDiscounts: true,
        autoTare: false
      }
    };
  }
};
</script>

<style scoped>
.sidebar {
  transition: all 0.3s ease;
}
.settings-tab.active {
  background-color: #3b82f6;
  color: white;
}
.settings-tab.active i {
  color: white !important;
}
.settings-tab:hover:not(.active) {
  background-color: #e5e7eb;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>