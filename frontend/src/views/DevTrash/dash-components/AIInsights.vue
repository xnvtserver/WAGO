<template>
  <div class="ai-insights">
    <h2>AI Insights</h2>
    <div v-for="(insight, index) in insights" :key="index" class="insight-card">
      <h3>{{ insight.title }}</h3>
      <p><strong>{{ insight.subtitle }}:</strong> {{ insight.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIInsights',
  data() {
    return {
      insights: [
        {
          title: 'Student At Risk',
          subtitle: 'Student',
          description: 'John Doe is falling behind in assignments and needs extra help.',
        },
        {
          title: 'Suggested Teaching Strategy',
          subtitle: 'Strategy',
          description: 'Focus on more interactive discussions for improved engagement.',
        },
      ],
    };
  },
};
</script>

<style scoped>
.ai-insights {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.insight-card {
  margin-bottom: 20px;
}
.insight-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
