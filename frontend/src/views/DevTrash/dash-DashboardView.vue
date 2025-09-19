<template>
  <div class="dashboard">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="dashboard-panels">
        <TeacherProfile />
        <ClassroomOverview />
        <AssignmentsTracker />
        <PerformanceAnalytics />
        <AIInsights />
        <MessagingHub />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import TeacherProfile from './components/TeacherProfile.vue';
import PerformanceAnalytics from './components/PerformanceAnalytics.vue';

import ClassroomOverview from './components/ClassroomOverview.vue';
import AssignmentsTracker from './components/AssignmentsTracker.vue';
import AIInsights from './components/AIInsights.vue';
import MessagingHub from './components/MessagingHub.vue';

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    Header,
    TeacherProfile,
    ClassroomOverview,
    AssignmentsTracker,
    PerformanceAnalytics,
    AIInsights,
    MessagingHub,
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}
.main-content {
  flex-grow: 1;
  margin-left: 250px; /* Adjust this depending on sidebar width */
  padding: 20px;
}
.dashboard-panels {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
</style>
