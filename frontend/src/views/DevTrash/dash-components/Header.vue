<template>
  <div class="header">
    <div class="user-info">
      <span class="username">{{ username }}</span>
      <span class="role">{{ role }}</span>
    </div>
    <div class="notifications">🔔</div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      username: 'John Doe',
      role: 'Teacher',
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  background-color: #34495e;
  color: white;
  padding: 15px 30px;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.username {
  font-size: 18px;
  font-weight: bold;
}
.role {
  font-size: 14px;
}
.notifications {
  font-size: 24px;
}
</style>
