<template>
  <div class="bulk-upload">
    <input type="file" @change="handleFileUpload" accept=".csv" />
    <button @click="uploadFile" :disabled="!file">Upload CSV</button>
    <div v-if="progress.show" class="progress">
      <progress :value="progress.current" :max="progress.total"></progress>
      <p>{{ progress.message }}</p>
      <div v-if="errors.length" class="errors">
        <h4>Errors:</h4>
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      progress: { show: false, current: 0, total: 0, message: '' },
      errors: []
    };
  },
  methods: {
    ...mapActions(['connectToUploadChannel']),
    
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    
    async uploadFile() {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('shopId', this.$route.params.shopId);

      try {
        this.progress.show = true;
        // Connect to real-time updates
        const channel = this.connectToUploadChannel(this.file.name);
        
        const response = await axios.post(`/api/shops/${this.$route.params.shopId}/products/bulk-upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        channel.on('progress', (data) => {
          this.progress.current = data.processed;
          this.progress.total = data.total;
          this.progress.message = `Processing ${data.processed}/${data.total}`;
        });

        channel.on('error', (error) => {
          this.errors.push(error.message);
        });

        channel.on('complete', () => {
          this.$emit('upload-complete');
          channel.unsubscribe();
        });

      } catch (error) {
        this.errors.push(error.response?.data?.message || 'Upload failed');
      }
    }
  }
};
</script>