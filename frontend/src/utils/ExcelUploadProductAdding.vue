<template>
  <div 
    class="excel-upload"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="handleFileDrop"
    :class="{ 'dragover': isDragging }"
  >
    <div class="upload-area">
      <input
        type="file"
        ref="fileInput"
        accept=".xlsx, .xls"
        @change="handleFileSelect"
        hidden
      />
      <button @click="triggerFileInput">Choose File</button>
      <p>or drag and drop Excel file here</p>
      <p class="file-name" v-if="selectedFile">{{ selectedFile.name }}</p>
    </div>

    <div v-if="uploadStatus" class="status" :class="statusClass">
      {{ uploadStatus }}
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const fileInput = ref(null);
const isDragging = ref(false);
const selectedFile = ref(null);
const uploadStatus = ref('');
const error = ref('');
const statusClass = ref('');

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (validateFile(file)) {
    selectedFile.value = file;
    uploadFile();
  }
};

const handleFileDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (validateFile(file)) {
    selectedFile.value = file;
    uploadFile();
  }
};

const validateFile = (file) => {
  if (!file) return false;
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (!validTypes.includes(file.type)) {
    error.value = 'Invalid file type. Please upload an Excel file.';
    return false;
  }
  return true;
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    uploadStatus.value = 'Uploading products...';
    statusClass.value = 'uploading';
    error.value = '';

    const response = await authStore.apiFetch(
      `/ExcelUploadProductAdding/${authStore.activeShop}/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      }
    );

    // Handle non-JSON responses
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
      const text = await response.text();
      throw new Error(text || 'Unexpected response format');
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }
        // Handle 207 partial success
    if (response.status === 207) {
      uploadStatus.value = `Completed with ${result.errors.length} errors`;
      error.value = result.errors.join('\n');
      statusClass.value = 'warning';
    } else {
    uploadStatus.value = `Success: ${result.message} (${result.updated} updated, ${result.created} new)`;
      statusClass.value = 'success';
    }
    selectedFile.value = null;
  } catch (err) {
    error.value = err.message;
    uploadStatus.value = '';
    statusClass.value = '';
  }
};
</script>

<style scoped>
.excel-upload {
  border: 2px dashed #ccc;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.dragover {
  border-color: #4a90e2;
  background-color: rgba(74, 144, 226, 0.1);
}

.upload-area button {
  margin: 1rem;
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.status {
  margin-top: 1rem;
  padding: 0.5rem;
}

.uploading {
  color: #666;
}

.success {
  color: #28a745;
}

.error {
  color: #dc3545;
  margin-top: 1rem;
}

.file-name {
  margin-top: 0.5rem;
  color: #666;
}
</style>