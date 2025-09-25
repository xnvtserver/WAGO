<template>
  <div class="sample-component">
    <h1>{{ message }}</h1>
    <button @click="changeMessage">Click Me</button>
  </div>
</template>

<script>
export default {
  name: 'SampleComponent',
  data() {
    return {
      message: 'Hello, UserDashboard!'
    };
  },
  methods: {
    changeMessage() {
      this.message = 'You clicked the button!';
    }
  },
  mounted() {
    console.log('SampleComponent mounted');
  },
  updated() {
    console.log('SampleComponent updated');
  }
};
</script>

<style scoped>
.sample-component {
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #42b983;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  background-color: #355c7d;
}
</style>
