import { post } from '../utils/request';

// 登录
export const login = async (loginData) => {
  const response = await post('/auth/login', loginData);
  return response;
};

// 注册
export const register = async (registerData) => {
  const response = await post('/auth/register', registerData);
  return response;
};