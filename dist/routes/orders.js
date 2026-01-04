"use strict";
/**
 * Rotas de pedidos
 * Define endpoints protegidos para operações com pedidos
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = __importDefault(require("../middlewares/auth"));
// Cria router para rotas de pedidos
const router = express_1.default.Router();
/**
 * Aplica middleware de autenticação a TODAS as rotas deste router
 * Todas as rotas abaixo exigem um token JWT válido
 */
router.use(auth_1.default);
/**
 * @route   POST /api/orders
 * @desc    Cria um novo pedido
 * @access  Privado (requer token JWT)
 * @body    { lab: string, patient: string, customer: string, services: Array }
 * @returns { success: boolean, message: string, data: { order } }
 */
router.post('/', orderController_1.orderController.createOrder);
/**
 * @route   GET /api/orders
 * @desc    Lista pedidos com paginação e filtro
 * @access  Privado (requer token JWT)
 * @query   { page?: number, limit?: number, state?: OrderState }
 * @returns { success: boolean, data: { orders, pagination } }
 */
router.get('/', orderController_1.orderController.getOrders);
/**
 * @route   PATCH /api/orders/:id/advance
 * @desc    Avança o estado de um pedido específico
 * @access  Privado (requer token JWT)
 * @params  { id: string } - ID do pedido
 * @returns { success: boolean, message: string, data: { order } }
 */
router.patch('/:id/advance', orderController_1.orderController.advanceOrder);
// Exporta o router para ser usado no app principal
exports.default = router;
//# sourceMappingURL=orders.js.map