const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
      }

      const user = await User.findByUsername(username);
      
      if (!user) {
        return res.status(401).json({ code: 401, message: '用户名或密码错误' });
      }

      const isPasswordValid = await User.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ code: 401, message: '用户名或密码错误' });
      }

      if (user.status !== 'active') {
        return res.status(403).json({ code: 403, message: '账号已被禁用' });
      }

      const token = generateToken(user);
      
      res.json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            created_at: user.created_at
          }
        }
      });
    } catch (error) {
      console.error('登录错误:', error);
      res.status(500).json({ code: 500, message: '登录过程中发生错误' });
    }
  }

  static async register(req, res) {
    try {
      const { username, password, email, phone, identityCard } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
      }

      const existingUser = await User.findByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ code: 400, message: '用户名已存在' });
      }

      const userId = await User.create({
        username,
        password,
        email,
        phone,
        identityCard
      });

      res.status(201).json({
        code: 201,
        message: '注册成功',
        data: {
          userId
        }
      });
    } catch (error) {
      console.error('注册错误:', error);
      res.status(500).json({ code: 500, message: '注册过程中发生错误' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ code: 404, message: '用户不存在' });
      }

      res.json({
        code: 200,
        message: '获取用户信息成功',
        data: user
      });
    } catch (error) {
      console.error('获取用户信息错误:', error);
      res.status(500).json({ code: 500, message: '获取用户信息失败' });
    }
  }
}

module.exports = AuthController;