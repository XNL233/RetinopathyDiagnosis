<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@assets/images/logo.svg" alt="Logo" class="logo">
        <h2>视网膜病变AI诊断平台</h2>
        <p>医生端</p>
      </div>
      
      <div class="form-container">
        <!-- 切换按钮 -->
        <div class="switch-form">
          <el-radio-group v-model="activeForm" size="large">
            <el-radio-button value="login">登录</el-radio-button>
            <el-radio-button value="register">注册</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 登录表单 -->
        <el-form 
          v-if="activeForm === 'login'"
          ref="loginFormRef"
          :model="loginForm" 
          :rules="loginRules"
          class="form"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username"
              placeholder="用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password" 
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              class="submit-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 注册表单 -->
        <el-form
          v-else
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="form"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="registerForm.username"
              placeholder="用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="邮箱"
              :prefix-icon="Message"
            />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="手机号"
              :prefix-icon="Iphone"
            />
          </el-form-item>
          <el-form-item prop="identityCard">
            <el-input
              v-model="registerForm.identityCard"
              placeholder="身份证号"
              :prefix-icon="CreditCard"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit-btn"
              :loading="registerLoading"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="login-footer">
        <p>本平台由南京邮电大学团队开发</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, Message, Iphone, CreditCard } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register } from '@/api/auth'

// 路由实例
const router = useRouter()

// 表单状态
const activeForm = ref('login')
const loading = ref(false)
const registerLoading = ref(false)

// 表单引用
const loginFormRef = ref(null)
const registerFormRef = ref(null)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  email: '',
  phone: '',
  identityCard: ''
})

// 登录表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 注册表单验证规则
const registerRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [
    { required: false },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: false },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  identityCard: [
    { required: false },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = async () => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const response = await login(loginForm)
    console.log('登录成功:', response)
    
    // 保存token和用户信息到本地存储
    localStorage.setItem('token', response.token)
    localStorage.setItem('userInfo', JSON.stringify(response.user))
    
    ElMessage.success(`登录成功！欢迎 ${loginForm.username}`)
    // 登录成功后跳转到诊断页面
    router.push('/diagnosis')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  if (registerLoading.value) return
  
  registerLoading.value = true
  
  try {
    const response = await register(registerForm)
    console.log('注册成功:', response)
    
    ElMessage.success(`注册成功！欢迎 ${registerForm.username}`)
    // 注册成功后切换到登录表单
    activeForm.value = 'login'
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error(error.message || '注册失败，请稍后重试')
  } finally {
    registerLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
// 整个登录页面的背景容器
.login-container {
  min-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-box {  // 圆角矩形框
    width: 420px;
    padding: 30px;  // 内边距 30px
    background: #fff;
    border-radius: 12px;  // 12px 圆角，让卡片边缘更圆润 
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);  // 轻微阴影（水平偏移0，垂直偏移8px，模糊24px，黑色半透明），增强卡片立体感
    
    .login-header {  // 头部区域
      text-align: center;
      margin-bottom: 20px;  // 底部间距
      
      .logo {  // logo 图片
        width: 100px;
        margin-bottom: 16px;
      }
      
      h2 {  // 标题
        font-size: 38px;
        color: #333;
        margin: 0 0 8px;
      }
      
      p {  // 描述文字
        color: #666;
        margin: 0;
      }
    }
    
    .form-container {  // 表单容器
      .switch-form {
        margin-bottom: 24px;
        text-align: center;
      }
      
      .form {
        .el-input {
          --el-input-height: 42px;
          margin-bottom: 20px;
        }
        
        .submit-btn {
          width: 100%;
          height: 42px;
        }
      }
    }
    
    .login-footer {
      margin-top: 60px;  // 增加顶部间距
      text-align: center;
      
      p {
        color: #b0acac;
        margin-bottom: 12px;
      }
    }
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .login-container {
    padding: 20px;
    
    .login-box {
      width: 100%;
      padding: 30px 20px;
    }
  }
}
</style>