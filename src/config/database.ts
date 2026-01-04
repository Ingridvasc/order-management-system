/**
 * Configuração da conexão com o MongoDB
 * Gerencia a conexão e eventos do banco de dados
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Conecta ao banco de dados MongoDB
 * @returns Promise<void> - Resolve quando a conexão é estabelecida
 * @throws Error - Se não conseguir conectar
 */
const connectDB = async (): Promise<void> => {
  try {
    // Obtém a URI do MongoDB das variáveis de ambiente
    const mongoURI = process.env.MONGODB_URI;
    
    // Valida se a URI está definida
    if (!mongoURI) {
      throw new Error('MONGODB_URI não está definida no .env');
    }

    // Estabelece a conexão com o MongoDB
    await mongoose.connect(mongoURI);
    
    // Log de sucesso com informações da conexão
    console.log('MongoDB conectado com sucesso!');
    console.log(`Banco: ${mongoose.connection.db?.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
    // Event listeners para monitoramento da conexão
    
    // Evento de erro na conexão
    mongoose.connection.on('error', (error) => {
      console.error('Erro na conexão MongoDB:', error);
    });
    
    // Evento de desconexão
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB desconectado');
    });
    
    // Fecha a conexão graciosamente quando a aplicação é encerrada
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexão MongoDB fechada');
      process.exit(0);
    });
    
  } catch (error) {
    // Log detalhado do erro e encerra a aplicação
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);  // Encerra a aplicação com código de erro
  }
};

export default connectDB;