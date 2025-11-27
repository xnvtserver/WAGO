<template>
  <div class="form-container">
    <h2>Vehicle Service Booking</h2>

    <div class="card">

      <!-- VEHICLE TYPE -->
      <div class="field">
        <label>Vehicle Type</label>
        <select v-model="form.vehicleType">
          <option disabled value="">Select Vehicle Type</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="scooter">Scooter</option>
        </select>
      </div>

      <!-- CAR TYPE -->
      <div class="field" v-if="form.vehicleType === 'car'">
        <label>Car Type</label>
        <select v-model="form.carType">
          <option disabled value="">Select Car Type</option>
          <option value="suv">SUV</option>
          <option value="sedan">Sedan</option>
          <option value="hatchback">Hatchback</option>
        </select>
      </div>

      <!-- SERVICE TYPE -->
      <div class="field" v-if="availableServices.length">
        <label>Service Type</label>
        <select v-model="form.serviceType">
          <option disabled value="">Select Service</option>
          <option v-for="service in availableServices" :key="service" :value="service">
            {{ service }}
          </option>
        </select>
      </div>

      <!-- DATE -->
      <div class="field" v-if="form.serviceType">
        <label>Preferred Date</label>
        <input type="date" v-model="form.date" />
      </div>

      <!-- TIME -->
      <div class="field" v-if="form.date">
        <label>Preferred Time</label>
        <input type="time" v-model="form.time" />
      </div>

      <!-- SUBMIT BUTTON -->
      <button v-if="form.time" class="submit-btn" @click="submitForm">
        Submit Booking
      </button>

    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";

const form = reactive({
  vehicleType: "",
  carType: "",
  serviceType: "",
  date: "",
  time: "",
});

const serviceOptions = {
  car: ["General Service", "Full Body Wash", "Engine Check", "AC Service"],
  bike: ["General Service", "Chain Lubrication", "Engine Tune-up"],
  scooter: ["General Service", "Body Wash", "Brake Check"]
};

const availableServices = computed(() => {
  if (form.vehicleType === "car") {
    return form.carType ? serviceOptions.car : [];
  }
  return serviceOptions[form.vehicleType] || [];
});

const submitForm = () => {
  console.log("Form Data:", { ...form });
  alert("Form submitted! Check console for details.");
};
</script>

<style scoped>
/* Main container */
.form-container {
  max-width: 420px;
  margin: 30px auto;
  padding: 10px;
  font-family: 'Inter', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #3a3a3a;
  font-weight: 600;
}

/* Card box */
.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

/* Field styling */
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #444;
  font-weight: 500;
}

select, input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
  transition: 0.3s;
  background: #fafafa;
}

select:focus, input:focus {
  border-color: #4b8bff;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 129, 255, 0.2);
}

/* Submit button */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: #4b8bff;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;
  font-weight: 600;
}

.submit-btn:hover {
  background: #2466e8;
}
</style>
