<template>
  <div class="classroom-overview">
    <h2>Classroom Overview</h2>
    <div v-for="(course, index) in courses" :key="index" class="course-card">
      <h3>{{ course.name }}</h3>
      <p><strong>Number of Students:</strong> {{ course.students }}</p>
      <p><strong>Live Schedule:</strong> {{ course.schedule }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClassroomOverview',
  data() {
    return {
      courses: [
        { name: 'Math 101', students: 25, schedule: 'Mon, Wed, Fri - 9:00 AM' },
        { name: 'English Literature', students: 30, schedule: 'Tue, Thu - 10:30 AM' },
        { name: 'History 202', students: 20, schedule: 'Mon, Fri - 11:00 AM' },
      ],
    };
  },
};
</script>

<style scoped>
.classroom-overview {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.course-card {
  margin-bottom: 20px;
}
.course-card h3 {
  font-size: 20px;
  margin-bottom: 10px;
}
</style>
