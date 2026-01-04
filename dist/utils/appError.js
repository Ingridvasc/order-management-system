"use strict";
/**
 * Classe de erro personalizada para a aplicação
 * Permite definir status codes específicos e mensagens customizadas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotFoundError = exports.createAuthError = exports.createValidationError = exports.AppError = void 0;
class AppError extends Error {
    /**
     * Cria uma nova instância de AppError
     * @param message - Mensagem de erro descritiva
     * @param statusCode - Código de status HTTP (padrão: 400)
     */
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Erros operacionais são esperados no fluxo normal
        this.name = 'AppError';
        // Preserva o stack trace para debugging
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Função helper para criar erros de validação
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 400
 */
const createValidationError = (message) => {
    return new AppError(message, 400);
};
exports.createValidationError = createValidationError;
/**
 * Função helper para criar erros de autenticação
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 401
 */
const createAuthError = (message) => {
    return new AppError(message, 401);
};
exports.createAuthError = createAuthError;
/**
 * Função helper para criar erros de não encontrado
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 404
 */
const createNotFoundError = (message) => {
    return new AppError(message, 404);
};
exports.createNotFoundError = createNotFoundError;
//# sourceMappingURL=appError.js.map