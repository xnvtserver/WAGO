// Toast notification system
export function showToast(message, type = 'success') {
  // In a real app, you'd integrate with a toast library like vue-toastification
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // For demo purposes, we'll use browser alert
  alert(`${type.toUpperCase()}: ${message}`);
  
  // Implementation with vue-toastification would look like:
  // this.$toast[type](message, { timeout: 3000 });
}