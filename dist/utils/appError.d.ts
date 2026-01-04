/**
 * Classe de erro personalizada para a aplicação
 * Permite definir status codes específicos e mensagens customizadas
 */
export declare class AppError extends Error {
    /**
     * Código de status HTTP para o erro
     */
    statusCode: number;
    /**
     * Indica se o erro é operacional (esperado) ou de programação
     */
    isOperational: boolean;
    /**
     * Cria uma nova instância de AppError
     * @param message - Mensagem de erro descritiva
     * @param statusCode - Código de status HTTP (padrão: 400)
     */
    constructor(message: string, statusCode?: number);
}
/**
 * Função helper para criar erros de validação
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 400
 */
export declare const createValidationError: (message: string) => AppError;
/**
 * Função helper para criar erros de autenticação
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 401
 */
export declare const createAuthError: (message: string) => AppError;
/**
 * Função helper para criar erros de não encontrado
 * @param message - Mensagem de erro
 * @returns Nova instância de AppError com status 404
 */
export declare const createNotFoundError: (message: string) => AppError;
//# sourceMappingURL=appError.d.ts.map