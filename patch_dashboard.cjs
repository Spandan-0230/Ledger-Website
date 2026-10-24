const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "CheckCircle2 } from 'lucide-react';",
  "CheckCircle2, CreditCard } from 'lucide-react';"
);

code = code.replace(
  "const { items, categories, addCategory, deleteCategory, addItem, deleteItem, sales, recordSale, deleteSale, isDemoMode, demoTimeLeft, exitDemo } = useDashboard();",
  "const { items, categories, addCategory, deleteCategory, addItem, deleteItem, sales, recordSale, deleteSale, isDemoMode, demoTimeLeft, exitDemo, expenses, addExpense, deleteExpense } = useDashboard();"
);

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'categories' | 'sales'>('overview');",
  "const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'categories' | 'sales' | 'expenses'>('overview');"
);

code = code.replace(
  "{ id: 'sales', label: 'Sales & Profit', icon: IndianRupee }",
  "{ id: 'sales', label: 'Sales & Profit', icon: IndianRupee },\n              { id: 'expenses', label: 'Expenses', icon: CreditCard }"
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
