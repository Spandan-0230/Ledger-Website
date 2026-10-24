const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Add icons to imports if they don't exist
if (!code.includes('Target')) {
  code = code.replace("CreditCard } from 'lucide-react';", "CreditCard, Target, PieChart } from 'lucide-react';");
}

// 2. Expand activeTab type
code = code.replace(
  "useState<'overview' | 'inventory' | 'categories' | 'sales' | 'expenses'>('overview')",
  "useState<'overview' | 'inventory' | 'categories' | 'sales' | 'expenses' | 'budgets' | 'reports'>('overview')"
);

// 3. Add to the tabs mapping array
code = code.replace(
  "{ id: 'expenses', label: 'Expenses', icon: CreditCard }",
  "{ id: 'expenses', label: 'Expenses', icon: CreditCard },\n              { id: 'budgets', label: 'Budgets', icon: Target },\n              { id: 'reports', label: 'Reports', icon: PieChart }"
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
