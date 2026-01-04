/**
 * Controller de pedidos
 * Gerencia operações CRUD para pedidos de laboratório
 */
import { Request, Response } from 'express';
/**
 * Objeto contendo todos os métodos do controller de pedidos
 */
export declare const orderController: {
    /**
     * Cria um novo pedido
     * Implementa validações de negócio da ETAPA 2
     * @param req - Request com dados do pedido no body
     * @param res - Response do Express
     */
    createOrder: (req: Request, res: Response) => Promise<void>;
    /**
     * Lista pedidos com paginação e filtro por estado
     * Implementa requisito de paginação da ETAPA 1
     * @param req - Request com query params para paginação e filtro
     * @param res - Response do Express
     */
    getOrders: (req: Request, res: Response) => Promise<void>;
    /**
     * Avança o estado de um pedido
     * Implementa regras de transição da ETAPA 2
     * @param req - Request com ID do pedido nos params
     * @param res - Response do Express
     */
    advanceOrder: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=orderController.d.ts.map