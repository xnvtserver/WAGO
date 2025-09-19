<template>
  <div class="teacher-profile">
    <h2>Teacher Profile</h2>
    <p>Name: {{ name }}</p>
    <p>Subject: {{ subject }}</p>
    <p>Teaching Load: {{ teachingLoad }} hours</p>
  </div>
</template>

<script>
export default {
  name: 'TeacherProfile',
  data() {
    return {
      name: 'John Doe',
      subject: 'Mathematics',
      teachingLoad: 20,
    };
  },
};
</script>

<style scoped>
.teacher-profile {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.teacher-profile h2 {
  font-size: 22px;
  margin-bottom: 10px;
}
</style>
