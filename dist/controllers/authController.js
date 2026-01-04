"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
exports.authController = {
    register: async (req, res) => {
        try {
            const { email, password } = req.body;
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: 'Email já cadastrado'
                });
                return;
            }
            const user = await User_1.User.create({ email, password });
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET não configurado');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, secret, { expiresIn: '24h' });
            res.status(201).json({
                success: true,
                message: 'Usuário registrado com sucesso',
                data: {
                    user: {
                        id: user._id,
                        email: user.email
                    },
                    token
                }
            });
        }
        catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao registrar usuário'
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ email }).select('+password');
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
                return;
            }
            // CORREÇÃO: usar bcrypt.compare diretamente
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
                return;
            }
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET não configurado');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, secret, { expiresIn: '24h' });
            res.json({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    user: {
                        id: user._id,
                        email: user.email
                    },
                    token
                }
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao fazer login'
            });
        }
    }
};
//# sourceMappingURL=authController.js.map