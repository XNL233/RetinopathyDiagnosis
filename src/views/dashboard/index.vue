<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToAuth = () => {
  router.push('/auth')
}
</script>

<template>
  <div class="welcome-container">
    <div class="background-layer"></div>
    <div class="content-layer">
      <div class="header-section">
        <a @click="goToAuth">
          <img src="@assets/images/logo.svg" class="logo" alt="Vite logo" />
        </a>
      </div>

      <div class="content">
        <h1>{{ '视网膜病变AI诊断平台' }}</h1>
      </div>



      <div class="footer">
        <!---
        <p class="tips">点击上方图标跳转至登录/注册界面</p>
        -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 7em;
  padding: 0.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #121886aa);
}

.welcome-container {
  min-height: 90vh;
  position: relative;
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
  opacity: 0.14;
  z-index: 1;
}

.content-layer {
  position: relative;
  z-index: 2;
  min-height: 0vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header-section {
  display: flex;
  justify-content: center;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

h1 {
  color: #2c3e50;
  font-size: 3rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.action-section {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.upload-btn {
  font-size: 1.2rem;
  padding: 15px 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.footer {
  padding: 20px;
  text-align: center;
}

.tips {
  color: #fff;
  font-size: 1.1rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  display: inline-block;
}
</style>
