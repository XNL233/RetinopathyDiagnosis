const { verifyToken } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ code: 401, message: '未提供认证token' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ code: 401, message: '无效的token格式' });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ code: 401, message: '无效或过期的token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    res.status(500).json({ code: 500, message: '认证过程中发生错误' });
  }
};

module.exports = authMiddleware;