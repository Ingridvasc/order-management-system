/**
 * Classe de erro personalizada para a aplicação
 * Permite definir status codes específicos e mensagens customizadas
 */

export class AppError extends Error {
  /**
   * Código de status HTTP para o erro
   */
  public statusCode: number;
  
  /**
   * Indica se o erro é operacional (esperado) ou de programação
   */
  public isOperational: boolean;

  /**
   * Cria uma nova instância de AppError
   * @param message - Mensagem de erro descritiva
   * @param statusCode - Código de status HTTP (padrão: 400)
   */
  constructor(message: string, statusCode: number = 400) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = true;  // Erros operacionais são esperados no fluxo normal
    this.name = 'AppError';
    
    // Preserva o stack trace para debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Função helper para criar erros de validação
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 400
 */
export const createValidationError = (message: string): AppError => {
  return new AppError(message, 400);
};

/**
 * Função helper para criar erros de autenticação
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 401
 */
export const createAuthError = (message: string): AppError => {
  return new AppError(message, 401);
};

/**
 * Função helper para criar erros de não encontrado
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 404
 */
export const createNotFoundError = (message: string): AppError => {
  return new AppError(message, 404);
};