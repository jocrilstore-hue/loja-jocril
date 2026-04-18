// Shared domain types inferred from the Claude Design prototype mock data.
// These are visual-port placeholders; expect them to evolve when Supabase wiring happens.

export type ProductStatus = "ativo" | "rascunho" | "arquivado";
export type StockStatus =
  | "em-stock"
  | "ultimas-unidades"
  | "producao-por-encomenda"
  | "esgotado";

export type Product = {
  id: string;
  sku: string;
  slug: string;
  nome: string;
  categoria: string;
  material?: string;
  preco: number;
  precoAntigo?: number;
  stock: StockStatus;
  status: ProductStatus;
  destaque?: boolean;
  imagens: string[];
  variantesCount?: number;
};

export type Variant = {
  id: string;
  productId: string;
  sku: string;
  formato: string;
  dimensoes?: string;
  cor?: string;
  preco: number;
  stock: number;
};

export type Tier = {
  id: string;
  nome: string;
  minQty: number;
  descontoPct: number;
};

export type OrderStatus =
  | "nova"
  | "aceite"
  | "producao"
  | "enviada"
  | "entregue"
  | "cancelada";

export type OrderItem = {
  productId: string;
  nome: string;
  sku: string;
  qty: number;
  precoUnit: number;
};

export type Order = {
  id: string;
  numero: string;
  data: string;
  cliente: string;
  email: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
};

export type CustomerType = "particular" | "empresa";

export type Customer = {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  nif?: string;
  tipo: CustomerType;
  tier?: string;
  totalGasto: number;
  encomendas: number;
  desde: string;
};

export type CartItem = {
  productId: string;
  variantId?: string;
  nome: string;
  sku: string;
  qty: number;
  precoUnit: number;
  imagem?: string;
};
