/**
 * Rotas de pedidos
 * Define endpoints protegidos para operações com pedidos
 */

import express from 'express';
import { orderController } from '../controllers/orderController';
import authMiddleware from '../middlewares/auth';

// Cria router para rotas de pedidos
const router = express.Router();

/**
 * Aplica middleware de autenticação a TODAS as rotas deste router
 * Todas as rotas abaixo exigem um token JWT válido
 */
router.use(authMiddleware);

/**
 * @route   POST /api/orders
 * @desc    Cria um novo pedido
 * @access  Privado (requer token JWT)
 * @body    { lab: string, patient: string, customer: string, services: Array }
 * @returns { success: boolean, message: string, data: { order } }
 */
router.post('/', orderController.createOrder);

/**
 * @route   GET /api/orders
 * @desc    Lista pedidos com paginação e filtro
 * @access  Privado (requer token JWT)
 * @query   { page?: number, limit?: number, state?: OrderState }
 * @returns { success: boolean, data: { orders, pagination } }
 */
router.get('/', orderController.getOrders);

/**
 * @route   PATCH /api/orders/:id/advance
 * @desc    Avança o estado de um pedido específico
 * @access  Privado (requer token JWT)
 * @params  { id: string } - ID do pedido
 * @returns { success: boolean, message: string, data: { order } }
 */
router.patch('/:id/advance', orderController.advanceOrder);

// Exporta o router para ser usado no app principal
export default router;