<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Picture, VideoPlay, Document, Lock, User, CircleCheck, CircleClose, Warning } from '@element-plus/icons-vue'
import { uploadImage, uploadVideo, uploadText } from '../../api/upload'

const activeTab = ref('image')
const isLoggedIn = ref(false)

// 从localStorage获取用户信息
const currentUser = ref({
  username: '',
  email: '',
  phone: '',
  role: ''
})

// 医生信息
const doctorInfo = ref({
  name: '',
  id: '',
  department: '',
  hospital: ''
})

// 检查登录状态
onMounted(() => {
  checkLoginStatus()
})

const checkLoginStatus = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      currentUser.value = userInfo
      doctorInfo.value = {
        name: userInfo.username || '未知用户',
        id: userInfo.id || '',
        department: '眼科',
        hospital: '南京省人民医院'
      }
      isLoggedIn.value = true
    } catch (error) {
      console.error('解析用户信息失败:', error)
      isLoggedIn.value = false
    }
  } else {
    isLoggedIn.value = false
  }
}

const encryptionMethods = ref([
  { label: 'AES-256加密', value: 'aes256' },
  { label: 'RSA加密', value: 'rsa' },
  { label: '混合加密', value: 'hybrid' }
])

const selectedEncryption = ref('aes256')

const uploadStatus = ref({
  uploading: false,
  success: false,
  message: ''
})

const imageFiles = ref([])
const videoFiles = ref([])
const textFiles = ref([])

const handleImageChange = (uploadFile) => {
  imageFiles.value = uploadFile
}

const handleVideoChange = (uploadFile) => {
  videoFiles.value = uploadFile
}

const handleTextChange = (uploadFile) => {
  textFiles.value = uploadFile
}

const beforeUpload = (file) => {
  const isValidType = activeTab.value === 'image' 
    ? file.type.startsWith('image/')
    : activeTab.value === 'video'
    ? file.type.startsWith('video/')
    : true
  
  if (!isValidType) {
    ElMessage.error('文件类型不正确')
    return false
  }
  
  const isLt100M = file.size / 1024 / 1024 < 100
  if (!isLt100M) {
    ElMessage.error('文件大小不能超过 100MB')
    return false
  }
  
  return true
}

const handleUpload = async () => {
  let files = []
  let uploadApi = null
  
  if (activeTab.value === 'image') {
    files = imageFiles.value
    uploadApi = uploadImage
  } else if (activeTab.value === 'video') {
    files = videoFiles.value
    uploadApi = uploadVideo
  } else {
    files = textFiles.value
    uploadApi = uploadText
  }
  
  if (files.length === 0) {
    ElMessage.warning('请先选择要上传的文件')
    return
  }
  
  uploadStatus.value = {
    uploading: true,
    success: false,
    message: '正在加密并上传数据...'
  }
  
  try {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file.raw)
    })
    formData.append('encryption', selectedEncryption.value)
    formData.append('doctorId', doctorInfo.value.id)
    formData.append('doctorName', doctorInfo.value.name)
    
    await uploadApi(formData)
    
    uploadStatus.value = {
      uploading: false,
      success: true,
      message: '数据上传成功！'
    }
    ElMessage.success('数据上传成功！')
  } catch (error) {
    uploadStatus.value = {
      uploading: false,
      success: false,
      message: '上传失败，请重试'
    }
    ElMessage.error('上传失败：' + (error.message || '未知错误'))
  }
}

const resetUpload = () => {
  imageFiles.value = []
  videoFiles.value = []
  textFiles.value = []
  uploadStatus.value = {
    uploading: false,
    success: false,
    message: ''
  }
}

const currentFiles = computed(() => {
  if (activeTab.value === 'image') return imageFiles.value
  if (activeTab.value === 'video') return videoFiles.value
  return textFiles.value
})

const getTabIcon = (tab) => {
  if (tab === 'image') return Picture
  if (tab === 'video') return VideoPlay
  return Document
}
</script>

<template>
  <div class="upload-container">
    <div class="background-layer"></div>
    <div class="content-layer">
      <div class="upload-card">
        <h1 class="page-title">医学数据上传</h1>
        
        <!-- 未登录提示 -->
        <div v-if="!isLoggedIn" class="login-warning">
          <el-icon :size="32" class="warning-icon"><Warning /></el-icon>
          <div class="warning-content">
            <h3>请先登录</h3>
            <p>您尚未登录系统，请先登录后再上传数据</p>
            <el-button type="primary" @click="$router.push('/auth')" size="large">
              去登录
            </el-button>
          </div>
        </div>
        
        <!-- 登录状态下显示医生信息和上传功能 -->
        <template v-else>
          <div class="doctor-info">
            <div class="info-header">
              <el-icon :size="24"><User /></el-icon>
              <span>当前用户信息</span>
            </div>
            <div class="info-content">
              <div class="info-item">
                <span class="label">用户名：</span>
                <span class="value">{{ doctorInfo.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">用户ID：</span>
                <span class="value">{{ doctorInfo.id }}</span>
              </div>
              <div class="info-item">
                <span class="label">角色：</span>
                <span class="value">{{ currentUser.role === 'doctor' ? '医生' : '管理员' }}</span>
              </div>
              <div class="info-item">
                <span class="label">科室：</span>
                <span class="value">{{ doctorInfo.department }}</span>
              </div>
              <div class="info-item">
                <span class="label">医院：</span>
                <span class="value">{{ doctorInfo.hospital }}</span>
              </div>
              <div class="info-item">
                <span class="label">联系方式：</span>
                <span class="value">{{ currentUser.phone || currentUser.email || '暂无' }}</span>
              </div>
            </div>
          </div>

          <div class="encryption-section">
            <div class="encryption-header">
              <el-icon :size="24"><Lock /></el-icon>
              <span>数据加密方法</span>
            </div>
            <el-radio-group v-model="selectedEncryption" class="encryption-options">
              <el-radio 
                v-for="method in encryptionMethods" 
                :key="method.value" 
                :value="method.value"
                :label="method.label"
              />
            </el-radio-group>
          </div>

          <el-tabs v-model="activeTab" class="upload-tabs">
            <el-tab-pane label="图像" name="image">
              <el-upload
                v-model:file-list="imageFiles"
                :auto-upload="false"
                :before-upload="beforeUpload"
                :on-change="handleImageChange"
                multiple
                drag
                accept="image/*"
              >
                <el-icon class="el-icon--upload"><Upload /></el-icon>
                <div class="el-upload__text">
                  拖拽图像到此处或 <em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持 JPG、PNG、DICOM 等图像格式，单个文件不超过 100MB
                  </div>
                </template>
              </el-upload>
            </el-tab-pane>
            
            <el-tab-pane label="视频" name="video">
              <el-upload
                v-model:file-list="videoFiles"
                :auto-upload="false"
                :before-upload="beforeUpload"
                :on-change="handleVideoChange"
                multiple
                drag
                accept="video/*"
              >
                <el-icon class="el-icon--upload"><Upload /></el-icon>
                <div class="el-upload__text">
                  拖拽视频到此处或 <em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持 MP4、AVI 等视频格式，单个文件不超过 100MB
                  </div>
                </template>
              </el-upload>
            </el-tab-pane>
            
            <el-tab-pane label="文本" name="text">
              <el-upload
                v-model:file-list="textFiles"
                :auto-upload="false"
                :before-upload="beforeUpload"
                :on-change="handleTextChange"
                multiple
                drag
                accept=".txt,.pdf,.doc,.docx"
              >
                <el-icon class="el-icon--upload"><Upload /></el-icon>
                <div class="el-upload__text">
                  拖拽文本文件到此处或 <em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持 TXT、PDF、DOC、DOCX 等文本格式，单个文件不超过 100MB
                  </div>
                </template>
              </el-upload>
            </el-tab-pane>
          </el-tabs>

          <div class="action-buttons">
            <el-button type="primary" :loading="uploadStatus.uploading" @click="handleUpload" size="large">
              上传数据
            </el-button>
            <el-button @click="resetUpload" size="large">
              重置
            </el-button>
          </div>

          <div v-if="uploadStatus.message" class="upload-status">
            <div :class="['status-message', uploadStatus.success ? 'success' : 'uploading']">
              <el-icon v-if="uploadStatus.success" :size="20"><CircleCheck /></el-icon>
              <el-icon v-else :size="20" class="is-loading"><Upload /></el-icon>
              <span>{{ uploadStatus.message }}</span>
            </div>
            <div v-if="uploadStatus.success" class="encryption-info">
              <el-icon><Lock /></el-icon>
              <span>数据已使用 {{ encryptionMethods.find(m => m.value === selectedEncryption)?.label }} 加密</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@assets/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.15;
  z-index: 1;
}

.content-layer {
  position: relative;
  z-index: 2;
  padding: 60px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.upload-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: 50px 60px;
  max-width: 1200px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.page-title {
  text-align: center;
  color: #1a1a2e;
  margin-bottom: 40px;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.doctor-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 32px;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.doctor-info::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10%, 10%);
  }
}

.info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  padding-bottom: 16px;
}

.info-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item .label {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.85;
}

.info-item .value {
  font-size: 1.1rem;
  font-weight: 600;
}

.encryption-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 32px;
  border: 1px solid #dee2e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.encryption-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 20px;
}

.encryption-options {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

:deep(.el-radio) {
  margin-right: 0;
}

:deep(.el-radio__label) {
  font-size: 1.05rem;
  padding-left: 10px;
}

:deep(.el-radio__inner) {
  width: 20px;
  height: 20px;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.upload-tabs {
  margin-bottom: 32px;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__nav) {
  border-bottom: 2px solid #e9ecef;
}

:deep(.el-tabs__item) {
  font-size: 1.1rem;
  padding: 0 32px;
  height: 50px;
  line-height: 50px;
  color: #6c757d;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-tabs__item:hover) {
  color: #667eea;
}

:deep(.el-tabs__item.is-active) {
  color: #667eea;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 3px;
}

:deep(.el-tab-pane) {
  padding: 20px 0;
}

:deep(.el-upload-dragger) {
  padding: 60px 40px;
  border: 3px dashed #d9d9d9;
  border-radius: 16px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

:deep(.el-upload-dragger:hover) {
  border-color: #667eea;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
}

.el-icon--upload {
  font-size: 80px;
  color: #667eea;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

:deep(.el-upload-dragger:hover) .el-icon--upload {
  transform: scale(1.1);
}

.el-upload__text {
  font-size: 1.15rem;
  color: #495057;
  font-weight: 500;
}

.el-upload__text em {
  color: #667eea;
  font-style: normal;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.el-upload__tip {
  margin-top: 16px;
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 400;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 32px;
  padding-top: 10px;
}

.action-buttons .el-button {
  min-width: 180px;
  height: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-buttons .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.action-buttons .el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

.action-buttons .el-button--default {
  border: 2px solid #dee2e6;
  color: #495057;
}

.action-buttons .el-button--default:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f8f9fa;
}

.upload-status {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 24px 28px;
  border: 1px solid #dee2e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.status-message {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 16px;
  border-radius: 12px;
}

.status-message.success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.uploading {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  color: #856404;
  border: 1px solid #ffe69c;
}

.encryption-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #e7f3ff 0%, #d1e9ff 100%);
  border-radius: 12px;
  color: #004085;
  font-size: 1rem;
  font-weight: 500;
  border: 1px solid #b8daff;
}

@media (min-width: 1400px) {
  .upload-card {
    max-width: 1400px;
  }
}

@media (max-width: 1200px) {
  .upload-card {
    max-width: 1000px;
  }
  
  .info-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 未登录提示样式 */
.login-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 16px;
  padding: 40px 32px;
  margin-bottom: 32px;
  border: 2px solid #ffeaa7;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
}

.warning-icon {
  color: #ffc107;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-content h3 {
  color: #856404;
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.warning-content p {
  color: #856404;
  margin: 0 0 20px 0;
  font-size: 1.1rem;
}

@media (max-width: 1200px) {
  .upload-card {
    max-width: 1000px;
  }
  
  .info-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .upload-card {
    padding: 30px 24px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .info-content {
    grid-template-columns: 1fr;
  }
  
  .encryption-options {
    flex-direction: column;
    gap: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
  
  :deep(.el-upload-dragger) {
    padding: 40px 20px;
  }
  
  .login-warning {
    flex-direction: column;
    text-align: center;
  }
}
</style>
