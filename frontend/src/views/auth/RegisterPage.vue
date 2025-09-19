<!--  front-end/src/views/auth/RegisterPage.vue -->
<!-- front-end/src/views/auth/RegisterPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div class="w-full max-w-3xl">
      <!-- Registration Card -->
      <div class="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row">
        <!-- Left Side - Illustration -->
        <div class="md:w-1/2 bg-blue-50 rounded-l-2xl p-8 hidden md:flex flex-col justify-center">
          <img src="/home/vivek/Pictures/car.png" alt="Car Wash" class="w-full h-64 object-contain">
          <h3 class="text-xl font-bold text-gray-800 mt-6 text-center">നിങ്ങളുടെ ഡാറ്റ സുരക്ഷിതമാണ്</h3>
          <p class="text-gray-600 mt-2 text-sm text-center">256-ബിറ്റ് SSL എൻക്രിപ്ഷൻ വഴി സംരക്ഷണം</p>
        </div>

        <!-- Right Side - Registration Form -->
        <div class="md:w-1/2 p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-car text-white text-xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">കാർ വാഷ് രജിസ്ട്രേഷൻ</h2>
            <p class="text-gray-600 mt-2 text-sm">കാർ വാഷ് സെന്റർ / ജീവനക്കാർ / ഉപഭോക്തൃ രജിസ്ട്രേഷൻ ഫോം</p>
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

            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">പൂർണ്ണ പേര്</label>
                <div class="relative">
                  <i class="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                  <input type="text" v-model="form.fullName" required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="നിങ്ങളുടെ പേര് നൽകുക">
                </div>
              </div>

              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">രജിസ്ട്രേഷൻ തരം</label>
                <select v-model="form.role" required
                  class="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">തിരഞ്ഞെടുക്കുക</option>
                  <option value="customer">ഉപഭോക്താവ്</option>
                  <option value="staff">ജീവനക്കാരൻ</option>
                  <option value="owner">കാർ വാഷ് ഉടമ</option>
                </select>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ഇമെയിൽ</label>
                <div class="relative">
                  <i class="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                  <input type="email" v-model="form.email" required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ഇമെയിൽ വിലാസം">
                </div>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ഫോൺ നമ്പർ</label>
                <div class="relative">
                  <i class="fas fa-phone absolute left-3 top-3 text-gray-400"></i>
                  <input type="tel" v-model="form.phone" required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="നിങ്ങളുടെ ഫോൺ നമ്പർ">
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
                  <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="പാസ്സ്‌വേഡ് നൽകുക" @input="checkPasswordStrength">
                  <button type="button" @click="showPassword = !showPassword"
                    class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    <i :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" class="fas"></i>
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">പാസ്സ്‌വേഡ് സ്ഥിരീകരിക്കുക</label>
                <div class="relative">
                  <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                  <input :type="showPassword ? 'text' : 'password'" v-model="form.confirmPassword" required
                    class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="പാസ്സ്‌വേഡ് വീണ്ടും നൽകുക">
                </div>
              </div>
            </div>

            <!-- Terms Agreement -->
            <div class="flex items-start mt-4">
              <div class="flex items-center h-5">
                <input id="terms" v-model="form.agreeTerms" type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">
                  ഞാൻ <a href="#" class="text-blue-600 hover:text-blue-800">നിബന്ധനകളും</a>
                  <a href="#" class="text-blue-600 hover:text-blue-800">സ്വകാര്യതാ നയവും</a> അംഗീകരിക്കുന്നു
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
              :disabled="loading">
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
        fullName: '',
        role: '',
        department: '',
        userId: '', // Enrollment No / Employee ID
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false, // ✅ keep consistent
      },
      idFile: null,
      showPassword: false,
      loading: false,
      errorMessage: '',
      showSuccessModal: false,
      passwordStrength: 0,
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        this.idFile = file;
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

      if (this.form.password !== this.form.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        this.loading = false;
        return;
      }

      if (!this.form.agreeTerms) {
        this.errorMessage = 'You must agree to the terms and conditions';
        this.loading = false;
        return;
      }

      try {
        const formData = new FormData();
        formData.append('fullName', this.form.fullName);
        formData.append('role', this.form.role);
        formData.append('department', this.form.department || 'Default Shop');
        formData.append('userId', this.form.userId || 'Unknown Location');
        formData.append('email', this.form.email);
        formData.append('phone', this.form.phone);
        formData.append('password', this.form.password);
        formData.append('confirmPassword', this.form.confirmPassword);
        formData.append('acceptedTerms', this.form.agreeTerms ? 'true' : 'false'); // ✅ fix

        if (this.idFile) {
          formData.append('licenseFile', this.idFile);
        }

        // ✅ capture response properly
        const res = await fetch('http://localhost:8888/auth/register', {
          method: 'POST',
          body: formData,
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
input:focus,
button:focus {
  outline: none;
  ring: 2px;
}

.file-upload-label:hover {
  border-color: #3b82f6;
  transition: border-color 0.3s ease;
}
</style>