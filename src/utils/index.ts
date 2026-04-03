// 本地存储工具
export const storage = {
  // 获取存储值
  get: (key: string): any => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return null;
  },

  // 设置存储值
  set: (key: string, value: any): void => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  },

  // 删除存储值
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  // 清空存储
  clear: (): void => {
    localStorage.clear();
  },
};

// 导出请求工具
export { get, post, put, del, upload } from './request';