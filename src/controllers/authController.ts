import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Email já cadastrado'
        });
        return;
      }

      const user = await User.create({ email, password });

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET não configurado');
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        secret,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: {
          user: {
            id: user._id,
            email: user.email
          },
          token
        }
      });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao registrar usuário'
      });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
        return;
      }

      // CORREÇÃO: usar bcrypt.compare diretamente
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
        return;
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET não configurado');
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        secret,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: user._id,
            email: user.email
          },
          token
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao fazer login'
      });
    }
  }
};