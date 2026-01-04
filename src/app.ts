import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import orderRoutes from './routes/orders';
import { AppError } from './types';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/orders`, orderRoutes);

/**
 * Health Check endpoint
 * Remove o parâmetro 'req' não utilizado e adiciona underline
 */
app.get(`${apiPrefix}/health`, (_req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: 'API está funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Bem-vindo à API de Gestão de Pedidos de Laboratório',
    documentation: `${req.protocol}://${req.get('host')}${apiPrefix}/health`,
    endpoints: {
      auth: {
        register: `POST ${apiPrefix}/auth/register`,
        login: `POST ${apiPrefix}/auth/login`
      },
      orders: {
        create: `POST ${apiPrefix}/orders`,
        list: `GET ${apiPrefix}/orders`,
        advance: `PATCH ${apiPrefix}/orders/:id/advance`
      }
    }
  });
});

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.originalUrl}`,
    suggested: `${req.protocol}://${req.get('host')}`
  });
});

/**
 * Middleware global de tratamento de erros
 * Adiciona return em todas as respostas
 */
app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(' Error Handler:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      error: error.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      error: error.message,
      stack: error.stack 
    })
  });
});

export default app;