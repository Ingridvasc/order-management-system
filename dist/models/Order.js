"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const serviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Nome do serviço é obrigatório'],
        trim: true
    },
    value: {
        type: Number,
        required: [true, 'Valor do serviço é obrigatório'],
        min: [0, 'Valor não pode ser negativo']
    },
    status: {
        type: String,
        enum: ['PENDING', 'DONE'],
        default: 'PENDING'
    }
});
const orderSchema = new mongoose_1.Schema({
    lab: {
        type: String,
        required: [true, 'Laboratório é obrigatório'],
        trim: true
    },
    patient: {
        type: String,
        required: [true, 'Paciente é obrigatório'],
        trim: true
    },
    customer: {
        type: String,
        required: [true, 'Cliente é obrigatório'],
        trim: true
    },
    state: {
        type: String,
        enum: ['CREATED', 'ANALYSIS', 'COMPLETED'],
        default: 'CREATED'
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DELETED'],
        default: 'ACTIVE'
    },
    services: {
        type: [serviceSchema],
        required: [true, 'Serviços são obrigatórios'],
        validate: {
            validator: (services) => services.length > 0,
            message: 'Pedido deve conter pelo menos um serviço'
        }
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            // Usa type assertion para evitar erros de tipo
            const typedDoc = doc;
            ret.id = typedDoc._id?.toString() || typedDoc._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
orderSchema.virtual('totalValue').get(function () {
    return this.services.reduce((sum, service) => sum + service.value, 0);
});
orderSchema.pre('save', function (next) {
    const totalValue = this.services.reduce((sum, service) => sum + service.value, 0);
    if (totalValue <= 0) {
        next(new Error('Valor total do pedido deve ser maior que zero'));
        return;
    }
    next();
});
exports.Order = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=Order.js.map