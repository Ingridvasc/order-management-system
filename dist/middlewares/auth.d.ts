/**
 * Middleware de autenticação JWT
 * Verifica e valida tokens JWT nas requisições
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Middleware de autenticação
 * Verifica a presença e validade do token JWT
 * Adiciona informações do usuário à requisição
 */
declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default authMiddleware;
//# sourceMappingURL=auth.d.ts.map