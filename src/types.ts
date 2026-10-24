export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  categoryId: string;
  dateProduced: string;
  expiryDate: string;
  price: number;
  stock: number;
}

export interface SaleRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemCost: number;
  quantity: number;
  sellPrice: number;
  date: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

