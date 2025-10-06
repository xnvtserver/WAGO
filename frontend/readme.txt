npm install vue-router@4 @heroicons/vue
npm install --save @vitejs/plugin-vue vue@3 vue-router@4

npm install pinia @pinia/nuxt vue-router
npm install axios // storing jwt token in client side while login
npm install chart.js vue-chartjs // for chartjs
npm install chart.js @vueuse/core
npm install pinia @pinia/vue chart.js
# Frontend dependencies
npm install pinia @pinia/vue chart.js vue-router
npm install vue@3 pinia @fortawesome/fontawesome-free
npm install vue-i18n@next
npm install vue-i18n
npm install date-fns
npm install qrcode.vue
npm install vuex
//npm install @zxing/library
//npm install vue-zxing
npm install vue-qrcode-reader


// login vue page created --> functionality done --> need review
// register vue page created --> functionality done --> need review 
// for /billing html translated to vue -> functionality pending 
// for /dashboard , almost translated to vue but need to implement functionality
// for /ProductPriceManagement , translated to vue js , backend codes , and dealing with complex migrations need to add funtionality and connect with backend 
Set up a build system (Vite recommended)
Import Font Awesome in your main CSS file:
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
npm install express cors axios


Usage of centralized auth in components:

javascript
// eg: LoginPage.vue
import authService from '@/service/auth';

// In setup()
const handleLogin = async () => {
  try {
    await authService.login(email.value, password.value, rememberMe.value);
    // Redirect to dashboard
  } catch (error) {
    // Handle error
  }
};







06/05/2025
Key Changes Summary:
Route Structure:
        Role-based route protection
        Shop context in product routes
        Separate owner/employee endpoints
Frontend Updates:
        Multi-shop support in auth store
        Active shop context management
        Role-based redirection
Database Queries:
        Changed user_id → owner_id in shop queries
        Product data now comes from shop_products join
        Permission checks using shop_permissions table

New Features:
        Shop switching UI component
        Persistent shop context
        Granular API access control
To implement these changes:
        Update all API calls to include shopId parameter where needed
        Add shop context selector component to your main layout
        Update existing components to use activeShop from auth store
        Modify API controllers to validate shop access using:


