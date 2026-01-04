/**
 * Rotas de autenticação
 * Define endpoints públicos para registro e login
 */

import express from 'express';
import { authController } from '../controllers/authController';

// Cria um router do Express para agrupar rotas relacionadas
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registra um novo usuário
 * @access  Público
 * @body    { email: string, password: string }
 * @returns { success: boolean, message: string, data: { user, token } }
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Autentica um usuário existente
 * @access  Público
 * @body    { email: string, password: string }
 * @returns { success: boolean, message: string, data: { user, token } }
 */
router.post('/login', authController.login);

// Exporta o router para ser usado no app principal
export default router;