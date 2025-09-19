<template>
  <div class="flex h-screen bg-gray-950 text-white">
    <Sidebar />
    <main class="flex-1 p-6 overflow-y-auto space-y-6">
      <h1 class="text-2xl font-bold">Car Wash Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TodaySchedule :bookings="todayBookings" />
        <ServicePackages :packages="packages" />
        <BookingsTracker :bookings="bookings" />
        <CustomerBookings :bookings="customerBookings" />
        <ServiceAnalytics :analytics="analytics" />
        <StaffProfileCard :staff="staffMember" />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import TodaySchedule from './components/TodaySchedule.vue'
import ServicePackages from './components/ServicePackages.vue'
import BookingsTracker from './components/BookingsTracker.vue'
import CustomerBookings from './components/CustomerBookings.vue'
import ServiceAnalytics from './components/ServiceAnalytics.vue'
import StaffProfileCard from './components/StaffProfileCard.vue'

const todayBookings = [
  { id: 1, time: "10:00 AM", customer: "Rahul", servicePackage: "Premium Wash" },
  { id: 2, time: "12:00 PM", customer: "Anita", servicePackage: "Interior Cleaning" }
]

const packages = [
  { id: 1, name: "Basic Wash", description: "Exterior only", price: 300 },
  { id: 2, name: "Premium Wash", description: "Exterior + Interior", price: 600 }
]

const bookings = [
  { id: 1, customer: "Rahul", servicePackage: "Premium Wash", time: "10:00 AM", status: "pending", paymentStatus: "unpaid" }
]

const customerBookings = [
  { id: 1, servicePackage: "Interior Cleaning", date: "Sep 20", time: "12:00 PM", staff: "Amit", status: "upcoming" }
]

const analytics = {
  totalBookings: 52,
  revenue: 12500,
  avgRating: 4.6,
  trends: { bookings: [20, 40, 60, 80, 40, 70, 100], revenue: [10, 30, 50, 70, 90, 60, 80] }
}

const staffMember = {
  name: "Amit Sharma",
  avatarInitials: "AS",
  specialties: ["Interior", "Premium"],
  load: { bookings: 5, weeklyHours: 28 }
}
</script>
