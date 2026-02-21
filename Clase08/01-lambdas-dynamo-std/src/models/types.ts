export const PREFIXES = {
  CUSTOMER: "CUSTOMER",
  ORDER: "ORDER",
  PRODUCT: "PRODUCT",
  METADATA: "METADATA",
};

export const Keys = {
  customer: (customerId: string) => ({
    PK: `${PREFIXES.CUSTOMER}#${customerId}`,
    SK: PREFIXES.METADATA,
  }),
  order: (customerId: string, orderId: string) => ({
    PK: `${PREFIXES.CUSTOMER}#${customerId}`,
    SK: `${PREFIXES.ORDER}#${orderId}`,
  }),
  orderItem: (orderId: string, productId: string) => ({
    PK: `${PREFIXES.ORDER}#${orderId}`,
    SK: `${PREFIXES.PRODUCT}#${productId}`,
  }),
  itemsByOrder: (orderId: string) => ({
    PK: `${PREFIXES.ORDER}#${orderId}`,
    SK_PREFIX: `${PREFIXES.PRODUCT}#`,
  }),
  ordersByCustomer: (customerId: string) => ({
    PK: `${PREFIXES.CUSTOMER}#${customerId}`,
    SK_PREFIX: `${PREFIXES.ORDER}#`,
  }),
};

export type Customer = {
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export type CustomerRecord = {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  entityType: "CUSTOMER";
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export type Order = {
  orderId: string;
  customerId: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  createdAt: string;
};

export type OrderItem = {
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderRecord = {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  entityType: "ORDER";
  orderId: string;
  customerId: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  createdAt: string;
};

export type OrderItemRecord = {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  entityType: "ORDER_ITEM";
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};
