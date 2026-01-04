/**
 * Middleware de autenticação JWT
 * Verifica e valida tokens JWT nas requisições
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest, IUser } from '../types';

/**
 * Interface para o payload do token JWT
 * Define a estrutura dos dados dentro do token
 */
interface JwtPayload {
  userId: string;    // ID do usuário
  email: string;     // Email do usuário
  iat?: number;      // Issued at (timestamp de criação)
  exp?: number;      // Expiration (timestamp de expiração)
}

/**
 * Middleware de autenticação
 * Verifica a presença e validade do token JWT
 * Adiciona informações do usuário à requisição
 */
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtém o header Authorization da requisição
    const authHeader = req.header('Authorization');
    
    // Verifica se o header existe e está no formato correto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false, 
        message: 'Token não fornecido' 
      });
      return;
    }

    // Extrai o token (remove "Bearer " do início)
    const token = authHeader.split(' ')[1];
    
    // Obtém a chave secreta JWT do ambiente
    const secret = process.env.JWT_SECRET;
    
    // Valida se a chave secreta está configurada
    if (!secret) {
      throw new Error('JWT_SECRET não configurado');
    }

    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Busca o usuário no banco de dados (excluindo o campo password)
    const user = await User.findById(decoded.userId).select('-password');
    
    // Verifica se o usuário existe
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
      return;
    }

    // Adiciona informações do usuário à requisição
    // Usa type assertion para adicionar propriedades customizadas
    (req as AuthRequest).user = user as IUser;
    (req as AuthRequest).userId = user._id?.toString();
    (req as AuthRequest).token = token;

    // Chama o próximo middleware/controller
    next();
  } catch (error: any) {
    // Trata diferentes tipos de erros de autenticação
    
    if (error.name === 'JsonWebTokenError') {
      // Token inválido (assinatura incorreta, token malformado)
      res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    } else if (error.name === 'TokenExpiredError') {
      // Token expirado
      res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    } else {
      // Outros erros (erro de rede, erro no banco, etc.)
      res.status(401).json({ 
        success: false, 
        message: error.message || 'Erro de autenticação' 
      });
    }
  }
};

export default authMiddleware;