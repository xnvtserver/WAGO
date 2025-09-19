<template>
  <div class="messaging-hub">
    <h2>Messaging Hub</h2>
    <div v-for="(message, index) in messages" :key="index" class="message-card">
      <p><strong>{{ message.sender }}:</strong> {{ message.text }}</p>
    </div>
    <textarea v-model="newMessage" placeholder="Type a message..." rows="3"></textarea>
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
export default {
  name: 'MessagingHub',
  data() {
    return {
      newMessage: '',
      messages: [
        { sender: 'Student 1', text: 'Can you clarify the last lesson?' },
        { sender: 'Parent', text: 'Is my child keeping up with assignments?' },
      ],
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        this.messages.push({ sender: 'Teacher', text: this.newMessage });
        this.newMessage = ''; // Reset message input
      }
    },
  },
};
</script>

<style scoped>
.messaging-hub {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.message-card {
  margin-bottom: 15px;
}
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
button {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
</style>
