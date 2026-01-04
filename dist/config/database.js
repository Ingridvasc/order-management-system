"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI || mongoURI.includes('#')) {
            console.log('MongoDB não configurado. Usando memória para testes.');
            return;
        }
        await mongoose_1.default.connect(mongoURI);
        console.log('MongoDB conectado!');
    }
    catch (error) {
        console.log('API rodando sem MongoDB. Dados em memória.');
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map