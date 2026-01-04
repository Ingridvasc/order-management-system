"use strict";
/**
 * Rotas de autenticação
 * Define endpoints públicos para registro e login
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
// Cria um router do Express para agrupar rotas relacionadas
const router = express_1.default.Router();
/**
 * @route   POST /api/auth/register
 * @desc    Registra um novo usuário
 * @access  Público
 * @body    { email: string, password: string }
 * @returns { success: boolean, message: string, data: { user, token } }
 */
router.post('/register', authController_1.authController.register);
/**
 * @route   POST /api/auth/login
 * @desc    Autentica um usuário existente
 * @access  Público
 * @body    { email: string, password: string }
 * @returns { success: boolean, message: string, data: { user, token } }
 */
router.post('/login', authController_1.authController.login);
// Exporta o router para ser usado no app principal
exports.default = router;
//# sourceMappingURL=auth.js.map