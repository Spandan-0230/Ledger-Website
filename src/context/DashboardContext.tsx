import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Category, InventoryItem, SaleRecord, Expense } from '../types';
import { generateDemoData } from '../demoData';

interface DashboardContextType {
  categories: Category[];
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  deleteItem: (id: string) => void;
  sales: SaleRecord[];
  recordSale: (itemId: string, quantity: number, sellPrice: number) => void;
  deleteSale: (id: string) => void;
  expenses: Expense[];
  addExpense: (description: string, amount: number) => void;
  deleteExpense: (id: string) => void;
  isDemoMode: boolean;
  demoTimeLeft: number | null;
  startDemo: () => void;
  exitDemo: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultCategories: Category[] = [];
const defaultItems: InventoryItem[] = [];
const defaultSales: SaleRecord[] = [];
const defaultExpenses: Expense[] = [];

export function DashboardProvider({ children }: { children: ReactNode }) {
  // Clear any legacy demo lockout if present
  if (typeof window !== 'undefined' && localStorage.getItem('demoLockoutUntil')) {
    localStorage.removeItem('demoLockoutUntil');
  }

  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('isDemoMode') === 'true');
  const [demoTimeLeft, setDemoTimeLeft] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>(() => {
    const isDemo = localStorage.getItem('isDemoMode') === 'true';
    const saved = localStorage.getItem(isDemo ? 'demo_categories' : 'categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [items, setItems] = useState<InventoryItem[]>(() => {
    const isDemo = localStorage.getItem('isDemoMode') === 'true';
    const saved = localStorage.getItem(isDemo ? 'demo_items' : 'items');
    return saved ? JSON.parse(saved) : defaultItems;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const isDemo = localStorage.getItem('isDemoMode') === 'true';
    const saved = localStorage.getItem(isDemo ? 'demo_expenses' : 'expenses');
    return saved ? JSON.parse(saved) : defaultExpenses;
  });

  useEffect(() => {
    const keyPrefix = isDemoMode ? 'demo_' : '';
    localStorage.setItem(keyPrefix + 'expenses', JSON.stringify(expenses));
  }, [expenses, isDemoMode]);

  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const isDemo = localStorage.getItem('isDemoMode') === 'true';
    const saved = localStorage.getItem(isDemo ? 'demo_sales' : 'sales');
    return saved ? JSON.parse(saved) : defaultSales;
  });

  useEffect(() => {
    const keyPrefix = isDemoMode ? 'demo_' : '';
    localStorage.setItem(keyPrefix + 'categories', JSON.stringify(categories));
  }, [categories, isDemoMode]);

  useEffect(() => {
    const keyPrefix = isDemoMode ? 'demo_' : '';
    localStorage.setItem(keyPrefix + 'items', JSON.stringify(items));
  }, [items, isDemoMode]);

  useEffect(() => {
    const keyPrefix = isDemoMode ? 'demo_' : '';
    localStorage.setItem(keyPrefix + 'sales', JSON.stringify(sales));
  }, [sales, isDemoMode]);

  const startDemo = () => {
    const { categories: demoCats, items: demoItems, sales: demoSales, expenses: demoExpenses } = generateDemoData() as any;
    setCategories(demoCats);
    setItems(demoItems);
    setSales(demoSales);
    if (demoExpenses) setExpenses(demoExpenses); else setExpenses([]);
    setIsDemoMode(true);
    localStorage.setItem('isDemoMode', 'true');
    localStorage.setItem('demoStartTime', Date.now().toString());
  };

  const exitDemo = (redirect = false) => {
    setIsDemoMode(false);
    localStorage.removeItem('isDemoMode');
    localStorage.removeItem('demoStartTime');
    localStorage.removeItem('demoLockoutUntil');
    
    // Restore normal data
    const savedCats = localStorage.getItem('categories');
    setCategories(savedCats ? JSON.parse(savedCats) : defaultCategories);
    
    const savedItems = localStorage.getItem('items');
    setItems(savedItems ? JSON.parse(savedItems) : defaultItems);
    
    const savedSales = localStorage.getItem('sales');
    setSales(savedSales ? JSON.parse(savedSales) : defaultSales);
    const savedExpenses = localStorage.getItem('expenses');
    setExpenses(savedExpenses ? JSON.parse(savedExpenses) : defaultExpenses);

    if (redirect) {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    if (!isDemoMode) {
      setDemoTimeLeft(null);
      return;
    }

    const checkDemoTime = () => {
      const demoStartStr = localStorage.getItem('demoStartTime');
      if (!demoStartStr) return;
      
      const demoStart = parseInt(demoStartStr, 10);
      const elapsed = Date.now() - demoStart;
      const timeLeft = 60 * 60 * 1000 - elapsed;
      
      if (timeLeft <= 0) {
        exitDemo(true);
      } else {
        setDemoTimeLeft(timeLeft);
      }
    };

    checkDemoTime();
    const interval = setInterval(checkDemoTime, 1000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  const addCategory = (name: string, color: string) => {
    setCategories([...categories, { id: crypto.randomUUID(), name, color }]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    // Also remove or re-categorize items? For simplicity, we just delete the category.
    // Real app would handle orphaned items.
  };

  const addItem = (item: InventoryItem) => {
    setItems([...items, item]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const recordSale = (itemId: string, quantity: number, sellPrice: number) => {
    let itemName = 'Unknown Item';
    let itemCost = 0;
    
    setItems(items.map(item => {
      if (item.id === itemId) {
        itemName = item.name;
        itemCost = item.price;
        return { ...item, stock: Math.max(0, item.stock - quantity) };
      }
      return item;
    }));
    
    setSales([...sales, {
      id: crypto.randomUUID(),
      itemId,
      itemName,
      itemCost,
      quantity,
      sellPrice,
      date: new Date().toISOString()
    }]);
  };

  const deleteSale = (id: string) => {
    const saleToDelete = sales.find(s => s.id === id);
    if (!saleToDelete) return;
    
    // Revert stock
    setItems(items.map(item => {
      if (item.id === saleToDelete.itemId) {
        return { ...item, stock: item.stock + saleToDelete.quantity };
      }
      return item;
    }));

    // Remove log
    setSales(sales.filter(s => s.id !== id));
  };


  const autoCategorize = (desc: string): string => {
    const d = desc.toLowerCase();
    if (d.includes('uber') || d.includes('taxi') || d.includes('gas') || d.includes('transport') || d.includes('bus') || d.includes('flight') || d.includes('train')) return 'Transport';
    if (d.includes('food') || d.includes('restaurant') || d.includes('coffee') || d.includes('snack') || d.includes('dinner') || d.includes('lunch') || d.includes('grocery') || d.includes('groceries')) return 'Food';
    if (d.includes('movie') || d.includes('game') || d.includes('entertainment') || d.includes('concert') || d.includes('netflix') || d.includes('spotify') || d.includes('music')) return 'Entertainment';
    if (d.includes('utility') || d.includes('electric') || d.includes('water') || d.includes('internet') || d.includes('phone') || d.includes('bill') || d.includes('wifi')) return 'Utilities';
    if (d.includes('rent') || d.includes('lease') || d.includes('mortgage')) return 'Housing';
    if (d.includes('software') || d.includes('subscription') || d.includes('aws') || d.includes('hosting') || d.includes('domain')) return 'Software';
    if (d.includes('office') || d.includes('supply') || d.includes('supplies') || d.includes('paper') || d.includes('ink')) return 'Office Supplies';
    return 'Other';
  };

  const addExpense = (description: string, amount: number) => {
    setExpenses([...expenses, {
      id: crypto.randomUUID(),
      description,
      amount,
      category: autoCategorize(description),
      date: new Date().toISOString()
    }]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <DashboardContext.Provider value={{
       expenses, addExpense, deleteExpense, 
      categories, addCategory, deleteCategory, 
      items, addItem, deleteItem, 
      sales, recordSale, deleteSale,
      isDemoMode, demoTimeLeft, startDemo, exitDemo 
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
