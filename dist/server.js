"use strict";
/**
 * Ponto de entrada da aplicação
 * Inicializa o servidor Express e configura o ambiente
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
// Carrega variáveis de ambiente do arquivo .env
dotenv_1.default.config();
/**
 * Obtém a porta do ambiente ou usa 3000 como padrão
 * Em produção, geralmente definida pelo serviço de hospedagem
 */
const PORT = process.env.PORT || 3000;
/**
 * Inicia o servidor Express
 */
app_1.default.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                API INICIADA COM SUCESSO                  ║
╚══════════════════════════════════════════════════════════╝

Informações do Servidor:
   Porta: ${PORT}
   Ambiente: ${process.env.NODE_ENV || 'development'}
   URL: http://localhost:${PORT}

Endpoints Disponíveis:

AUTENTICAÇÃO (Público):
   POST   ${process.env.API_PREFIX || '/api/v1'}/auth/register
   POST   ${process.env.API_PREFIX || '/api/v1'}/auth/login

PEDIDOS (Privado - requer token JWT):
   POST   ${process.env.API_PREFIX || '/api/v1'}/orders
   GET    ${process.env.API_PREFIX || '/api/v1'}/orders
   PATCH  ${process.env.API_PREFIX || '/api/v1'}/orders/:id/advance

HEALTH CHECK (Público):
   GET    ${process.env.API_PREFIX || '/api/v1'}/health

TESTES:
   npm test              # Executa todos os testes
   npm run test:watch    # Modo watch para desenvolvimento

Teste Inicial:
   http://localhost:${PORT}/
   http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}/health

Dica: Use Insomnia ou Postman para testar os endpoints
  `);
});
/**
 * Manipuladores para encerramento gracioso
 */
// Encerramento gracioso no sinal SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n Recebido SIGINT. Encerrando servidor graciosamente...');
    process.exit(0);
});
// Encerramento gracioso no sinal SIGTERM (comando kill)
process.on('SIGTERM', () => {
    console.log('\n Recebido SIGTERM. Encerrando servidor graciosamente...');
    process.exit(0);
});
/**
 * Captura erros não tratados globalmente
 */
// Promises rejeitadas não tratadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection em:', promise, 'motivo:', reason);
});
// Exceções não capturadas
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1); // Força reinício em produção
});
//# sourceMappingURL=server.js.map