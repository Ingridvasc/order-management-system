import { Request } from 'express';
import { Types } from 'mongoose';  // Remove 'Document' daqui

export interface IUser {
  _id?: Types.ObjectId | string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IService {
  name: string;
  value: number;
  status: 'PENDING' | 'DONE';
}

export type OrderState = 'CREATED' | 'ANALYSIS' | 'COMPLETED';
export type OrderStatus = 'ACTIVE' | 'DELETED';

export interface IOrder {
  _id?: Types.ObjectId | string;
  lab: string;
  patient: string;
  customer: string;
  state: OrderState;
  status: OrderStatus;
  services: IService[];
  createdBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
  token?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  state?: OrderState;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}