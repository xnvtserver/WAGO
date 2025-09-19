<template>
  <div class="assignments-tracker">
    <h2>Assignments Tracker</h2>
    <div v-for="(assignment, index) in assignments" :key="index" class="assignment-card">
      <h3>{{ assignment.title }}</h3>
      <p><strong>Due Date:</strong> {{ assignment.dueDate }}</p>
      <p><strong>Status:</strong> {{ assignment.status }}</p>
      <button @click="gradeAssignment(index)" v-if="assignment.status === 'Pending'">Grade Assignment</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssignmentsTracker',
  data() {
    return {
      assignments: [
        { title: 'Math Assignment 1', dueDate: '2025-09-10', status: 'Pending' },
        { title: 'Literature Essay', dueDate: '2025-09-15', status: 'Graded' },
        { title: 'History Quiz', dueDate: '2025-09-12', status: 'Pending' },
      ],
    };
  },
  methods: {
    gradeAssignment(index) {
      this.assignments[index].status = 'Graded';
    },
  },
};
</script>

<style scoped>
.assignments-tracker {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.assignment-card {
  margin-bottom: 20px;
}
.assignment-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}
button {
  background-color: #3498db;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
</style>
