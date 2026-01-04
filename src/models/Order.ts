import mongoose, { Schema } from 'mongoose';
import { IOrder, IService } from '../types';

const serviceSchema = new Schema<IService>({
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

const orderSchema = new Schema<IOrder>(
  {
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
        validator: (services: IService[]) => services.length > 0,
        message: 'Pedido deve conter pelo menos um serviço'
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: any) => {
        // Usa type assertion para evitar erros de tipo
        const typedDoc = doc as any;
        ret.id = typedDoc._id?.toString() || typedDoc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

orderSchema.virtual('totalValue').get(function(this: any) {
  return this.services.reduce((sum: number, service: IService) => sum + service.value, 0);
});

orderSchema.pre('save', function(this: any, next) {
  const totalValue = this.services.reduce((sum: number, service: IService) => sum + service.value, 0);
  
  if (totalValue <= 0) {
    next(new Error('Valor total do pedido deve ser maior que zero'));
    return;
  }
  
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);