const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const expenseStates = `
  // Expense States
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpenseDesc && newExpenseAmount) {
      addExpense(newExpenseDesc, parseFloat(newExpenseAmount));
      setNewExpenseDesc('');
      setNewExpenseAmount('');
      showToast("Expense categorized and added!");
    }
  };

  const expenseData = useMemo(() => {
    if (!expenses) return [];
    const map = new Map<string, number>();
    expenses.forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount);
    });
    const colors: Record<string, string> = {
      'Food': '#ffb689',
      'Transport': '#50d8e9',
      'Entertainment': '#b4a5ff',
      'Utilities': '#E5FD17',
      'Housing': '#ffb4ab',
      'Software': '#5E6BFF',
      'Office Supplies': '#ffffff',
      'Other': '#888888'
    };
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      fill: colors[name] || '#888888'
    }));
  }, [expenses]);
`;

code = code.replace(
  "const [salesTimeRange, setSalesTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');",
  "const [salesTimeRange, setSalesTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');\n" + expenseStates
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
