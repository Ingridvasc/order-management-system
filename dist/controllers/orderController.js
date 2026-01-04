"use strict";
/**
 * Controller de pedidos
 * Gerencia operações CRUD para pedidos de laboratório
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const Order_1 = require("../models/Order");
/**
 * Objeto contendo todos os métodos do controller de pedidos
 */
exports.orderController = {
    /**
     * Cria um novo pedido
     * Implementa validações de negócio da ETAPA 2
     * @param req - Request com dados do pedido no body
     * @param res - Response do Express
     */
    createOrder: async (req, res) => {
        try {
            // Extrai dados do pedido do corpo da requisição
            const { lab, patient, customer, services } = req.body;
            // Obtém ID do usuário do middleware de autenticação
            const userId = req.userId;
            // Valida se o usuário está autenticado (fallback safety)
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado'
                });
                return;
            }
            // Cria o pedido no banco de dados
            // As validações são feitas automaticamente pelo Mongoose
            const order = await Order_1.Order.create({
                lab,
                patient,
                customer,
                services,
                createdBy: userId
            });
            // Retorna resposta de sucesso
            res.status(201).json({
                success: true,
                message: 'Pedido criado com sucesso',
                data: { order }
            });
        }
        catch (error) {
            console.error('Create order error:', error);
            // Determina status code baseado no tipo de erro
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Erro ao criar pedido'
            });
        }
    },
    /**
     * Lista pedidos com paginação e filtro por estado
     * Implementa requisito de paginação da ETAPA 1
     * @param req - Request com query params para paginação e filtro
     * @param res - Response do Express
     */
    getOrders: async (req, res) => {
        try {
            // Extrai parâmetros de query com valores padrão
            const { page = '1', limit = '10', state } = req.query;
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado'
                });
                return;
            }
            // Constrói filtro para a query
            const filter = {
                createdBy: userId, // Apenas pedidos do usuário atual
                status: 'ACTIVE' // Apenas pedidos ativos (não deletados)
            };
            // Adiciona filtro por estado se fornecido
            if (state) {
                filter.state = state;
            }
            // Converte parâmetros de string para número
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum; // Calcula offset para paginação
            // Executa queries em paralelo para melhor performance
            const [orders, total] = await Promise.all([
                // Busca pedidos com paginação
                Order_1.Order.find(filter)
                    .sort({ createdAt: -1 }) // Ordena por data de criação (mais recente primeiro)
                    .skip(skip) // Pula registros das páginas anteriores
                    .limit(limitNum) // Limita número de resultados
                    .lean(), // Retorna objetos JavaScript simples (mais rápido)
                // Conta total de pedidos para cálculo de páginas
                Order_1.Order.countDocuments(filter)
            ]);
            // Retorna resposta com dados e metadados de paginação
            res.json({
                success: true,
                message: 'Pedidos listados com sucesso',
                data: {
                    orders,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum) // Calcula número total de páginas
                    }
                }
            });
        }
        catch (error) {
            console.error('Get orders error:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao listar pedidos',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
    /**
     * Avança o estado de um pedido
     * Implementa regras de transição da ETAPA 2
     * @param req - Request com ID do pedido nos params
     * @param res - Response do Express
     */
    advanceOrder: async (req, res) => {
        try {
            const { id } = req.params; // ID do pedido da URL
            const userId = req.userId; // ID do usuário do middleware
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado'
                });
                return;
            }
            // Busca pedido apenas se pertencer ao usuário e estiver ativo
            const order = await Order_1.Order.findOne({
                _id: id,
                createdBy: userId,
                status: 'ACTIVE'
            });
            if (!order) {
                res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado'
                });
                return;
            }
            // Mapa de transições de estado permitidas
            // Define o fluxo estrito: CREATED -> ANALYSIS -> COMPLETED
            const validTransitions = {
                'CREATED': 'ANALYSIS', // CREATED só pode ir para ANALYSIS
                'ANALYSIS': 'COMPLETED', // ANALYSIS só pode ir para COMPLETED
                'COMPLETED': null // COMPLETED é estado final (não pode avançar mais)
            };
            // Obtém próximo estado válido baseado no estado atual
            const nextState = validTransitions[order.state];
            // Valida se o pedido pode avançar
            if (!nextState) {
                res.status(400).json({
                    success: false,
                    message: `Pedido já está no estado final (${order.state})`
                });
                return;
            }
            // Atualiza estado do pedido
            order.state = nextState;
            await order.save();
            // Retorna resposta de sucesso
            res.json({
                success: true,
                message: `Pedido avançado para ${nextState}`,
                data: { order }
            });
        }
        catch (error) {
            console.error('Advance order error:', error);
            // Determina status code baseado no tipo de erro
            let statusCode = 400;
            if (error.name === 'CastError') {
                statusCode = 404; // ID inválido
            }
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Erro ao avançar pedido'
            });
        }
    }
};
//# sourceMappingURL=orderController.js.map