import { API_BASE_URL, HTTP_STATUS } from '../constants';
import type { ApiResponse } from '../types';
import { storage } from '../utils';

// 请求配置
interface RequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// 默认配置
const defaultConfig: RequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 请求拦截器
const requestInterceptor = (config: RequestInit): RequestInit => {
  // 添加token到请求头
  const token = storage.get('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  return config;
};

// 响应拦截器
const responseInterceptor = async (response: Response): Promise<ApiResponse> => {
  // 检查HTTP状态码
  if (!response.ok) {
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      // token过期，清除本地存储并跳转到登录页
      storage.remove('token');
      storage.remove('userInfo');
      window.location.href = '/auth';
    }
    
    throw new Error(`请求失败: ${response.status} ${response.statusText}`);
  }
  
  // 解析响应数据
  const data = await response.json();
  
  // 检查业务状态码
  if (data.code && ![HTTP_STATUS.OK, HTTP_STATUS.CREATED].includes(data.code)) {
    throw new Error(data.message || '请求失败');
  }
  
  return data;
};

// 封装fetch请求
const request = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // 合并配置
  const config = {
    ...defaultConfig,
    ...options,
    headers: {
      ...defaultConfig.headers,
      ...options.headers,
    },
  };
  
  // 处理URL
  const fullUrl = url.startsWith('http') ? url : `${config.baseURL}${url}`;
  
  // 请求拦截
  const interceptedConfig = requestInterceptor({
    ...config,
    headers: config.headers as HeadersInit,
  });
  
  try {
    // 发送请求
    const response = await fetch(fullUrl, interceptedConfig);
    
    // 响应拦截
    const result = await responseInterceptor(response);
    return result.data as T;
  } catch (error) {
    console.error('请求错误:', error);
    throw error;
  }
};

// GET请求
export const get = <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
  let finalUrl = url;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, String(params[key]));
      }
    });
    finalUrl = `${url}?${searchParams.toString()}`;
  }
  
  return request<T>(finalUrl, { method: 'GET' });
};

// POST请求
export const post = <T = any>(url: string, data?: any): Promise<T> => {
  return request<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// PUT请求
export const put = <T = any>(url: string, data?: any): Promise<T> => {
  return request<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// DELETE请求
export const del = <T = any>(url: string): Promise<T> => {
  return request<T>(url, { method: 'DELETE' });
};

// 文件上传
export const upload = <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    // 监听上传进度
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }
    
    // 请求完成
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('响应解析失败'));
        }
      } else {
        reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
      }
    });
    
    // 请求错误
    xhr.addEventListener('error', () => {
      reject(new Error('网络错误'));
    });
    
    // 设置请求头
    const token = storage.get('token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    
    // 发送请求
    xhr.open('POST', `${API_BASE_URL}${url}`);
    xhr.send(formData);
  });
};