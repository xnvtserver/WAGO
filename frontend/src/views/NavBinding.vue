<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :mobile-active="mobileSidebarActive"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="content-area flex-1 overflow-y-auto" :class="{ 'expanded': sidebarCollapsed }">
      <!-- Top Navigation -->
      <TopNav
        @toggle-mobile-sidebar="toggleMobileSidebar"
        @voice-command="handleVoiceCommand"
      />

      <!-- Routed Dashboard Content -->
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import TopNav from '@/components/dashboard/TopNav.vue';

const sidebarCollapsed = ref(false);
const mobileSidebarActive = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const toggleMobileSidebar = () => {
  mobileSidebarActive.value = !mobileSidebarActive.value;
};

const handleVoiceCommand = () => {
  const phrases = [
    "Show me today's sales",
    "What items are low in stock?",
    "Create a new order",
    "Generate inventory report"
  ];
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  alert("Voice command detected: " + randomPhrase);
};
</script>

<style scoped>
.content-area {
  transition: all 0.3s;
}
.content-area.expanded {
  margin-left: 70px;
}
@media (max-width: 768px) {
  .content-area {
    margin-left: 0 !important;
  }
}
.chart-container {
  height: 300px;
}
.low-stock {
  border-left: 4px solid #ef4444;
}
.medium-stock {
  border-left: 4px solid #f59e0b;
}
.healthy-stock {
  border-left: 4px solid #10b981;
}
</style>
