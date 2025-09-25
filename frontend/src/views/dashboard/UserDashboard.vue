<template>
  <div class="min-h-screen autoglow-component">
    <!-- Navigation Bar -->
    <nav class="navbar fixed top-0 w-full z-50 py-4" :class="{ 'scrolled': isNavbarScrolled }">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <i class="fas fa-car-side text-2xl mr-2 gradient-text"></i>
          <span class="text-2xl font-bold gradient-text">AutoGlow</span>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-8">
          <a href="#home" class="text-slate-700 hover:text-blue-600 font-medium">Home</a>
          <a href="#services" class="text-slate-700 hover:text-blue-600 font-medium">Services</a>
          <a href="#booking" class="text-slate-700 hover:text-blue-600 font-medium">Book Now</a>
          <a href="#features" class="text-slate-700 hover:text-blue-600 font-medium">Why Choose Us</a>
          <a href="#contact" class="text-slate-700 hover:text-blue-600 font-medium">Contact</a>
        </div>
        
        <!-- Auth Buttons -->
        <div class="hidden md:flex space-x-4">
          <a href="http://192.168.0.101:5177/login" class="text-slate-700 hover:text-blue-600 font-medium">Login</a>
          <a href="http://192.168.0.101:5177/register" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Register</a>
        </div>
        
        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = true" class="md:hidden text-slate-700 text-xl">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6" 
           :class="{ 'open': mobileMenuOpen }">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center">
            <i class="fas fa-car-side text-xl mr-2 gradient-text"></i>
            <span class="text-xl font-bold gradient-text">AutoGlow</span>
          </div>
          <button @click="mobileMenuOpen = false" class="text-slate-700 text-xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-6">
          <a href="#home" @click="mobileMenuOpen = false" class="block text-slate-700 hover:text-blue-600 font-medium">Home</a>
          <a href="#services" @click="mobileMenuOpen = false" class="block text-slate-700 hover:text-blue-600 font-medium">Services</a>
          <a href="#booking" @click="mobileMenuOpen = false" class="block text-slate-700 hover:text-blue-600 font-medium">Book Now</a>
          <a href="#features" @click="mobileMenuOpen = false" class="block text-slate-700 hover:text-blue-600 font-medium">Why Choose Us</a>
          <a href="#contact" @click="mobileMenuOpen = false" class="block text-slate-700 hover:text-blue-600 font-medium">Contact</a>
          
          <div class="pt-4 border-t border-slate-200">
            <a href="http://192.168.0.101:5177/login" class="block text-slate-700 hover:text-blue-600 font-medium mb-4">Login</a>
            <a href="http://192.168.0.101:5177/register" class="block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-blue-700 transition">Register</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-bg text-white pt-24 pb-20 md:pt-32 md:pb-28">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">Premium Vehicle Care Services</h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Professional car wash, bike wash, and detailing services with eco-friendly products and convenient scheduling.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#booking" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition inline-block">Book Now</a>
          <a href="#services" class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition inline-block">Our Services</a>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Services</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">From basic washes to premium detailing, we offer a wide range of services to keep your vehicles looking their best.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Car Wash Service -->
          <div class="service-card glass-card p-6 rounded-xl text-center">
            <div class="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-4">
              <i class="fas fa-car text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Car Wash</h3>
            <p class="text-slate-600 mb-4">Complete exterior and interior cleaning with premium products</p>
            <ul class="text-left text-slate-600 space-y-2 mb-6">
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Exterior Wash</li>
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Interior Detailing</li>
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Wax & Polish</li>
            </ul>
            <a href="#booking" class="btn-primary text-white px-6 py-2 rounded-lg font-medium inline-block">Book Now</a>
          </div>
          
          <!-- Bike Wash Service -->
          <div class="service-card glass-card p-6 rounded-xl text-center">
            <div class="bg-green-100 text-green-600 p-4 rounded-full inline-block mb-4">
              <i class="fas fa-motorcycle text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Bike Wash</h3>
            <p class="text-slate-600 mb-4">Specialized cleaning for motorcycles and bicycles</p>
            <ul class="text-left text-slate-600 space-y-2 mb-6">
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Exterior Deep Clean</li>
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Chain Lubrication</li>
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Protective Coating</li>
            </ul>
            <a href="#booking" class="btn-primary text-white px-6 py-2 rounded-lg font-medium inline-block">Book Now</a>
          </div>
          
          <!-- Detailing Service -->
          <div class="service-card glass-card p-6 rounded-xl text-center">
            <div class="bg-purple-100 text-purple-600 p-4 rounded-full inline-block mb-4">
              <i class="fas fa-spray-can text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Premium Detailing</h3>
            <p class="text-slate-600 mb-4">Advanced cleaning and protection for your vehicle</p>
            <ul class="text-left text-slate-600 space-y-2 mb-6">
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Engine Detailing</li>
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Ceramic Coating</li>
              <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Paint Correction</li>
            </ul>
            <a href="#booking" class="btn-primary text-white px-6 py-2 rounded-lg font-medium inline-block">Book Now</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking Section -->
    <section id="booking" class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Book Your Service</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">Follow the steps below to schedule your vehicle service with ease.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Booking Form -->
          <div class="glass-card p-6 lg:p-8">
            <!-- Progress Bar -->
            <div class="progress-container mb-8">
              <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
              <div class="step-container relative" v-for="step in totalSteps" :key="step">
                <div class="step-circle" :class="getStepCircleClass(step)">
                  <span>{{ step }}</span>
                  <div class="step-label">{{ getStepLabel(step) }}</div>
                </div>
              </div>
            </div>
            
            <form @submit.prevent="submitBooking">
              <!-- Step 1: Vehicle Type -->
              <div class="form-step" :class="{ 'active': currentStep === 1 }">
                <h3 class="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                  Choose Your Vehicle Type
                </h3>
                <p class="text-slate-600 mb-6">What kind of vehicle would you like to book the service for?</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <!-- Car Option -->
                  <div class="vehicle-type-card p-4 rounded-lg text-center" 
                       :class="{ 'selected': bookingData.vehicleType === 'car' }"
                       @click="selectVehicleType('car')">
                    <div class="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                      <i class="fas fa-car text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-slate-800 mb-2">🚗 Car</h4>
                    <p class="text-sm text-slate-500">Hatchback, Sedan, SUV, Luxury Car, Pickup/Van</p>
                  </div>
                  
                  <!-- Bike Option -->
                  <div class="vehicle-type-card p-4 rounded-lg text-center" 
                       :class="{ 'selected': bookingData.vehicleType === 'bike' }"
                       @click="selectVehicleType('bike')">
                    <div class="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                      <i class="fas fa-motorcycle text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-slate-800 mb-2">🏍️ Bike</h4>
                    <p class="text-sm text-slate-500">Scooter, Sports Bike, Cruiser, Dirt Bike</p>
                  </div>
                </div>
                
                <!-- Car Types (shown when Car is selected) -->
                <div v-if="bookingData.vehicleType === 'car'" class="mb-6">
                  <h4 class="font-medium text-slate-800 mb-3">Select Car Type:</h4>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <label v-for="carType in carTypes" :key="carType" class="flex items-center p-3 rounded-lg border border-slate-200 cursor-pointer">
                      <input type="radio" v-model="bookingData.vehicleSubType" :value="carType" class="radio-custom mr-3">
                      <span>{{ carType }}</span>
                    </label>
                  </div>
                </div>
                
                <!-- Bike Types (shown when Bike is selected) -->
                <div v-if="bookingData.vehicleType === 'bike'" class="mb-6">
                  <h4 class="font-medium text-slate-800 mb-3">Select Bike Type:</h4>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <label v-for="bikeType in bikeTypes" :key="bikeType" class="flex items-center p-3 rounded-lg border border-slate-200 cursor-pointer">
                      <input type="radio" v-model="bookingData.vehicleSubType" :value="bikeType" class="radio-custom mr-3">
                      <span>{{ bikeType }}</span>
                    </label>
                  </div>
                </div>
                
                <div class="flex justify-end">
                  <button type="button" @click="nextStep" class="btn-next bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Next</button>
                </div>
              </div>
              
              <!-- Step 2: Service Selection -->
              <div class="form-step" :class="{ 'active': currentStep === 2 }">
                <h3 class="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                  Choose Your Service
                </h3>
                <p class="text-slate-600 mb-6">What type of wash would you like for your vehicle?</p>
                
                <!-- Car Services (shown when Car is selected) -->
                <div v-if="bookingData.vehicleType === 'car'">
                  <h4 class="font-medium text-slate-800 mb-4">For Cars:</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <label v-for="service in carServices" :key="service.value" 
                           class="service-card p-4 rounded-lg cursor-pointer"
                           :class="{ 'selected': bookingData.service === service.value }"
                           @click="bookingData.service = service.value">
                      <input type="radio" v-model="bookingData.service" :value="service.value" class="radio-custom mr-3">
                      <span class="font-medium">{{ service.name }}</span>
                      <p class="text-sm text-slate-500 mt-1">{{ service.description }}</p>
                    </label>
                  </div>
                </div>
                
                <!-- Bike Services (shown when Bike is selected) -->
                <div v-if="bookingData.vehicleType === 'bike'">
                  <h4 class="font-medium text-slate-800 mb-4">For Bikes:</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <label v-for="service in bikeServices" :key="service.value" 
                           class="service-card p-4 rounded-lg cursor-pointer"
                           :class="{ 'selected': bookingData.service === service.value }"
                           @click="bookingData.service = service.value">
                      <input type="radio" v-model="bookingData.service" :value="service.value" class="radio-custom mr-3">
                      <span class="font-medium">{{ service.name }}</span>
                      <p class="text-sm text-slate-500 mt-1">{{ service.description }}</p>
                    </label>
                  </div>
                </div>
                
                <div class="flex justify-between">
                  <button type="button" @click="prevStep" class="btn-prev bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium">Previous</button>
                  <button type="button" @click="nextStep" class="btn-next bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Next</button>
                </div>
              </div>
              
              <!-- Step 3: Time Slot -->
              <div class="form-step" :class="{ 'active': currentStep === 3 }">
                <h3 class="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                  Preferred Time Slot
                </h3>
                <p class="text-slate-600 mb-6">When would you prefer your service?</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input type="date" v-model="bookingData.date" class="input-field w-full px-4 py-3 rounded-lg" :min="today">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Time Slot</label>
                    <div class="flex flex-wrap gap-2">
                      <label v-for="timeSlot in timeSlots" :key="timeSlot" 
                             class="time-slot px-4 py-2 rounded-lg cursor-pointer"
                             :class="{ 'selected': bookingData.time === timeSlot }"
                             @click="bookingData.time = timeSlot">
                        <input type="radio" v-model="bookingData.time" :value="timeSlot" class="hidden">
                        <span>{{ timeSlot }}</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-between">
                  <button type="button" @click="prevStep" class="btn-prev bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium">Previous</button>
                  <button type="button" @click="nextStep" class="btn-next bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Next</button>
                </div>
              </div>
              
              <!-- Step 4: Additional Services -->
              <div class="form-step" :class="{ 'active': currentStep === 4 }">
                <h3 class="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                  Additional Services (Optional)
                </h3>
                <p class="text-slate-600 mb-6">Would you like to add any of the following services?</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <label v-for="addon in additionalServices" :key="addon.value" 
                         class="service-card p-4 rounded-lg cursor-pointer"
                         :class="{ 'selected': bookingData.addons.includes(addon.value) }"
                         @click="toggleAddon(addon.value)">
                    <input type="checkbox" v-model="bookingData.addons" :value="addon.value" class="checkbox-custom mr-3">
                    <span class="font-medium">{{ addon.name }}</span>
                    <p class="text-sm text-slate-500 mt-1">{{ addon.description }}</p>
                  </label>
                </div>
                
                <div class="flex justify-between">
                  <button type="button" @click="prevStep" class="btn-prev bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium">Previous</button>
                  <button type="button" @click="nextStep" class="btn-next bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Next</button>
                </div>
              </div>
              
              <!-- Step 5: Pickup Option -->
              <div class="form-step" :class="{ 'active': currentStep === 5 }">
                <h3 class="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                  Pickup Option
                </h3>
                <p class="text-slate-600 mb-6">How would you like to receive your service?</p>
                
                <div class="space-y-3 mb-6">
                  <label v-for="option in pickupOptions" :key="option.value" 
                         class="flex items-center p-4 rounded-lg border border-slate-200 cursor-pointer"
                         :class="{ 'selected': bookingData.pickup === option.value }"
                         @click="bookingData.pickup = option.value">
                    <input type="radio" v-model="bookingData.pickup" :value="option.value" class="radio-custom mr-3">
                    <div>
                      <span class="font-medium">{{ option.name }}</span>
                      <p class="text-sm text-slate-500 mt-1">{{ option.description }}</p>
                    </div>
                  </label>
                </div>
                
                <div class="flex justify-between">
                  <button type="button" @click="prevStep" class="btn-prev bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium">Previous</button>
                  <button type="button" @click="nextStep" class="btn-next bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Next</button>
                </div>
              </div>
              
              <!-- Step 6: Contact Details -->
              <div class="form-step" :class="{ 'active': currentStep === 6 }">
                <h3 class="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">6</span>
                  Provide Your Details
                </h3>
                <p class="text-slate-600 mb-6">Please share your address and contact information.</p>
                
                <div class="mb-6">
                  <h4 class="font-medium text-slate-800 mb-4">Address for Service</h4>
                  <textarea v-model="bookingData.address" class="input-field w-full px-4 py-3 rounded-lg" rows="3" placeholder="Street Address, City, ZIP"></textarea>
                </div>
                
                <div class="space-y-4 mb-6">
                  <h4 class="font-medium text-slate-800">Contact Information</h4>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" v-model="bookingData.phone" class="input-field w-full px-4 py-3 rounded-lg" placeholder="+1 (___) ___-____">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" v-model="bookingData.email" class="input-field w-full px-4 py-3 rounded-lg" placeholder="your@email.com">
                  </div>
                </div>
                
                <div class="flex justify-between">
                  <button type="button" @click="prevStep" class="btn-prev bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium">Previous</button>
                  <button type="submit" class="btn-primary text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center">
                    <i class="fas fa-calendar-check mr-2"></i> Submit Booking
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <!-- WhatsApp Integration Elements -->
          <!-- Floating WhatsApp Button -->
          <div class="whatsapp-float">
            <a href="https://wa.me/919037520219?text=Hi%20AutoGlow%2C%20I%20need%20help%20with%20my%20vehicle%20service" 
               target="_blank" 
               class="whatsapp-link">
              <i class="fab fa-whatsapp"></i>
              <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
            </a>
          </div>

          <!-- WhatsApp Sharing Modal -->
          <div class="modal" :class="{ 'hidden': !showWhatsAppModal }" @click="closeWhatsAppModal">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3 class="text-xl font-bold text-slate-800">Share Booking via WhatsApp</h3>
                <button @click="closeWhatsAppModal" class="modal-close">&times;</button>
              </div>
              <div class="modal-body">
                <p class="text-slate-600 mb-4">Your booking has been confirmed! Share the details via WhatsApp:</p>
                <div class="bg-slate-50 p-4 rounded-lg mb-4">
                  <div class="booking-summary-item">
                    <span class="booking-summary-label">Vehicle:</span>
                    <span class="booking-summary-value">{{ bookingData.vehicleType }} ({{ bookingData.vehicleSubType }})</span>
                  </div>
                  <div class="booking-summary-item">
                    <span class="booking-summary-label">Service:</span>
                    <span class="booking-summary-value">{{ bookingData.service }}</span>
                  </div>
                  <div class="booking-summary-item">
                    <span class="booking-summary-label">Date & Time:</span>
                    <span class="booking-summary-value">{{ bookingData.date }} at {{ bookingData.time }}</span>
                  </div>
                  <div class="booking-summary-item">
                    <span class="booking-summary-label">Pickup:</span>
                    <span class="booking-summary-value">{{ bookingData.pickup }}</span>
                  </div>
                  <div v-if="bookingData.addons.length > 0" class="booking-summary-item">
                    <span class="booking-summary-label">Add-ons:</span>
                    <span class="booking-summary-value">{{ bookingData.addons.join(', ') }}</span>
                  </div>
                  <div class="booking-summary-item">
                    <span class="booking-summary-label">Address:</span>
                    <span class="booking-summary-value">{{ bookingData.address }}</span>
                  </div>
                  <div class="booking-summary-item">
                    <span class="booking-summary-label">Contact:</span>
                    <span class="booking-summary-value">{{ bookingData.phone }} ({{ bookingData.email }})</span>
                  </div>
                </div>
                <a :href="whatsappShareLink" 
                   target="_blank" 
                   class="btn-whatsapp w-full flex items-center justify-center py-3 rounded-lg font-medium">
                  <i class="fab fa-whatsapp mr-2"></i> Share via WhatsApp
                </a>
              </div>
            </div>
          </div>

          <!-- Visual Section -->
          <div class="hidden lg:block">
            <div class="glass-card h-full p-8 flex flex-col justify-center">
              <div class="text-center mb-8">
                <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <i class="fas fa-sparkles text-3xl text-blue-600 animate-float"></i>
                </div>
                <h3 class="text-2xl font-bold text-slate-800 mb-2">Why Choose AutoGlow?</h3>
                <p class="text-slate-600">Premium vehicle care with eco-friendly products</p>
              </div>
              
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="bg-blue-100 text-blue-600 p-2 rounded-lg mr-4">
                    <i class="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-800">Quality Guaranteed</h4>
                    <p class="text-sm text-slate-500 mt-1">We use only premium products that protect your vehicle's finish</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="bg-green-100 text-green-600 p-2 rounded-lg mr-4">
                    <i class="fas fa-leaf"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-800">Eco-Friendly</h4>
                    <p class="text-sm text-slate-500 mt-1">Biodegradable products that are safe for the environment</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="bg-purple-100 text-purple-600 p-2 rounded-lg mr-4">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-800">Quick Service</h4>
                    <p class="text-sm text-slate-500 mt-1">Most services completed in under 60 minutes</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-4">
                    <i class="fas fa-star"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-800">Expert Team</h4>
                    <p class="text-sm text-slate-500 mt-1">Certified professionals with years of experience</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-12 relative">
                <div class="bg-blue-600/10 rounded-xl p-6">
                  <div class="flex items-center mb-3">
                    <div class="bg-blue-600 text-white p-2 rounded-lg mr-3">
                      <i class="fas fa-percentage"></i>
                    </div>
                    <h4 class="font-bold text-slate-800">First-Time Customer?</h4>
                  </div>
                  <p class="text-sm text-slate-600 mb-4">Get 15% off your first service when you book online!</p>
                  <div class="text-2xl font-bold text-blue-600">NEW15</div>
                </div>
                <div class="absolute -top-4 -right-4 bg-yellow-400 text-slate-800 px-3 py-1 rounded-full text-xs font-bold transform rotate-12">
                  PROMO CODE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Choose AutoGlow?</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">We're committed to providing the best vehicle care experience with transparent pricing and exceptional service.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center fade-in" :class="{ 'visible': isElementVisible }">
            <div class="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-4 feature-icon">
              <i class="fas fa-dollar-sign text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Transparent Pricing</h3>
            <p class="text-slate-600">No hidden fees. See exactly what you're paying for with our clear pricing structure.</p>
          </div>
          
          <div class="text-center fade-in" :class="{ 'visible': isElementVisible }">
            <div class="bg-green-100 text-green-600 p-4 rounded-full inline-block mb-4 feature-icon">
              <i class="fas fa-bolt text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Fast Service Guarantee</h3>
            <p class="text-slate-600">We value your time. Most services completed in under 60 minutes or it's on us.</p>
          </div>
          
          <div class="text-center fade-in" :class="{ 'visible': isElementVisible }">
            <div class="bg-purple-100 text-purple-600 p-4 rounded-full inline-block mb-4 feature-icon">
              <i class="fas fa-recycle text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Eco-Friendly Practices</h3>
            <p class="text-slate-600">We use biodegradable products and water-saving techniques to protect our planet.</p>
          </div>
          
          <div class="text-center fade-in" :class="{ 'visible': isElementVisible }">
            <div class="bg-yellow-100 text-yellow-600 p-4 rounded-full inline-block mb-4 feature-icon">
              <i class="fas fa-award text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Satisfaction Guaranteed</h3>
            <p class="text-slate-600">Not happy with the results? We'll redo the service until you're completely satisfied.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="bg-slate-800 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <div class="flex items-center mb-4">
              <i class="fas fa-car-side text-2xl mr-2 gradient-text"></i>
              <span class="text-2xl font-bold gradient-text">AutoGlow</span>
            </div>
            <p class="text-slate-300 mb-4">Premium vehicle care services with a commitment to quality and customer satisfaction.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-slate-300 hover:text-white"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="text-slate-300 hover:text-white"><i class="fab fa-twitter"></i></a>
              <a href="#" class="text-slate-300 hover:text-white"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-slate-300 hover:text-white"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="#home" class="text-slate-300 hover:text-white">Home</a></li>
              <li><a href="#services" class="text-slate-300 hover:text-white">Services</a></li>
              <li><a href="#booking" class="text-slate-300 hover:text-white">Book Now</a></li>
              <li><a href="#features" class="text-slate-300 hover:text-white">Why Choose Us</a></li>
              <li><a href="/login" class="text-slate-300 hover:text-white">Login</a></li>
              <li><a href="/register" class="text-slate-300 hover:text-white">Register</a></li>
            </ul>
          </div>
          
          <!-- Services -->
          <div>
            <h3 class="text-lg font-bold mb-4">Our Services</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-slate-300 hover:text-white">Car Wash</a></li>
              <li><a href="#" class="text-slate-300 hover:text-white">Bike Wash</a></li>
              <li><a href="#" class="text-slate-300 hover:text-white">Engine Detailing</a></li>
              <li><a href="#" class="text-slate-300 hover:text-white">Wax & Polish</a></li>
              <li><a href="#" class="text-slate-300 hover:text-white">Interior Cleaning</a></li>
              <li><a href="#" class="text-slate-300 hover:text-white">Ceramic Coating</a></li>
            </ul>
          </div>
          
          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-bold mb-4">Contact Us</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <i class="fas fa-map-marker-alt mt-1 mr-3 text-blue-400"></i>
                <span class="text-slate-300">123 Auto Street, Care City, CC 12345</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-phone mt-1 mr-3 text-blue-400"></i>
                <span class="text-slate-300">+1 (555) 123-4567</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-envelope mt-1 mr-3 text-blue-400"></i>
                <span class="text-slate-300">info@autoglow.com</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-clock mt-1 mr-3 text-blue-400"></i>
                <span class="text-slate-300">Mon-Sun: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2023 AutoGlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// Reactive state
const isNavbarScrolled = ref(false)
const mobileMenuOpen = ref(false)
const currentStep = ref(1)
const totalSteps = 6
const isElementVisible = ref(false)
const showWhatsAppModal = ref(false)

// Booking data
const bookingData = reactive({
  vehicleType: null,
  vehicleSubType: null,
  service: null,
  date: '',
  time: null,
  addons: [],
  pickup: null,
  address: '',
  phone: '',
  email: ''
})

// Constants
const carTypes = ['Hatchback', 'Sedan', 'SUV', 'Luxury Car', 'Pickup/Van']
const bikeTypes = ['Scooter', 'Sports Bike', 'Cruiser', 'Dirt Bike']
const timeSlots = ['9 AM – 12 PM', '12 PM – 3 PM', '3 PM – 6 PM']
const today = new Date().toISOString().split('T')[0]

const carServices = [
  { value: 'Exterior Wash', name: 'Exterior Wash', description: 'Complete exterior cleaning' },
  { value: 'Interior Cleaning', name: 'Interior Cleaning', description: 'Detailed interior vacuum & wipe' },
  { value: 'Full Wash', name: 'Full Wash', description: 'Exterior + Interior complete' },
  { value: 'Engine Detailing', name: 'Engine Detailing', description: 'Engine bay cleaning' },
  { value: 'Wax & Polish', name: 'Wax & Polish', description: 'Premium exterior protection' }
]

const bikeServices = [
  { value: 'Exterior Wash', name: 'Exterior Wash', description: 'Complete exterior cleaning' },
  { value: 'Engine Detailing', name: 'Engine Detailing', description: 'Engine cleaning and detailing' },
  { value: 'Full Wash', name: 'Full Wash', description: 'Complete bike cleaning' }
]

const additionalServices = [
  { value: 'Quick Cleaning', name: 'Quick Cleaning', description: 'Fast exterior wash' },
  { value: 'Engine Bay Cleaning', name: 'Engine Bay Cleaning', description: 'For Cars/Bikes' },
  { value: 'Upholstery Cleaning', name: 'Upholstery Cleaning', description: 'For Cars' },
  { value: 'Tire Shine', name: 'Tire Shine', description: 'For Cars' }
]

const pickupOptions = [
  { 
    value: 'Home Pickup', 
    name: 'Home Pickup & Drop', 
    description: 'We\'ll come to your location (additional charges may apply)' 
  },
  { 
    value: 'Service Center', 
    name: 'Bring My Vehicle to Service Center', 
    description: 'Visit our nearest service location' 
  }
]

// Computed properties
const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / (totalSteps - 1)) * 100
})

const whatsappShareLink = computed(() => {
  const message = generateWhatsAppMessage()
  return `https://wa.me/919037520219?text=${encodeURIComponent(message)}`
})

// Methods
const selectVehicleType = (type) => {
  bookingData.vehicleType = type
  bookingData.vehicleSubType = null
}

const toggleAddon = (addon) => {
  const index = bookingData.addons.indexOf(addon)
  if (index > -1) {
    bookingData.addons.splice(index, 1)
  } else {
    bookingData.addons.push(addon)
  }
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const validateStep = (step) => {
  switch (step) {
    case 1:
      if (!bookingData.vehicleType || !bookingData.vehicleSubType) {
        alert('Please select a vehicle type and subtype')
        return false
      }
      return true
    case 2:
      if (!bookingData.service) {
        alert('Please select a service')
        return false
      }
      return true
    case 3:
      if (!bookingData.date || !bookingData.time) {
        alert('Please select both date and time')
        return false
      }
      return true
    case 5:
      if (!bookingData.pickup) {
        alert('Please select a pickup option')
        return false
      }
      return true
    default:
      return true
  }
}

const getStepCircleClass = (step) => {
  if (step < currentStep.value) {
    return 'completed'
  } else if (step === currentStep.value) {
    return 'active'
  }
  return ''
}

const getStepLabel = (step) => {
  const labels = ['Vehicle', 'Service', 'Time', 'Extras', 'Pickup', 'Details']
  return labels[step - 1] || ''
}

const generateWhatsAppMessage = () => {
  const { vehicleType, vehicleSubType, service, date, time, addons, pickup, address, phone, email } = bookingData
  
  let message = `Hello AutoGlow! I would like to confirm my booking:\n\n`
  message += `*Vehicle Type:* ${vehicleType} (${vehicleSubType})\n`
  message += `*Service:* ${service}\n`
  message += `*Date & Time:* ${date} at ${time}\n`
  message += `*Pickup Option:* ${pickup}\n`
  
  if (addons && addons.length > 0) {
    message += `*Additional Services:* ${addons.join(', ')}\n`
  }
  
  message += `*Address:* ${address}\n`
  message += `*Contact:* ${phone} (${email})\n\n`
  message += `Please confirm my booking. Thank you!`
  
  return message
}

const submitBooking = () => {
  if (validateStep(6)) {
    if (!bookingData.address || !bookingData.phone || !bookingData.email) {
      alert('Please fill in all required fields')
      return
    }
    
    // Show WhatsApp modal instead of form submission
    showWhatsAppModal.value = true
  }
}

const closeWhatsAppModal = () => {
  showWhatsAppModal.value = false
}

const handleScroll = () => {
  // Navbar scroll effect
  isNavbarScrolled.value = window.scrollY > 50
  
  // Fade-in animation
  const element = document.querySelector('.fade-in')
  if (element) {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150
    isElementVisible.value = elementTop < window.innerHeight - elementVisible
  }
}

const handleSmoothScroll = (e) => {
  const href = e.target.getAttribute('href')
  if (href && href.startsWith('#')) {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      })
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleSmoothScroll)
  })
  
  // Initial scroll check
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.removeEventListener('click', handleSmoothScroll)
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.autoglow-component {
  font-family: 'Poppins', sans-serif;
  background-color: #f1f5f9;
  scroll-behavior: smooth;
}

:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --secondary: #10b981;
  --accent: #8b5cf6;
  --dark: #1e293b;
  --light: #f8fafc;
}

.gradient-text {
  background: linear-gradient(90deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

.service-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
}

.service-card.selected {
  border-color: var(--primary);
  background-color: rgba(59, 130, 246, 0.05);
}

.radio-custom {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  transition: all 0.2s;
  position: relative;
}

.radio-custom:checked {
  border-color: var(--primary);
}

.radio-custom:checked::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--primary);
  border-radius: 50%;
  top: 2px;
  left: 2px;
}

.checkbox-custom {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;
}

.checkbox-custom:checked {
  border-color: var(--primary);
  background-color: var(--primary);
}

.checkbox-custom:checked::after {
  content: '\f00c';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  position: absolute;
  color: white;
  font-size: 12px;
  top: 2px;
  left: 3px;
}

.btn-primary {
  background: linear-gradient(90deg, var(--primary), var(--accent));
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.5);
}

.input-field {
  transition: all 0.3s;
  border: 1px solid #cbd5e1;
}

.input-field:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.time-slot {
  transition: all 0.3s;
  border: 1px solid #cbd5e1;
}

.time-slot:hover, .time-slot.selected {
  border-color: var(--primary);
  background-color: rgba(59, 130, 246, 0.05);
}

.time-slot.selected {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: var(--primary);
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Navbar styles */
.navbar {
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Hero section */
.hero-bg {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.8)), url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80');
  background-size: cover;
  background-position: center;
}

/* Feature icons */
.feature-icon {
  transition: all 0.3s ease;
}

.feature-icon:hover {
  transform: scale(1.1);
}

/* Mobile menu */
.mobile-menu {
  transition: all 0.3s ease;
  transform: translateX(100%);
}

.mobile-menu.open {
  transform: translateX(0);
}

/* Progress bar */
.progress-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
  max-width: 100%;
}

.progress-container::before {
  content: '';
  background-color: #e0e0e0;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  width: 100%;
  z-index: 1;
}

.progress-bar {
  background-color: var(--primary);
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  width: 0%;
  z-index: 2;
  transition: 0.4s ease;
}

.step-circle {
  background-color: white;
  border: 3px solid #e0e0e0;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: 0.4s ease;
  font-weight: bold;
  color: #999;
}

.step-circle.active {
  border-color: var(--primary);
  color: var(--primary);
}

.step-circle.completed {
  background-color: var(--primary);
  border-color: var(--primary);
  color: white;
}

.step-label {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.form-step {
  display: none;
  animation: fadeIn 0.5s;
}

.form-step.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.vehicle-type-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.vehicle-type-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
}

.vehicle-type-card.selected {
  border-color: var(--primary);
  background-color: rgba(59, 130, 246, 0.05);
}

.btn-next, .btn-prev {
  transition: all 0.3s;
}

.btn-next:hover, .btn-prev:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* WhatsApp Integration Styles */
.whatsapp-float {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1000;
}

.whatsapp-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #25D366;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.whatsapp-link:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(37, 211, 102, 0.6);
}

.whatsapp-link i {
  font-size: 28px;
  color: white;
}

.whatsapp-tooltip {
  position: absolute;
  right: 70px;
  background: #075E54;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.whatsapp-link:hover .whatsapp-tooltip {
  opacity: 1;
}

.whatsapp-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent #075E54;
}

.btn-whatsapp {
  background-color: #25D366;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-whatsapp:hover {
  background-color: #128C7E;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal.hidden {
  display: none;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  padding: 24px;
}
.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  color: #6b7280;
  transition: color 0.3s ease;
}
.modal-close:hover {
  color: #111827;
} 
.booking-summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.booking-summary-label {
  font-weight: 600;
  color: #374151;
}
</style>