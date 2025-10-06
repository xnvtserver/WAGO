<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div v-for="(stat, index) in stats" :key="index" class="glass-card glow-effect rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm">{{ stat.label }}</p>
          <h3 class="text-2xl font-bold mt-1">{{ stat.value }}</h3>
        </div>
        <div class="p-3 rounded-full" :class="stat.bgColor">
          <i :class="[stat.icon, 'text-xl']"></i>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-800 flex items-center text-sm" :class="stat.changeColor">
        <i :class="[stat.changeIcon, 'mr-1']"></i>
        <span>{{ stat.changeText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardStats',
  data() {
    return {
      stats: [
        {
          label: 'Total Products',
          value: '1,248',
          icon: 'fas fa-box-open',
          bgColor: 'bg-indigo-500/10 text-indigo-400',
          changeIcon: 'fas fa-arrow-up',
          changeText: '12% from last month',
          changeColor: 'text-green-400'
        },
        {
          label: 'Active Stock',
          value: '8,542',
          icon: 'fas fa-check-circle',
          bgColor: 'bg-green-500/10 text-green-400',
          changeIcon: 'fas fa-arrow-up',
          changeText: '5% from last month',
          changeColor: 'text-green-400'
        },
        {
          label: 'Out of Stock',
          value: '47',
          icon: 'fas fa-exclamation-circle',
          bgColor: 'bg-red-500/10 text-red-400',
          changeIcon: 'fas fa-arrow-up',
          changeText: '3% from last month',
          changeColor: 'text-red-400'
        },
        {
          label: 'Total Value',
          value: '$124,876',
          icon: 'fas fa-dollar-sign',
          bgColor: 'bg-purple-500/10 text-purple-400',
          changeIcon: 'fas fa-arrow-up',
          changeText: '8% from last month',
          changeColor: 'text-green-400'
        }
      ]
    }
  }
}
</script>