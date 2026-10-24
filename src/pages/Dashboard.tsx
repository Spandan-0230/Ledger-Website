import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { TiltCard } from '../components/TiltCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, Package, Layers, IndianRupee, Activity, Download, AlertTriangle, RefreshCw, ChevronDown, Clock, LogOut, Calendar, X, Check, FileSpreadsheet, CheckCircle2, CreditCard } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { items, categories, addCategory, deleteCategory, addItem, deleteItem, sales, recordSale, deleteSale, isDemoMode, demoTimeLeft, exitDemo, expenses, addExpense, deleteExpense } = useDashboard();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'categories' | 'sales' | 'expenses'>('overview');

  // Scroll animations
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const pieRotation = useTransform(scrollY, [0, 800], [0, 360]);
  const pieChartRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(pieRotation, "change", (latest) => {
    if (pieChartRef.current) {
      const svg = pieChartRef.current.querySelector('svg');
      if (svg) {
        svg.style.transform = `rotate(${latest}deg)`;
        svg.style.transformOrigin = '50% 50%';
        svg.style.transition = 'transform 0.1s ease-out';
      }
    }
  });

  // Chart interactivity states
  type KPIType = 'value' | 'units' | 'low_stock' | 'expiring';
  type TimeRange = 'weekly' | 'monthly' | 'yearly';
  const [selectedKpi, setSelectedKpi] = useState<KPIType>('value');
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [trendChartType, setTrendChartType] = useState<'line' | 'bar'>('line');

  // Currency logic
  const [rates, setRates] = useState<Record<string, number>>({});
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  
  useEffect(() => {
    // Fetch real-time exchange rates relative to INR
    fetch('https://open.er-api.com/v6/latest/INR')
      .then(res => res.json())
      .then(data => setRates(data.rates))
      .catch(console.error);
  }, []);

  // Form states
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#5E6BFF');

  const [newItemId, setNewItemId] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(categories[0]?.id || '');
  const [newItemDate, setNewItemDate] = useState('');
  const [newItemExpiry, setNewItemExpiry] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');

  // Sales Form States
  const [newSaleItemId, setNewSaleItemId] = useState('');
  const [newSaleQuantity, setNewSaleQuantity] = useState('');
  const [newSalePrice, setNewSalePrice] = useState('');

  // Filtering & Sorting
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterExpiring, setFilterExpiring] = useState(false);
  const [sortField, setSortField] = useState<'dateProduced' | 'expiryDate' | 'price' | 'stock'>('dateProduced');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sales Form & Chart States
  const [saleError, setSaleError] = useState('');
  const [salesChartType, setSalesChartType] = useState<'bar' | 'line'>('line');
  const [salesTimeRange, setSalesTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

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


  // Export Timeframe States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedReportTimeframe, setSelectedReportTimeframe] = useState<'weekly' | 'monthly' | 'annually' | 'all' | 'custom'>('monthly');
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  
  const showToast = (message: string) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(i => i.stock > 0);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
    }
    if (filterCategory) {
      result = result.filter(i => i.categoryId === filterCategory);
    }
    if (filterStartDate) {
      result = result.filter(i => i.dateProduced >= filterStartDate);
    }
    if (filterEndDate) {
      result = result.filter(i => i.dateProduced <= filterEndDate);
    }
    if (filterExpiring) {
      const thirtyDays = new Date();
      thirtyDays.setDate(thirtyDays.getDate() + 30);
      result = result.filter(i => new Date(i.expiryDate) <= thirtyDays);
    }
    
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [items, searchQuery, filterCategory, filterStartDate, filterEndDate, filterExpiring, sortField, sortOrder]);

  // Derived stats
  const totalValue = useMemo(() => filteredAndSortedItems.reduce((acc, item) => acc + (item.price * item.stock), 0), [filteredAndSortedItems]);
  const totalItems = useMemo(() => filteredAndSortedItems.reduce((acc, item) => acc + item.stock, 0), [filteredAndSortedItems]);
  const lowStockCount = useMemo(() => filteredAndSortedItems.filter(i => i.stock < 500).length, [filteredAndSortedItems]);
  const thirtyDaysFromNow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  }, []);
  const expiringSoonCount = useMemo(() => filteredAndSortedItems.filter(i => new Date(i.expiryDate) <= thirtyDaysFromNow).length, [filteredAndSortedItems, thirtyDaysFromNow]);

  const topCategoryName = useMemo(() => {
    if (categories.length === 0 || filteredAndSortedItems.length === 0) return 'None';
    const catValues = categories.map(cat => {
      const catItems = filteredAndSortedItems.filter(i => i.categoryId === cat.id);
      return { name: cat.name, value: catItems.reduce((acc, item) => acc + (item.price * item.stock), 0) };
    });
    const max = catValues.reduce((prev, current) => (prev.value > current.value) ? prev : current);
    return max.value > 0 ? max.name : 'None';
  }, [filteredAndSortedItems, categories]);

  const spendingThisMonth = useMemo(() => totalValue * 0.28, [totalValue]); // Simulated metric

  // Sync sale item selection
  useEffect(() => {
    if (newSaleItemId && !filteredAndSortedItems.find(i => i.id === newSaleItemId)) {
      setNewSaleItemId('');
    }
  }, [filteredAndSortedItems, newSaleItemId]);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const originalItem = items.find(i => i.id === sale.itemId);
      const itemName = sale.itemName || originalItem?.name || 'Unknown Item';
      
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!itemName.toLowerCase().includes(q) && !sale.itemId.toLowerCase().includes(q)) return false;
      }
      if (filterCategory) {
        if (!originalItem || originalItem.categoryId !== filterCategory) return false;
      }
      if (filterStartDate && sale.date < filterStartDate) return false;
      if (filterEndDate && sale.date > filterEndDate) return false;
      return true;
    });
  }, [sales, items, searchQuery, filterCategory, filterStartDate, filterEndDate]);

  const salesStats = useMemo(() => {
    let revenue = 0;
    let cost = 0;
    let salesLoss = 0;
    filteredSales.forEach(sale => {
      const saleRevenue = sale.sellPrice * sale.quantity;
      revenue += saleRevenue;
      const originalItem = items.find(i => i.id === sale.itemId);
      const unitCost = sale.itemCost || originalItem?.price || 0;
      
      const saleCost = unitCost * sale.quantity;
      cost += saleCost;
      if (saleCost > saleRevenue) {
        salesLoss += (saleCost - saleRevenue);
      }
    });
    return { revenue, cost, profit: revenue - cost, salesLoss };
  }, [filteredSales, items]);

  const expiredLoss = useMemo(() => {
    const now = new Date();
    return items
      .filter(i => new Date(i.expiryDate) < now)
      .reduce((acc, i) => acc + (i.price * i.stock), 0);
  }, [items]);

  const totalLoss = useMemo(() => salesStats.salesLoss + expiredLoss, [salesStats.salesLoss, expiredLoss]);

  const salesData = useMemo(() => {
    const dataByDate: Record<string, { revenue: number, cost: number }> = {};
    
    filteredSales.forEach(sale => {
      const date = new Date(sale.date);
      if (isNaN(date.getTime())) return;
      
      let key = '';
      if (salesTimeRange === 'weekly') {
        key = date.toLocaleDateString(undefined, { weekday: 'short' });
      } else if (salesTimeRange === 'monthly') {
        key = date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      } else {
        key = date.getFullYear().toString();
      }

      if (!dataByDate[key]) dataByDate[key] = { revenue: 0, cost: 0 };
      
      const originalItem = items.find(it => it.id === sale.itemId);
      const unitCost = sale.itemCost || originalItem?.price || 0;
      const cogs = unitCost * sale.quantity;
      const rev = sale.sellPrice * sale.quantity;
      
      dataByDate[key].revenue += rev;
      dataByDate[key].cost += cogs;
    });

    const result = Object.keys(dataByDate).map(key => {
      const { revenue, cost } = dataByDate[key];
      const profit = revenue - cost;
      return {
        name: key,
        revenue,
        profit: profit > 0 ? profit : 0,
        loss: profit < 0 ? Math.abs(profit) : 0
      };
    });

    if (result.length === 0) {
      return [{ name: 'N/A', revenue: 0, profit: 0, loss: 0 }];
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredSales, items, salesTimeRange]);

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    setSaleError('');
    if (newSaleItemId && newSaleQuantity && newSalePrice) {
      const qty = parseInt(newSaleQuantity, 10);
      const item = items.find(i => i.id === newSaleItemId);
      
      if (item) {
        // Check if item is expired
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryDate = new Date(item.expiryDate);
        if (expiryDate < today) {
          setSaleError(`Error: Item is expired (Expired on ${item.expiryDate}). Cannot be sold.`);
          return;
        }

        if (qty > item.stock) {
          setSaleError(`Not enough stock. Only ${item.stock} available.`);
          return;
        }
      }

      const inputPrice = parseFloat(newSalePrice);
      const conversionRate = rates[selectedCurrency] || 1; 
      const priceInINR = inputPrice / conversionRate;

      recordSale(newSaleItemId, qty, priceInINR);
      
      setNewSaleItemId('');
      setNewSaleQuantity('');
      setNewSalePrice('');
    }
  };

  // Chart data
  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const catItems = filteredAndSortedItems.filter(i => i.categoryId === cat.id);
      let value = 0;
      if (selectedKpi === 'value') value = catItems.reduce((acc, item) => acc + (item.price * item.stock), 0);
      else if (selectedKpi === 'units') value = catItems.reduce((acc, item) => acc + item.stock, 0);
      else if (selectedKpi === 'low_stock') value = catItems.filter(i => i.stock < 500).length;
      else if (selectedKpi === 'expiring') value = catItems.filter(i => new Date(i.expiryDate) <= thirtyDaysFromNow).length;
      return { id: cat.id, name: cat.name, value, fill: cat.color };
    }).filter(d => d.value > 0);
  }, [items, categories, selectedKpi, thirtyDaysFromNow]);

  const trendData = useMemo(() => {
    // Generate real time-series data based on dateProduced
    const dataByDate: Record<string, number> = {};

    filteredAndSortedItems.forEach(item => {
      const date = new Date(item.dateProduced);
      if (isNaN(date.getTime())) return;
      
      let key = '';
      if (timeRange === 'weekly') {
        // Group by day of week (0-6) for the last 7 days? Or just show raw dates.
        key = date.toLocaleDateString(undefined, { weekday: 'short' });
      } else if (timeRange === 'monthly') {
        key = date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      } else {
        key = date.getFullYear().toString();
      }

      let value = 0;
      if (selectedKpi === 'value') value = item.price * item.stock;
      else if (selectedKpi === 'units') value = item.stock;
      else if (selectedKpi === 'low_stock') value = item.stock < 500 ? 1 : 0;
      else if (selectedKpi === 'expiring') value = new Date(item.expiryDate) <= thirtyDaysFromNow ? 1 : 0;

      if (!dataByDate[key]) dataByDate[key] = 0;
      dataByDate[key] += value;
    });

    const result = Object.keys(dataByDate).map(key => ({
      name: key,
      value: dataByDate[key]
    }));

    // If completely empty, just return a flatline so the chart doesn't crash
    if (result.length === 0) {
       return [{ name: 'N/A', value: 0 }];
    }

    return result.sort((a, b) => {
      // Very basic sort, for a real app we'd want chronological sorting, but alphabetical or relying on map insertion is okay for a simple grouping
      return a.name.localeCompare(b.name);
    });
  }, [filteredAndSortedItems, selectedKpi, timeRange, thirtyDaysFromNow]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName) {
      addCategory(newCatName, newCatColor);
      setNewCatName('');
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName && newItemCategory && newItemDate && newItemExpiry && newItemPrice && newItemStock) {
      // Convert to INR based on selected currency
      const inputPrice = parseFloat(newItemPrice);
      const conversionRate = rates[selectedCurrency] || 1; 
      const priceInINR = inputPrice / conversionRate;

      let idToUse = newItemId.trim();
      if (!idToUse) {
        const cat = categories.find(c => c.id === newItemCategory);
        const prefix = cat ? cat.name.substring(0, 3).toUpperCase() : 'ITM';
        let randomNum;
        do {
          randomNum = Math.floor(1000 + Math.random() * 9000);
          idToUse = `${prefix}-${randomNum}`;
        } while (items.some(i => i.id === idToUse));
      } else if (items.some(i => i.id === idToUse)) {
        showToast('Error: Item ID already exists.');
        return;
      }

      addItem({
        id: idToUse,
        name: newItemName,
        categoryId: newItemCategory,
        dateProduced: newItemDate,
        expiryDate: newItemExpiry,
        price: priceInINR,
        stock: parseInt(newItemStock, 10)
      });
      setNewItemId('');
      setNewItemName('');
      setNewItemPrice('');
      setNewItemStock('');
      setNewItemDate('');
      setNewItemExpiry('');
    }
  };

  const exportCSV = (timeframe: 'weekly' | 'monthly' | 'annually' | 'all' | 'custom' = selectedReportTimeframe) => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    let periodLabel = 'ALL TIME';
    let dateRangeStr = 'Full Lifecycle Database';

    if (timeframe === 'weekly') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      periodLabel = 'WEEKLY (LAST 7 DAYS)';
      dateRangeStr = `${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`;
    } else if (timeframe === 'monthly') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      periodLabel = 'MONTHLY (LAST 30 DAYS)';
      dateRangeStr = `${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`;
    } else if (timeframe === 'annually') {
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      periodLabel = 'ANNUALLY (LAST 365 DAYS / 1 YEAR)';
      dateRangeStr = `${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`;
    } else if (timeframe === 'custom' && exportStartDate && exportEndDate) {
      startDate = new Date(exportStartDate);
      endDate = new Date(exportEndDate);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = 'CUSTOM DATE RANGE';
      dateRangeStr = `${exportStartDate} to ${exportEndDate}`;
    } else if (timeframe === 'custom') {
      alert("Please select both start and end dates for custom export.");
      return;
    } else {
      periodLabel = 'ALL TIME (COMPLETE HISTORICAL RECORD)';
      dateRangeStr = 'All Recorded Historical Entries';
    }

    const targetSales = sales.filter(s => {
      const t = new Date(s.date).getTime();
      if (startDate && t < startDate.getTime()) return false;
      if (endDate && t > endDate.getTime()) return false;
      return true;
    });

    // Period financial calculations
    let periodRevenue = 0;
    let periodCost = 0;
    let periodSalesLoss = 0;

    targetSales.forEach(sale => {
      const originalItem = items.find(i => i.id === sale.itemId);
      const unitCost = sale.itemCost || originalItem?.price || 0;
      const cogs = unitCost * sale.quantity;
      const rev = sale.sellPrice * sale.quantity;
      periodRevenue += rev;
      periodCost += cogs;
      if (cogs > rev) {
        periodSalesLoss += (cogs - rev);
      }
    });

    const periodProfit = periodRevenue - periodCost;

    // Expired goods loss within timeframe
    const expiredItemsInPeriod = items.filter(i => {
      const exp = new Date(i.expiryDate);
      if (exp > now) return false;
      const t = exp.getTime();
      if (startDate && t < startDate.getTime()) return false;
      if (endDate && t > endDate.getTime()) return false;
      return true;
    });
    const periodExpiredLoss = expiredItemsInPeriod.reduce((acc, i) => acc + (i.price * i.stock), 0);
    const periodTotalLoss = periodSalesLoss + periodExpiredLoss;

    const csvRows = [];
    
    // --- SECTION 1: Report Metadata ---
    csvRows.push(['=== LEDGER FINANCIAL REPORT ===']);
    csvRows.push(['Report Scope', periodLabel]);
    csvRows.push(['Reporting Period', dateRangeStr]);
    csvRows.push(['Generated On', new Date().toLocaleString()]);
    csvRows.push(['Total Transactions Included', targetSales.length]);
    csvRows.push([]);

    // --- SECTION 2: Executive Summary ---
    csvRows.push(['=== EXECUTIVE SUMMARY ===']);
    csvRows.push(['Total Active Inventory Value', totalValue.toFixed(2)]);
    csvRows.push(['Period Sales Revenue', periodRevenue.toFixed(2)]);
    csvRows.push(['Period COGS (Cost of Goods Sold)', periodCost.toFixed(2)]);
    csvRows.push(['Period Net Profit', periodProfit.toFixed(2)]);
    csvRows.push(['Period Sales Loss (Discounts/Under-Cost)', periodSalesLoss.toFixed(2)]);
    csvRows.push(['Period Expired Goods Loss', periodExpiredLoss.toFixed(2)]);
    csvRows.push(['Total Period System Loss', periodTotalLoss.toFixed(2)]);
    csvRows.push([]);

    // --- SECTION 3: Category Breakdown in Period ---
    csvRows.push(['=== CATEGORY BREAKDOWN (' + periodLabel + ') ===']);
    csvRows.push(['Category', 'Active Items', 'Current Stock Value', 'Period Sales Revenue', 'Period Estimated Profit']);
    categories.forEach(c => {
      const catItems = items.filter(i => i.categoryId === c.id);
      const stockVal = catItems.reduce((acc, i) => acc + (i.price * i.stock), 0);
      let catRevenue = 0;
      let catCost = 0;
      targetSales.forEach(s => {
        const item = items.find(i => i.id === s.itemId);
        if (item && item.categoryId === c.id) {
          catRevenue += s.sellPrice * s.quantity;
          catCost += (s.itemCost || item.price) * s.quantity;
        }
      });
      csvRows.push([
        c.name,
        catItems.length,
        stockVal.toFixed(2),
        catRevenue.toFixed(2),
        (catRevenue - catCost).toFixed(2)
      ]);
    });
    csvRows.push([]);

    // --- SECTION 4: Active Inventory Ledger ---
    csvRows.push(['=== ACTIVE INVENTORY LEDGER ===']);
    const invHeaders = ['ID', 'Name', 'Category', 'Date Produced', 'Expiry Date', 'Unit Price', 'Current Stock', 'Total Value'];
    csvRows.push(invHeaders);
    filteredAndSortedItems.forEach(item => {
      const cat = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';
      const val = item.price * item.stock;
      csvRows.push([
        item.id,
        item.name.replace(/,/g, ' '),
        cat.replace(/,/g, ' '),
        item.dateProduced,
        item.expiryDate,
        item.price.toFixed(2),
        item.stock,
        val.toFixed(2)
      ]);
    });
    csvRows.push([]);

    // --- SECTION 5: Transactions in Period ---
    csvRows.push(['=== TRANSACTION LOGS (' + periodLabel + ') ===']);
    const salesHeaders = ['Date', 'Item Name', 'Quantity', 'Unit Cost', 'Sell Price', 'Total Revenue', 'Profit/Loss', 'Profit Margin %'];
    csvRows.push(salesHeaders);
    targetSales.forEach(sale => {
      const originalItem = items.find(i => i.id === sale.itemId);
      const itemName = sale.itemName || originalItem?.name || 'Unknown Item';
      const unitCost = sale.itemCost || originalItem?.price || 0;
      const cogs = unitCost * sale.quantity;
      const rev = sale.sellPrice * sale.quantity;
      const profit = rev - cogs;
      const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) + '%' : '0%';
      csvRows.push([
        new Date(sale.date).toLocaleString().replace(/,/g, ''),
        itemName.replace(/,/g, ' '),
        sale.quantity,
        unitCost.toFixed(2),
        sale.sellPrice.toFixed(2),
        rev.toFixed(2),
        profit.toFixed(2),
        margin
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ledger_report_${timeframe}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setIsExportModalOpen(false);
    showToast("CSV report generated and saved successfully.");
  };

  const formatDemoTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      ref={scrollRef}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="h-screen overflow-y-auto overflow-x-hidden bg-custom-bg flex flex-col relative"
    >
      {isDemoMode && (
        <div className="bg-primary text-black px-4 py-2 flex items-center justify-center gap-4 sticky top-0 z-[60] font-mono-data text-xs shadow-lg">
          <div className="flex items-center gap-2 font-bold tracking-widest uppercase">
            <AlertTriangle className="w-4 h-4" />
            Temporary Demo Mode
          </div>
          <div className="hidden sm:block opacity-60">|</div>
          <div className="hidden sm:flex items-center gap-2">
            Data is strictly isolated and will auto-destruct in: 
          </div>
          <div className="flex items-center gap-1.5 bg-black/10 px-2 py-0.5 rounded font-bold">
            <Clock className="w-3.5 h-3.5" />
            {demoTimeLeft !== null ? formatDemoTime(demoTimeLeft) : '00:00'}
          </div>
          <button onClick={() => exitDemo(true)} className="ml-auto flex items-center gap-1 hover:bg-black/10 px-3 py-1 rounded transition-colors uppercase tracking-widest font-bold">
            <LogOut className="w-3.5 h-3.5" />
            End Demo
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <header className={`h-[72px] border-b border-custom-divider bg-[#070708] flex items-center px-8 justify-between sticky ${isDemoMode ? 'top-[36px]' : 'top-0'} z-50`}>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-sm cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-full border border-custom-text-muted flex items-center justify-center text-on-surface font-h3 font-bold hover:bg-white/[0.05] transition-colors">L</div>
            <span className="font-h4 font-bold tracking-tight text-on-surface hidden sm:block">Command Center</span>
          </div>
          
          <nav className="flex gap-2 bg-[#101112] p-1 rounded-lg border border-white/[0.05] shadow-inner relative">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'inventory', label: 'Inventory Log', icon: Package },
              { id: 'categories', label: 'Categories', icon: Layers },
              { id: 'sales', label: 'Sales & Profit', icon: IndianRupee },
              { id: 'expenses', label: 'Expenses', icon: CreditCard }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-body-md transition-all z-10 ${
                    isActive 
                      ? 'text-white shadow-sm' 
                      : 'text-custom-text-muted hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-[#232426] rounded-md -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsExportModalOpen(true)} 
            className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-4 py-1.5 rounded-full transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <div className="text-right hidden md:block border-l border-custom-divider pl-4">
            <div className="text-[10px] font-mono-data text-secondary uppercase tracking-widest flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin-slow" /> System Status</div>
            <div className="text-[10px] font-mono-data text-on-surface">ONLINE // SYNCED</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(80,216,233,0.5)]"></div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Quick Stats Summary Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <TiltCard className="bg-[#101112] border border-white/[0.03] rounded-lg p-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-1">Total Spending (This Month)</div>
                    <div className="text-xl font-mono-data text-on-surface">₹{spendingThisMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-primary" />
                  </div>
                </TiltCard>
                <TiltCard className="bg-[#101112] border border-white/[0.03] rounded-lg p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => setActiveTab('categories')}>
                  <div>
                    <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-1">Active Categories</div>
                    <div className="text-xl font-mono-data text-on-surface">{categories.length} Registered</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-secondary" />
                  </div>
                </TiltCard>
                <TiltCard className="bg-[#101112] border border-white/[0.03] rounded-lg p-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-1">Pending Expiries</div>
                    <div className="text-xl font-mono-data text-on-surface">{expiringSoonCount}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-tertiary-fixed-dim" />
                  </div>
                </TiltCard>
              </div>

              {/* KPI Cards (Interactive) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <TiltCard layout onClick={() => setSelectedKpi('value')} className={`bg-[#0a0a0b] border rounded-xl p-6 relative overflow-hidden group transition-colors shadow-lg cursor-pointer ${selectedKpi === 'value' ? 'border-primary ring-1 ring-primary/50' : 'border-white/[0.05] hover:border-white/[0.1]'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><IndianRupee className="w-16 h-16"/></div>
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-2">Total Value</div>
                  <div className="text-3xl font-mono-data text-on-surface">₹{totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </TiltCard>
                <TiltCard layout onClick={() => setSelectedKpi('units')} className={`bg-[#0a0a0b] border rounded-xl p-6 relative overflow-hidden group transition-colors shadow-lg cursor-pointer ${selectedKpi === 'units' ? 'border-primary ring-1 ring-primary/50' : 'border-white/[0.05] hover:border-white/[0.1]'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Package className="w-16 h-16"/></div>
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-2">Total Units in Stock</div>
                  <div className="text-3xl font-mono-data text-on-surface">{totalItems.toLocaleString()}</div>
                  <div className="text-[10px] font-mono-data text-primary mt-4">ACROSS {categories.length} CATEGORIES</div>
                </TiltCard>
                <TiltCard layout onClick={() => setSelectedKpi('low_stock')} className={`bg-[#0a0a0b] border rounded-xl p-6 relative overflow-hidden group transition-colors shadow-lg cursor-pointer ${selectedKpi === 'low_stock' ? 'border-[#ffb4ab] ring-1 ring-[#ffb4ab]/50' : 'border-white/[0.05] hover:border-white/[0.1]'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Activity className="w-16 h-16 text-[#ffb4ab]"/></div>
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-2">Low Stock Alerts</div>
                  <div className="text-3xl font-mono-data text-on-surface">{lowStockCount}</div>
                  <div className="text-[10px] font-mono-data text-[#ffb4ab] mt-4">REQUIRES ATTENTION</div>
                </TiltCard>
                <TiltCard layout onClick={() => setSelectedKpi('expiring')} className={`bg-[#0a0a0b] border rounded-xl p-6 relative overflow-hidden group transition-colors shadow-lg cursor-pointer ${selectedKpi === 'expiring' ? 'border-tertiary-fixed-dim ring-1 ring-tertiary-fixed-dim/50' : 'border-white/[0.05] hover:border-white/[0.1]'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><AlertTriangle className="w-16 h-16 text-tertiary-fixed-dim"/></div>
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-2">Expiring Soon (30d)</div>
                  <div className="text-3xl font-mono-data text-on-surface">{expiringSoonCount}</div>
                  <div className="text-[10px] font-mono-data text-tertiary-fixed-dim mt-4">CHECK EXPIRY DATES</div>
                </TiltCard>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div layout key={`${selectedKpi}-${timeRange}-${items.length}`} className="lg:col-span-2 bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 h-[400px] flex flex-col hover:border-white/[0.1] transition-colors shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">
                      {selectedKpi === 'value' ? 'Inventory Value Trend' :
                       selectedKpi === 'units' ? 'Stock Volume Trend' :
                       selectedKpi === 'low_stock' ? 'Low Stock Alerts Trend' :
                       'Expiring Soon Trend'}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex bg-[#101112] p-1 rounded-md border border-white/[0.05]">
                        <button onClick={() => setTrendChartType('line')} className={`px-2 py-1 text-[10px] font-mono-data uppercase transition-colors rounded ${trendChartType === 'line' ? 'bg-[#232426] text-white' : 'text-custom-text-muted hover:text-white'}`}>Line</button>
                        <button onClick={() => setTrendChartType('bar')} className={`px-2 py-1 text-[10px] font-mono-data uppercase transition-colors rounded ${trendChartType === 'bar' ? 'bg-[#232426] text-white' : 'text-custom-text-muted hover:text-white'}`}>Bar</button>
                      </div>
                      <div className="flex bg-[#101112] p-1 rounded-md border border-white/[0.05]">
                        {(['weekly', 'monthly', 'yearly'] as const).map(tr => (
                          <button
                            key={tr}
                            onClick={() => setTimeRange(tr)}
                            className={`px-3 py-1 text-[10px] font-mono-data uppercase transition-colors rounded ${timeRange === tr ? 'bg-[#232426] text-white' : 'text-custom-text-muted hover:text-white'}`}
                          >
                            {tr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {trendChartType === 'line' ? (
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#232426" vertical={false} />
                          <XAxis dataKey="name" stroke="#8f8fa1" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis 
                            stroke="#8f8fa1" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => selectedKpi === 'value' ? `₹${(value/1000).toFixed(1)}k` : value} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#101112', borderColor: '#232426', borderRadius: '8px' }}
                            itemStyle={{ color: '#e5e2e3', fontFamily: 'Inter', fontSize: '12px' }}
                            labelStyle={{ color: '#9A9DA3', fontFamily: 'Inter', fontSize: '10px', textTransform: 'uppercase' }}
                            formatter={(value: number) => [
                              selectedKpi === 'value' ? `₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : value.toLocaleString(),
                              selectedKpi === 'value' ? 'Value' : 'Count'
                            ]}
                          />
                          <Line type="monotone" dataKey="value" stroke="#50d8e9" strokeWidth={3} dot={{ r: 4, fill: '#101112', strokeWidth: 2 }} activeDot={{ r: 6 }} isAnimationActive={true} animationDuration={800} />
                        </LineChart>
                      ) : (
                        <BarChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#232426" vertical={false} />
                          <XAxis dataKey="name" stroke="#8f8fa1" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis 
                            stroke="#8f8fa1" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => selectedKpi === 'value' ? `₹${(value/1000).toFixed(1)}k` : value} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#101112', borderColor: '#232426', borderRadius: '8px', cursor: 'pointer' }}
                            itemStyle={{ color: '#e5e2e3', fontFamily: 'Inter', fontSize: '12px' }}
                            labelStyle={{ color: '#9A9DA3', fontFamily: 'Inter', fontSize: '10px', textTransform: 'uppercase' }}
                            formatter={(value: number) => [
                              selectedKpi === 'value' ? `₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : value.toLocaleString(),
                              selectedKpi === 'value' ? 'Value' : 'Count'
                            ]}
                            cursor={{ fill: '#ffffff0a' }}
                          />
                          <Bar dataKey="value" fill="#50d8e9" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div layout key={`cat-${categories.length}-${items.length}-${selectedKpi}`} className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 h-[400px] flex flex-col hover:border-white/[0.1] transition-colors shadow-lg">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-6 flex justify-between items-center"><span>
                    {selectedKpi === 'value' ? 'Budget Distribution' :
                     selectedKpi === 'units' ? 'Units by Category' :
                     selectedKpi === 'low_stock' ? 'Low Stock by Category' :
                     'Expiring by Category'}
                    </span><span className="text-[8px] text-primary/70">CLICK TO DRILL DOWN</span></div>
                  <div className="flex-1 w-full relative">
                    {categoryData.length > 0 ? (
                      <div ref={pieChartRef} className="w-full h-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              isAnimationActive={true}
                              animationDuration={800}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.fill} 
                                  stroke="rgba(255,255,255,0.05)"
                                  className="cursor-pointer hover:opacity-80 outline-none"
                                  onClick={() => {
                                    setFilterCategory(entry.id);
                                    setActiveTab('sales');
                                  }}
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#101112', borderColor: '#232426', borderRadius: '8px' }}
                              itemStyle={{ color: '#e5e2e3', fontFamily: 'Inter', fontSize: '12px' }}
                              formatter={(value: number, name: string) => [
                                selectedKpi === 'value' ? `₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : value.toLocaleString(),
                                name
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-custom-text-muted text-sm font-body-md">
                        No data available
                      </div>
                    )}
                  </div>
                  
                  {/* Legend underneath Pie chart */}
                  {categoryData.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3 justify-center">
                      {categoryData.map(cat => (
                        <div key={cat.name} className="flex items-center gap-1.5 text-[10px] font-mono-data text-custom-text-muted">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.fill }}></span>
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* TAB: INVENTORY */}
          {activeTab === 'inventory' && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              
              {/* Add Item Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Register New Asset</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono-data text-secondary">
                    <IndianRupee className="w-3 h-3" /> BASE CURRENCY: INR (₹)
                  </div>
                </div>
                <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
                  <div className="group">
                    <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Item ID (Opt)</label>
                    <input value={newItemId} onChange={e => setNewItemId(e.target.value)} type="text" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="Auto" />
                  </div>
                  <div className="md:col-span-2 group">
                    <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Item Name</label>
                    <input required value={newItemName} onChange={e => setNewItemName(e.target.value)} type="text" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="e.g. Copper Wire" />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Category</label>
                    <div className="relative">
                      <select required value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className="w-full bg-[#101112] hover:bg-[#151618] border border-white/[0.1] hover:border-white/[0.2] rounded py-2.5 pl-3 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none shadow-inner cursor-pointer">
                        <option value="" disabled className="bg-[#101112] text-custom-text-muted">Select</option>
                        {categories.map(c => <option key={c.id} value={c.id} className="bg-[#101112] text-white py-1">{c.name}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-custom-text-muted">
                        <ChevronDown className="w-4 h-4 opacity-70 group-focus-within:opacity-100 group-focus-within:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Date Prod.</label>
                    <input required value={newItemDate} onChange={e => setNewItemDate(e.target.value)} type="date" className="[&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark] shadow-inner" />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Expiry Date</label>
                    <input required value={newItemExpiry} onChange={e => setNewItemExpiry(e.target.value)} type="date" className="[&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark] shadow-inner" />
                  </div>
                  <div className="group flex gap-2">
                    <div className="w-20">
                      <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1">Cur</label>
                      <div className="relative group/curr">
                        <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)} className="w-full bg-[#101112] hover:bg-[#151618] border border-white/[0.1] hover:border-white/[0.2] rounded py-2.5 pl-3 pr-8 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer shadow-inner">
                          {['INR', 'USD', 'EUR', 'GBP'].map(c => <option key={c} value={c} className="bg-[#101112] text-white">{c}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-custom-text-muted">
                          <ChevronDown className="w-3.5 h-3.5 opacity-70 group-focus-within/curr:opacity-100 group-focus-within/curr:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Unit Price</label>
                      <input required value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} type="number" step="0.01" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Stock Vol.</label>
                    <div className="flex gap-2">
                      <input required value={newItemStock} onChange={e => setNewItemStock(e.target.value)} type="number" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="0" />
                      <button type="submit" className="bg-primary text-black px-4 py-2 rounded hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center shrink-0">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>

              {/* Inventory Table */}
              <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-white/[0.05] flex justify-between items-center bg-[#0d0e0f]/50">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Active Inventory Ledger</div>
                  <div className="text-[10px] font-mono-data text-secondary uppercase tracking-[0.2em]">{filteredAndSortedItems.length} ENTRIES</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.05] bg-[#0d0e0f]">
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider">ID Hash</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider">Asset Name</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider">Category</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => { setSortField('dateProduced'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Date Prod. {sortField === 'dateProduced' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => { setSortField('expiryDate'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Expiry {sortField === 'expiryDate' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider text-right cursor-pointer hover:text-white" onClick={() => { setSortField('price'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Price (₹) {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider text-right cursor-pointer hover:text-white" onClick={() => { setSortField('stock'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Stock Vol. {sortField === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredAndSortedItems.map(item => {
                          const category = categories.find(c => c.id === item.categoryId);
                          const isExpiring = new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                          return (
                            <motion.tr 
                              key={item.id} 
                              layout
                              initial={{ opacity: 0, backgroundColor: "rgba(94, 107, 255, 0.2)" }}
                              animate={{ opacity: 1, backgroundColor: "transparent" }}
                              exit={{ opacity: 0, x: -20, backgroundColor: "rgba(255, 180, 171, 0.2)" }}
                              transition={{ duration: 0.3 }}
                              className="border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group"
                            >
                              <td className="p-4 font-mono-data text-xs text-custom-text-muted/60">0x{item.id.slice(0,6)}</td>
                              <td className="p-4 font-body-md text-white font-medium">{item.name}</td>
                              <td className="p-4">
                                {category ? (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono-data border border-white/[0.1] bg-black/50 shadow-inner" style={{ color: category.color }}>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }}></span>
                                    {category.name}
                                  </span>
                                ) : (
                                  <span className="text-custom-text-muted text-xs font-mono-data">ORPHANED</span>
                                )}
                              </td>
                              <td className="p-4 font-mono-data text-xs text-custom-text-muted">{item.dateProduced}</td>
                              <td className="p-4 font-mono-data text-xs">
                                <span className={isExpiring ? "text-[#ffb4ab] flex items-center gap-1" : "text-custom-text-muted"}>
                                  {isExpiring && <AlertTriangle className="w-3 h-3" />}
                                  {item.expiryDate}
                                </span>
                              </td>
                              <td className="p-4 font-mono-data text-xs text-white text-right">₹{item.price.toFixed(2)}</td>
                              <td className="p-4 font-mono-data text-xs text-right">
                                <span className={item.stock < 500 ? 'text-[#ffb4ab] font-bold' : 'text-secondary'}>
                                  {item.stock.toLocaleString()}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button onClick={() => deleteItem(item.id)} className="text-custom-text-muted hover:text-[#ffb4ab] opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 inline-flex p-1">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </motion.tr>
                          )
                        })}
              </AnimatePresence>
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-12 text-center text-custom-text-muted font-body-md">
                            No inventory records found. Register an asset above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <motion.div 
              key="categories"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 shadow-lg"
              >
                <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-4">Define Classification</div>
                <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
                  <div className="flex-1 group">
                    <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Category Name</label>
                    <input required value={newCatName} onChange={e => setNewCatName(e.target.value)} type="text" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="e.g. Raw Materials" />
                  </div>
                  <div className="group relative">
                    <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Color Tag</label>
                    <div className="flex gap-2 h-[42px] items-center px-2 bg-[#101112] border border-white/[0.1] rounded">
                      {['#5E6BFF', '#50d8e9', '#ffb689', '#E5FD17', '#ffb4ab', '#b4a5ff'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewCatColor(color)}
                          className={`w-5 h-5 rounded-full transition-transform ${newCatColor === color ? 'scale-125 ring-1 ring-white/50' : 'hover:scale-110'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="w-[1px] h-4 bg-white/[0.1] mx-2"></div>
                      <div className="relative group/picker flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white/[0.2] group-hover/picker:border-white/[0.5] transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center bg-[conic-gradient(red,yellow,lime,aqua,blue,fuchsia,red)]">
                          <input 
                            type="color" 
                            title="Custom Color"
                            value={newCatColor} 
                            onChange={e => setNewCatColor(e.target.value)}
                            className="opacity-0 w-full h-full cursor-pointer absolute inset-0 z-10"
                          />
                          <div className="w-3 h-3 rounded-full pointer-events-none z-0" style={{ backgroundColor: newCatColor }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="bg-primary text-black px-6 h-[42px] rounded hover:bg-opacity-90 active:scale-95 transition-all font-body-sm font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Create
                  </button>
                </form>
              </motion.div>

              <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#0d0e0f]/50">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Active Classifications</div>
                </div>
                <div className="divide-y divide-white/[0.05]">
                  <AnimatePresence>
                    {categories.map(cat => (
                      <motion.div 
                        key={cat.id} 
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, backgroundColor: "rgba(255, 180, 171, 0.1)" }}
                        transition={{ duration: 0.2 }}
                        className="p-4 flex items-center justify-between hover:bg-white/[0.02] group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: cat.color }}></div>
                          <span className="font-body-md text-white font-medium">{cat.name}</span>
                        </div>
                        <button onClick={() => deleteCategory(cat.id)} className="text-custom-text-muted hover:text-[#ffb4ab] opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-xs bg-white/5 hover:bg-[#ffb4ab]/10 px-2 py-1 rounded-md active:scale-95">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {categories.length === 0 && (
                    <div className="p-12 text-center text-custom-text-muted font-body-md">
                      No categories defined.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: SALES */}
          {activeTab === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TiltCard className="bg-[#101112] border border-white/[0.03] rounded-xl p-6 flex flex-col justify-between group shadow-lg">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-2">Total Revenue</div>
                  <div className="text-3xl font-mono-data text-on-surface">₹{salesStats.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </TiltCard>
                <TiltCard className="bg-[#101112] border border-white/[0.03] rounded-xl p-6 flex flex-col justify-between group shadow-lg">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-2">Total Profit</div>
                  <div className={`text-3xl font-mono-data ${salesStats.profit >= 0 ? 'text-[#E5FD17]' : 'text-[#ffb4ab]'}`}>
                    {salesStats.profit >= 0 ? '+' : '-'}₹{Math.abs(salesStats.profit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </TiltCard>
                <TiltCard className="bg-[#101112] border border-[#ffb4ab]/20 rounded-xl p-6 flex flex-col justify-between group shadow-lg">
                  <div className="text-[10px] font-mono-data text-[#ffb4ab]/70 uppercase tracking-[0.2em] mb-2">Expired Goods Loss</div>
                  <div className="text-3xl font-mono-data text-[#ffb4ab]">
                    ₹{expiredLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </TiltCard>
                <TiltCard className="bg-[#101112] border border-[#ffb4ab]/20 rounded-xl p-6 flex flex-col justify-between group shadow-lg">
                  <div className="text-[10px] font-mono-data text-[#ffb4ab]/70 uppercase tracking-[0.2em] mb-2">Total Loss (Sales + Expired)</div>
                  <div className="text-3xl font-mono-data text-[#ffb4ab]">
                    ₹{totalLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </TiltCard>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 flex flex-col shadow-lg h-[400px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Profit vs Loss Trend</div>
                    <div className="flex gap-2">
                      <div className="flex bg-[#101112] p-1 rounded-md border border-white/[0.05]">
                        <button onClick={() => setSalesChartType('line')} className={`px-2 py-1 text-[10px] font-mono-data uppercase transition-colors rounded ${salesChartType === 'line' ? 'bg-[#232426] text-white' : 'text-custom-text-muted hover:text-white'}`}>Line</button>
                        <button onClick={() => setSalesChartType('bar')} className={`px-2 py-1 text-[10px] font-mono-data uppercase transition-colors rounded ${salesChartType === 'bar' ? 'bg-[#232426] text-white' : 'text-custom-text-muted hover:text-white'}`}>Bar</button>
                      </div>
                      <div className="flex bg-[#101112] p-1 rounded-md border border-white/[0.05]">
                        {(['weekly', 'monthly', 'yearly'] as const).map(tr => (
                          <button
                            key={tr}
                            onClick={() => setSalesTimeRange(tr)}
                            className={`px-3 py-1 text-[10px] font-mono-data uppercase transition-colors rounded ${salesTimeRange === tr ? 'bg-primary text-black' : 'text-custom-text-muted hover:text-white'}`}
                          >
                            {tr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {salesChartType === 'bar' ? (
                        <BarChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#232426" vertical={false} />
                          <XAxis dataKey="name" stroke="#8f8fa1" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#8f8fa1" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#101112', borderColor: '#232426', borderRadius: '8px' }}
                            itemStyle={{ fontFamily: 'Inter', fontSize: '12px' }}
                            labelStyle={{ color: '#9A9DA3', fontFamily: 'Inter', fontSize: '10px' }}
                            formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                          />
                          <Bar dataKey="profit" fill="#E5FD17" radius={[2, 2, 0, 0]} stackId="a" />
                          <Bar dataKey="loss" fill="#ffb4ab" radius={[2, 2, 0, 0]} stackId="a" />
                        </BarChart>
                      ) : (
                        <LineChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#232426" vertical={false} />
                          <XAxis dataKey="name" stroke="#8f8fa1" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#8f8fa1" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#101112', borderColor: '#232426', borderRadius: '8px' }}
                            itemStyle={{ fontFamily: 'Inter', fontSize: '12px' }}
                            labelStyle={{ color: '#9A9DA3', fontFamily: 'Inter', fontSize: '10px' }}
                            formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                          />
                          <Line type="monotone" dataKey="profit" stroke="#E5FD17" strokeWidth={2} dot={{ fill: '#E5FD17', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                          <Line type="monotone" dataKey="loss" stroke="#ffb4ab" strokeWidth={2} dot={{ fill: '#ffb4ab', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl shadow-lg flex flex-col h-[400px]"
                >
                  <div className="p-6 border-b border-white/[0.05] bg-[#0d0e0f]/50">
                     <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Record Sale</div>
                  </div>
                  <div className="p-6 flex-1 overflow-y-auto">
                    <form onSubmit={handleRecordSale} className="space-y-4">
                      {saleError && (
                        <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] px-3 py-2 rounded text-xs font-mono-data">
                          {saleError}
                        </div>
                      )}
                      <div className="group">
                        <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1">Item Sold</label>
                        <div className="relative">
                          <select required value={newSaleItemId} onChange={e => setNewSaleItemId(e.target.value)} className="w-full bg-[#101112] hover:bg-[#151618] border border-white/[0.1] hover:border-white/[0.2] rounded py-2.5 pl-3 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none shadow-inner cursor-pointer">
                            <option value="" disabled className="bg-[#101112] text-custom-text-muted">Select Item</option>
                            {filteredAndSortedItems.map(i => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const isExpired = new Date(i.expiryDate) < today;
                              return (
                                <option key={i.id} value={i.id} className="bg-[#101112] text-white py-1">
                                  {i.name} {isExpired ? '(EXPIRED)' : `(Stock: ${i.stock})`}
                                </option>
                              );
                            })}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-custom-text-muted">
                            <ChevronDown className="w-4 h-4 opacity-70 group-focus-within:opacity-100 group-focus-within:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                          <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1">Quantity</label>
                          <input required min="1" value={newSaleQuantity} onChange={e => setNewSaleQuantity(e.target.value)} type="number" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="group">
                          <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1">Sell Price Per Unit ({selectedCurrency})</label>
                          <input required min="0" step="0.01" value={newSalePrice} onChange={e => setNewSalePrice(e.target.value)} type="number" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary" />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-primary text-black py-2.5 rounded hover:bg-opacity-90 font-bold transition-all">Record Transaction</button>
                    </form>
                  </div>
                </motion.div>
              </div>
              
              <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-white/[0.05] bg-[#0d0e0f]/50">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Sales Ledger Log</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.05] bg-[#0d0e0f]">
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider">Date</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider">Item</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider text-right">Qty</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider text-right">Sell Price</th>
                        <th className="p-4 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider text-right">Profit/Loss</th>
                        <th className="p-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredSales.map(sale => {
                          const originalItem = items.find(i => i.id === sale.itemId);
                          const itemName = sale.itemName || originalItem?.name || 'Unknown Item';
                          const unitCost = sale.itemCost || originalItem?.price || 0;
                          const cogs = unitCost * sale.quantity;
                          const rev = sale.sellPrice * sale.quantity;
                          const profit = rev - cogs;
                          return (
                            <motion.tr 
                              key={sale.id}
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                              transition={{ duration: 0.2 }}
                              className="border-b border-white/[0.02] hover:bg-white/[0.01] group"
                            >
                              <td className="p-4 text-xs text-custom-text-muted font-mono-data">{new Date(sale.date).toLocaleString()}</td>
                              <td className="p-4 text-sm text-on-surface">{itemName}</td>
                              <td className="p-4 text-sm text-on-surface font-mono-data text-right">{sale.quantity}</td>
                              <td className="p-4 text-sm text-on-surface font-mono-data text-right">₹{sale.sellPrice.toLocaleString()}</td>
                              <td className={`p-4 text-sm font-mono-data text-right ${profit >= 0 ? 'text-[#E5FD17]' : 'text-[#ffb4ab]'}`}>
                                {profit >= 0 ? '+' : '-'}₹{Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </td>
                              <td className="p-4 text-right">
                                <button onClick={() => deleteSale(sale.id)} className="text-custom-text-muted hover:text-[#ffb4ab] opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 inline-flex p-1">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                      {filteredSales.length === 0 && (
                        <tr><td colSpan={6} className="p-12 text-center text-custom-text-muted font-body-md">No sales found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
          {/* TAB: EXPENSES */}
          {activeTab === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Auto Categorization Form */}
                <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 shadow-lg h-fit">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-4">Record Expense</div>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Description</label>
                      <input required value={newExpenseDesc} onChange={e => setNewExpenseDesc(e.target.value)} type="text" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="e.g. Uber to warehouse" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Amount (₹)</label>
                      <input required value={newExpenseAmount} onChange={e => setNewExpenseAmount(e.target.value)} type="number" step="0.01" min="0" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="0.00" />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold text-xs uppercase tracking-wider py-3 rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all">
                      <Plus className="w-4 h-4" /> Categorize & Record
                    </button>
                    <div className="mt-2 text-xs text-custom-text-muted text-center italic">Smart auto-categorization applied automatically based on description.</div>
                  </form>
                </div>

                {/* Donut Chart Summary */}
                <div className="lg:col-span-2 bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 shadow-lg h-[400px] flex flex-col">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-6">Spending Breakdown</div>
                  {expenseData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={120}
                          stroke="none"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#101112', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff', fontSize: '12px' }}
                          formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Amount']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-custom-text-muted font-mono-data text-sm">
                      No spending data yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Expense Ledger */}
              <div className="relative border border-white/[0.05] rounded-2xl bg-[#0a0a0b] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-xl -z-10 rounded-2xl opacity-50"></div>
                <div className="p-4 border-b border-white/[0.05]">
                  <span className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-6 block">Transactions / Ledger</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#101112] border-b border-white/[0.05] text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider">
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Description</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium text-right">Amount (₹)</th>
                        <th className="p-4 font-medium text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      <AnimatePresence>
                        {expenses && expenses.map(exp => (
                          <motion.tr
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="hover:bg-white/[0.02] transition-colors group"
                          >
                            <td className="p-4 text-sm text-custom-text-muted whitespace-nowrap">{new Date(exp.date).toLocaleDateString()}</td>
                            <td className="p-4 text-sm text-white font-medium">{exp.description}</td>
                            <td className="p-4 text-sm">
                              <span className="bg-white/10 text-white px-2 py-1 rounded text-xs">{exp.category}</span>
                            </td>
                            <td className="p-4 text-sm text-white font-mono text-right font-medium">{exp.amount.toFixed(2)}</td>
                            <td className="p-4 text-center">
                              <button onClick={() => deleteExpense(exp.id)} className="text-custom-text-muted hover:text-[#ffb4ab] transition-colors p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                      {(!expenses || expenses.length === 0) && (
                        <tr><td colSpan={5} className="p-12 text-center text-custom-text-muted font-body-md">No expenses logged.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

          </main>

      {/* Export Report Timeframe Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-[#0e0f12] border border-white/[0.12] rounded-2xl p-6 sm:p-8 shadow-[0_32px_96px_-16px_rgba(0,0,0,0.9)] z-10 my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      Export Financial Ledger
                      <span className="text-[10px] font-mono-data font-semibold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        CSV Report
                      </span>
                    </h3>
                    <p className="text-xs text-custom-text-muted mt-0.5">Select reporting timeframe and granularity for export</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-custom-text-muted hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Timeframe Selection Options */}
              <div className="space-y-3 mb-6">
                {[
                  {
                    id: 'weekly',
                    title: 'Weekly Report',
                    periodBadge: 'Last 7 Days',
                    description: 'Recent transactions, cash flow velocity & short-term sales margins',
                    getSales: () => sales.filter(s => new Date(s.date).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000)
                  },
                  {
                    id: 'monthly',
                    title: 'Monthly Report',
                    periodBadge: 'Last 30 Days',
                    description: 'Month-to-date margin analysis, COGS, inventory valuation & turnovers',
                    getSales: () => sales.filter(s => new Date(s.date).getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000)
                  },
                  {
                    id: 'annually',
                    title: 'Annual Report',
                    periodBadge: 'Last 365 Days / 1 Year',
                    description: 'Full fiscal year ledger, annual profit/loss summary & long-term trends',
                    getSales: () => sales.filter(s => new Date(s.date).getTime() >= Date.now() - 365 * 24 * 60 * 60 * 1000)
                  },
                  {
                    id: 'all',
                    title: 'All Time Report',
                    periodBadge: 'Complete Lifetime',
                    description: 'Comprehensive database archive with all historical sales and inventory logs',
                    getSales: () => sales
                  },
                  {
                    id: 'custom',
                    title: 'Custom Range',
                    periodBadge: 'Specify Dates',
                    description: 'Select a specific start and end date for a customized report window',
                    getSales: () => {
                      if (!exportStartDate || !exportEndDate) return [];
                      const s = new Date(exportStartDate).getTime();
                      const e = new Date(exportEndDate).getTime() + 86399999;
                      return sales.filter(sale => {
                        const t = new Date(sale.date).getTime();
                        return t >= s && t <= e;
                      });
                    }
                  }
                ].map(opt => {
                  const isSelected = selectedReportTimeframe === opt.id;
                  const matchingSales = opt.getSales();
                  const periodRev = matchingSales.reduce((acc, s) => acc + (s.sellPrice * s.quantity), 0);

                  return (
                    <TiltCard
                      key={opt.id}
                      onClick={() => setSelectedReportTimeframe(opt.id as any)}
                      className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-gradient-to-r from-primary/[0.08] to-transparent border-primary/50 shadow-[0_0_24px_rgba(80,216,233,0.12)] ring-1 ring-primary/30'
                          : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Radio Check Indicator - Strictly Constrained Size */}
                        <div className={`w-5 h-5 min-w-[20px] max-w-[20px] aspect-square rounded-full border flex items-center justify-center transition-all shrink-0 ${
                          isSelected 
                            ? 'border-primary bg-primary text-black shadow-sm' 
                            : 'border-white/20 bg-white/[0.03] group-hover:border-white/40'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3.5]" />}
                        </div>

                        {/* Text Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <span className="text-sm font-semibold text-white tracking-tight whitespace-nowrap">
                              {opt.title}
                            </span>
                            <span className="text-[10px] font-mono-data font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-custom-text-muted border border-white/[0.08] whitespace-nowrap">
                              {opt.periodBadge}
                            </span>
                          </div>
                          <p className="text-xs text-custom-text-muted mt-1 truncate">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Meta Stats */}
                      <div className="text-right shrink-0 pl-2">
                        <div className="flex items-center justify-end gap-1.5 font-mono-data text-xs text-white font-semibold">
                          <span>{matchingSales.length}</span>
                          <span className="text-[10px] text-custom-text-muted uppercase font-normal">logs</span>
                        </div>
                        <div className="text-[10px] font-mono-data text-custom-text-muted mt-0.5 whitespace-nowrap">
                          {selectedCurrency} {periodRev.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>

              {/* Custom Date Pickers */}
              <AnimatePresence>
                {selectedReportTimeframe === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '-12px' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 p-4 mb-6 bg-white/[0.02] border border-white/[0.06] rounded-xl relative z-0">
                      <div className="flex-1 group">
                        <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1.5 group-focus-within:text-primary transition-colors">Start Date</label>
                        <input value={exportStartDate} onChange={e => setExportStartDate(e.target.value)} type="date" className="[&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer w-full bg-[#101112] border border-white/[0.1] rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 transition-all [color-scheme:dark] shadow-inner" />
                      </div>
                      <div className="flex-1 group">
                        <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1.5 group-focus-within:text-primary transition-colors">End Date</label>
                        <input value={exportEndDate} onChange={e => setExportEndDate(e.target.value)} type="date" className="[&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer w-full bg-[#101112] border border-white/[0.1] rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 transition-all [color-scheme:dark] shadow-inner" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scope Metrics Preview Card */}
              <div className="bg-[#141518] border border-white/[0.08] rounded-xl p-3.5 mb-6 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-custom-text-muted">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <span>Report includes: <strong className="text-white">Active Stock Ledger</strong>, <strong className="text-white">Category Groupings</strong>, & <strong className="text-white">Executive Totals</strong></span>
                </div>
                <div className="text-[11px] font-mono-data text-secondary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  READY_FOR_EXPORT
                </div>
              </div>

              {/* Modal Footer / Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] gap-3">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-custom-text-muted hover:text-white hover:bg-white/[0.05] transition-colors uppercase tracking-wider"
                >
                  Dismiss
                </button>
                
                <button
                  type="button"
                  onClick={() => exportCSV(selectedReportTimeframe)}
                  className="flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(255,255,255,0.18)]"
                >
                  <Download className="w-4 h-4" />
                  Generate & Download Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-[#1a1b1e] border border-white/10 rounded-xl px-5 py-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-white tracking-tight">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 text-custom-text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
