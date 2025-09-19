<template>
  <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6">
   <!-- Header -->
    <div class="text-white font-semibold text-xl">AI Study Assistant</div>
    <div class="text-xs text-white/60 mb-4">Quick help from your AI tutor</div>

    <!-- Tip Section -->
    <div class="p-3 rounded-lg bg-white/4 text-sm text-white/80 mb-4">
      ✨ Tip: Break study sessions into 25-minute chunks (Pomodoro method) for better focus.
    </div>

    <!-- Query Input & Ask Button -->
    <div class="mt-4 flex gap-3">
      <!-- Input Field -->
      <input
        v-model="query"
        placeholder="Ask AI something..."
        @focus="inputFocused = true"
        @blur="inputFocused = false"
        class="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      
      <!-- Ask Button -->
      <button
        @click="askAI"
        :class="{
          'bg-gradient-to-r from-blue-500 to-teal-400': !isLoading,
          'bg-gradient-to-r from-gray-500 to-gray-700': isLoading
        }"
        :disabled="isLoading"
        class="px-6 py-3 rounded-lg text-white text-sm flex items-center justify-center transition-all transform hover:scale-105 disabled:opacity-50"
      >
        <!-- Loading Spinner -->
        <span v-if="isLoading" class="spinner-border animate-spin w-5 h-5 mr-2"></span>
        <span v-else>Ask</span>
      </button>
    </div>

    <!-- AI Response Section -->
    <div v-if="aiResponse" class="mt-4 p-3 rounded-lg bg-white/4 text-white/80 text-sm">
      <strong>AI says:</strong> {{ aiResponse }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIPanel',
  data() {
    return {
      query: '',
      isLoading: false,
      aiResponse: ''
    }
  },
  methods: {
    async askAI() {
      if (this.query.trim()) {
        this.isLoading = true;
        this.aiResponse = ''; // Clear previous AI response

        // Simulating an AI response (this would be replaced with an actual API call)
        setTimeout(() => {
          this.aiResponse = `AI is thinking about: "${this.query}"`;
          this.isLoading = false;
          this.query = ''; // Clear the input after AI responds
        }, 1500); // Simulate a 1.5s delay for the AI response
      } else {
        alert('Please enter a valid question.');
      }
    }
  }
}
</script>

<style scoped>
/* Spinner for the button */
.spinner-border {
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>