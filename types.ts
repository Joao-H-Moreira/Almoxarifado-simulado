export interface User {
  id: number;
  name: string;
  username: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  size: string;
  weight: number; // in kg
  material: string;
  quantity: number;
  minStock: number;
}

export enum MovementType {
  IN = "Entrada",
  OUT = "Saída",
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  date: string; // ISO 8601 format
}

export type Page = "products" | "stock" | "history";
