const fs = require('fs');
let code = fs.readFileSync('src/context/DashboardContext.tsx', 'utf8');

code = code.replace(
  "import { Category, InventoryItem, SaleRecord } from '../types';",
  "import { Category, InventoryItem, SaleRecord, Expense } from '../types';"
);

code = code.replace(
  "  isDemoMode: boolean;",
  `  expenses: Expense[];
  addExpense: (description: string, amount: number) => void;
  deleteExpense: (id: string) => void;
  isDemoMode: boolean;`
);

code = code.replace(
  "const defaultSales: SaleRecord[] = [];",
  `const defaultSales: SaleRecord[] = [];\nconst defaultExpenses: Expense[] = [];`
);

code = code.replace(
  "const [sales, setSales] = useState<SaleRecord[]>(() => {",
  `const [expenses, setExpenses] = useState<Expense[]>(() => {
    const isDemo = localStorage.getItem('isDemoMode') === 'true';
    const saved = localStorage.getItem(isDemo ? 'demo_expenses' : 'expenses');
    return saved ? JSON.parse(saved) : defaultExpenses;
  });

  useEffect(() => {
    const keyPrefix = isDemoMode ? 'demo_' : '';
    localStorage.setItem(keyPrefix + 'expenses', JSON.stringify(expenses));
  }, [expenses, isDemoMode]);

  const [sales, setSales] = useState<SaleRecord[]>(() => {`
);

code = code.replace(
  "const { categories: demoCats, items: demoItems, sales: demoSales } = generateDemoData();",
  `const { categories: demoCats, items: demoItems, sales: demoSales, expenses: demoExpenses } = generateDemoData() as any;`
);

code = code.replace(
  "setSales(demoSales);",
  `setSales(demoSales);\n    if (demoExpenses) setExpenses(demoExpenses); else setExpenses([]);`
);

code = code.replace(
  "const savedSales = localStorage.getItem('sales');\n    setSales(savedSales ? JSON.parse(savedSales) : defaultSales);",
  `const savedSales = localStorage.getItem('sales');\n    setSales(savedSales ? JSON.parse(savedSales) : defaultSales);\n    const savedExpenses = localStorage.getItem('expenses');\n    setExpenses(savedExpenses ? JSON.parse(savedExpenses) : defaultExpenses);`
);

const autoCategorizeCode = `
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
`;

code = code.replace(
  "  return (\n    <DashboardContext.Provider value={{",
  autoCategorizeCode + "\n  return (\n    <DashboardContext.Provider value={{\n       expenses, addExpense, deleteExpense,"
);

fs.writeFileSync('src/context/DashboardContext.tsx', code);
