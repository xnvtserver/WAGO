<!--  front-end/src/views/auth/RegisterPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div class="w-full max-w-3xl">
      <!-- Registration Card -->
      <div class="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row">
        <!-- Left Side - Illustration -->
        <div class="md:w-1/2 bg-blue-50 rounded-l-2xl p-8 hidden md:flex flex-col justify-center">
          <img src="/home/vivek/Desktop/Vivek/WORKSPACE/CARWASH/frontend/src/assets/logo.png" alt="Security" class="w-full h-64 object-contain">
          <h3 class="text-xl font-bold text-gray-800 mt-6 text-center">നിങ്ങളുടെ വ്യക്തിഗത വിവരങ്ങൾ സുരക്ഷിതം</h3>
          <p class="text-gray-600 mt-2 text-sm text-center">256-ബിറ്റ് SSL എൻക്രിപ്ഷൻ വഴി സുരക്ഷിതമായി</p>
        </div>

        <!-- Right Side - Registration Form -->
        <div class="md:w-1/2 p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-store text-white text-xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">കട രജിസ്റ്റർ ചെയ്യുക</h2>
            <p class="text-gray-600 mt-2 text-sm">നിങ്ങളുടെ കടയുടെ വിവരങ്ങൾ നൽകി രജിസ്റ്റർ ചെയ്യുക</p>
          </div>

          <!-- Registration Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4">
              <div class="flex items-center">
                <i class="fas fa-exclamation-circle text-red-400 mr-2"></i>
                <span class="text-sm text-red-700">{{ errorMessage }}</span>
              </div>
            </div>

            <!-- Shop Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Shop Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">കടയുടെ പേര്</label>
                <div class="relative">
                  <i class="fas fa-signature absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="text"
                    v-model="form.shopName"
                    required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="കടയുടെ പേര് നൽകുക"
                  >
                </div>
              </div>

              <!-- Owner Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ഉടമയുടെ പേര്</label>
                <div class="relative">
                  <i class="fas fa-user-tie absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="text"
                    v-model="form.ownerName"
                    required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ഉടമയുടെ പേര് നൽകുക"
                  >
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ഇമെയിൽ</label>
                <div class="relative">
                  <i class="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="email"
                    v-model="form.email"
                    required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ഇമെയിൽ വിലാസം നൽകുക"
                  >
                </div>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ഫോൺ നമ്പർ</label>
                <div class="relative">
                  <i class="fas fa-phone absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="tel"
                    v-model="form.phone"
                    required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ഫോൺ നമ്പർ നൽകുക"
                  >
                </div>
              </div>
            </div>

            <!-- Password Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">പാസ്സ്‌വേഡ്</label>
                <div class="relative">
                  <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.password"
                    required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="പാസ്സ്‌വേഡ് നൽകുക"
                    @input="checkPasswordStrength"
                  >
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <i :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" class="fas"></i>
                  </button>
                </div>
                <div class="mt-2">
                  <div class="flex gap-1">
                    <div 
                      v-for="n in 4" 
                      :key="n"
                      class="h-1 w-full rounded-full transition-colors"
                      :class="passwordStrength >= n ? strengthColor : 'bg-gray-200'"
                    ></div>
                  </div>
                  <p class="text-xs mt-1" :class="strengthTextClass">
                    {{ strengthText }}
                  </p>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">പാസ്സ്‌വേഡ് സ്ഥിരീകരിക്കുക</label>
                <div class="relative">
                  <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.confirmPassword"
                    required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="പാസ്സ്‌വേഡ് വീണ്ടും നൽകുക"
                  >
                </div>
              </div>
            </div>

            <!-- License Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ലൈസൻസ് ഫയൽ</label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg cursor-pointer transition-colors">
                  <div class="flex flex-col items-center justify-center py-4">
                    <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-600">
                      <span class="text-blue-600">ഫയൽ അപ്‌ലോഡ് ചെയ്യുക</span> അല്ലെങ്കിൽ ഡ്രാഗ് ചെയ്യുക
                    </p>
                    <p class="text-xs text-gray-500 mt-1">PDF, PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    @change="handleFileUpload" 
                    class="hidden" 
                    accept=".pdf,.png,.jpg,.jpeg"
                  >
                </label>
              </div>
            </div>

            <!-- Terms Agreement -->
            <div class="flex items-start mt-4">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  v-model="form.agreeTerms"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">
                  ഞാൻ <a href="#" class="text-blue-600 hover:text-blue-800">നിബന്ധനകളും</a> 
                  <a href="#" class="text-blue-600 hover:text-blue-800">സ്വകാര്യതാ നയവും</a> അംഗീകരിക്കുന്നു
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
              :disabled="loading"
            >
              <span v-if="!loading">രജിസ്റ്റർ ചെയ്യുക</span>
              <span v-else class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-2"></i> പ്രവർത്തിക്കുന്നു...
              </span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center text-sm">
            <p class="text-gray-600">
              ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?
              <router-link to="/login" class="text-blue-600 font-medium hover:text-blue-800">
                ലോഗിൻ ചെയ്യുക
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full">
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <i class="fas fa-check text-green-600"></i>
            </div>
            <h3 class="mt-4 text-lg font-medium">രജിസ്ട്രേഷൻ വിജയിച്ചു!</h3>
            <p class="mt-2 text-sm text-gray-600">
              നിങ്ങളുടെ അക്കൗണ്ട് വിജയകരമായി സൃഷ്ടിച്ചു. ലോഗിൻ പേജിലേക്ക് നയിക്കുന്നു...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        shopName: '',
        ownerName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      },
      licenseFile: null,
      showPassword: false,
      loading: false,
      errorMessage: '',
      showSuccessModal: false,
      passwordStrength: 0,
    };
  },
  computed: {
    strengthColor() {
      return ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][this.passwordStrength - 1] || 'bg-gray-200';
    },
    strengthText() {
      return ['ശക്തിയില്ല', 'മധ്യനില', 'ശക്തം', 'വളരെ ശക്തം'][this.passwordStrength - 1] || '';
    },
    strengthTextClass() {
      return ['text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-600'][this.passwordStrength - 1] || '';
    },
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        this.licenseFile = file;
      } else {
        this.errorMessage = 'ഫയൽ 5MB-ൽ കുറവായിരിക്കണം';
      }
    },
    checkPasswordStrength() {
      const val = this.form.password;
      let score = 0;
      if (val.length >= 6) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/\d/.test(val)) score++;
      if (/[@$!%*?&#]/.test(val)) score++;
      this.passwordStrength = score;
    },

    async handleSubmit() {
     this.loading = true;
     this.errorMessage = '';
  
  // Validate passwords match
  if (this.form.password !== this.form.confirmPassword) {
    this.errorMessage = 'Passwords do not match';
    this.loading = false;
    return;
  }

  // Validate terms agreement
  if (!this.form.agreeTerms) {
    this.errorMessage = 'You must agree to the terms and conditions';
    this.loading = false;
    return;
  }

  try {
    const formData = new FormData();
    formData.append('shopName', this.form.shopName);
    formData.append('ownerName', this.form.ownerName);
    formData.append('email', this.form.email);
    formData.append('phone', this.form.phone);
    formData.append('password', this.form.password);
    formData.append('location', this.form.location);
    
    if (this.licenseFile) {
      formData.append('license', this.licenseFile); // Match backend expectation
    }

    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    this.showSuccessModal = true;
    setTimeout(() => {
      this.$router.push('/login');
    }, 2000);
  } catch (err) {
    console.error('Registration error:', err);
    this.errorMessage = err.message || 'Registration failed. Please try again.';
    
    // Handle specific error cases
    if (err.message.includes('email')) {
      this.errorMessage = 'Email is already registered';
    } else if (err.message.includes('phone')) {
      this.errorMessage = 'Phone number is already registered';
    }
  } finally {
    this.loading = false;
  }
    }

  }
}
</script>


<style scoped>
input:focus, button:focus {
  outline: none;
  ring: 2px;
}

.file-upload-label:hover {
  border-color: #3b82f6;
  transition: border-color 0.3s ease;
}
</style>