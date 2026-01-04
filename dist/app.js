"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const auth_1 = __importDefault(require("./routes/auth"));
const orders_1 = __importDefault(require("./routes/orders"));
const types_1 = require("./types");
const app = (0, express_1.default)();
(0, database_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const apiPrefix = process.env.API_PREFIX || '/api/v1';
app.use(`${apiPrefix}/auth`, auth_1.default);
app.use(`${apiPrefix}/orders`, orders_1.default);
/**
 * Health Check endpoint
 * Remove o parâmetro 'req' não utilizado e adiciona underline
 */
app.get(`${apiPrefix}/health`, (_req, res) => {
    res.json({
        success: true,
        message: 'API está funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});
app.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo à API de Gestão de Pedidos de Laboratório',
        documentation: `${req.protocol}://${req.get('host')}${apiPrefix}/health`,
        endpoints: {
            auth: {
                register: `POST ${apiPrefix}/auth/register`,
                login: `POST ${apiPrefix}/auth/login`
            },
            orders: {
                create: `POST ${apiPrefix}/orders`,
                list: `GET ${apiPrefix}/orders`,
                advance: `PATCH ${apiPrefix}/orders/:id/advance`
            }
        }
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Rota não encontrada: ${req.originalUrl}`,
        suggested: `${req.protocol}://${req.get('host')}`
    });
});
/**
 * Middleware global de tratamento de erros
 * Adiciona return em todas as respostas
 */
app.use((error, req, res, _next) => {
    console.error(' Error Handler:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    if (error instanceof types_1.AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            error: error.message
        });
    }
    return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && {
            error: error.message,
            stack: error.stack
        })
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map