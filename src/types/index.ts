// 用户相关类型定义
export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  identityCard?: string;
  token?: string;
}

// 登录表单类型
export interface LoginForm {
  username: string;
  password: string;
}

// 注册表单类型
export interface RegisterForm {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  identityCard?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 图像相关类型
export interface ImageData {
  id: string;
  name: string;
  url: string;
  uploadTime: Date;
  size: number;
}

// 诊断结果类型
export interface DiagnosisResult {
  id: string;
  imageId: string;
  level: string;
  confidence: number;
  lesions: string[];
  doctorNotes?: string;
  createTime: Date;
}

// 模型配置类型
export interface ModelConfig {
  enhancementModel: string;
  diagnosisModel: string;
  hardware: 'gpu' | 'cpu';
}

// 标注类型
export interface Annotation {
  id: string;
  type: 'circle' | 'rectangle' | 'text';
  coordinates: any;
  color: string;
  lineWidth: number;
  text?: string;
}