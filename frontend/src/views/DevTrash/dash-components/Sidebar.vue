<template>
  <div class="sidebar">
    <div class="sidebar-header">LMS</div>
    <nav>
      <ul>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/courses">Courses</router-link></li>
        <li><router-link to="/assignments">Assignments</router-link></li>
        <li><router-link to="/exams">Exams</router-link></li>
        <li><router-link to="/messages">Messages</router-link></li>
        <li><router-link to="/analytics">Analytics</router-link></li>
        <li><router-link to="/settings">Settings</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  height: 100vh;
  position: fixed;
}
.sidebar-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}
nav ul {
  list-style-type: none;
  padding: 0;
}
nav ul li {
  margin-bottom: 20px;
}
nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  transition: 0.3s;
}
nav ul li a:hover {
  color: #3498db;
}
</style>
