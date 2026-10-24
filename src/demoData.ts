import { Category, InventoryItem, SaleRecord } from './types';

export function generateDemoData() {
  const categoryTemplates = [
    { name: 'Precision Optics', color: '#50d8e9' },
    { name: 'Power Units', color: '#e5fd17' },
    { name: 'Hardware & Rigging', color: '#ffb4ab' },
    { name: 'Sensor Arrays', color: '#7c4dff' },
  ];

  const categories: Category[] = categoryTemplates.map((cat, idx) => ({
    id: `cat-${idx + 1}-${Math.random().toString(36).slice(2, 7)}`,
    name: cat.name,
    color: cat.color,
  }));

  const itemNamesByCategory: Record<string, string[]> = {
    'Precision Optics': ['Laser Collimator X-4', 'Fused Silica Prism', 'Telecentric Lens 50mm', 'Achromatic Doublet', 'Infrared Beam Splitter'],
    'Power Units': ['Lithium Iron Cell 48V', 'Solid State Relay 100A', 'Toroidal Transformer', 'High-Flux Capacitor 400V', 'DC Voltage Regulator'],
    'Hardware & Rigging': ['Titanium Fastener M8', 'Anodized Carbon Bracket', 'Hydraulic Coupling 12mm', 'Duralumin Gasket Ring', 'Beryllium Bushing'],
    'Sensor Arrays': ['MEMS Gyroscope Unit', 'Thermal Imaging Diode', 'Piezo Pressure Gauge', 'Ultrasonic Flow Sensor', 'Hall Effect Module'],
  };

  const items: InventoryItem[] = [];
  const sales: SaleRecord[] = [];

  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  let itemCounter = 1;
  categories.forEach(category => {
    const names = itemNamesByCategory[category.name] || ['Modular Assembly'];
    names.forEach(name => {
      // Random production date in the past 12 months
      const producedTime = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime() - 15 * 24 * 60 * 60 * 1000);
      const dateProduced = new Date(producedTime);
      
      // Shelf life between 90 days and 400 days (some may be expired, some expiring soon, some fresh)
      const shelfLifeDays = 60 + Math.floor(Math.random() * 320);
      const expiryDate = new Date(producedTime + shelfLifeDays * 24 * 60 * 60 * 1000);
      
      const price = Math.floor(Math.random() * 850) + 120;
      const stock = Math.floor(Math.random() * 120) + 15;

      const item: InventoryItem = {
        id: `item-${itemCounter++}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        categoryId: category.id,
        dateProduced: dateProduced.toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0],
        price,
        stock,
      };
      items.push(item);
    });
  });

  // Generate around 80-120 sales transactions across the last 12 months
  const totalSalesToGenerate = 85 + Math.floor(Math.random() * 30);
  for (let i = 1; i <= totalSalesToGenerate; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const itemProdTime = new Date(item.dateProduced).getTime();
    
    // Sale occurs after production date and before now
    const saleTime = itemProdTime + Math.random() * (now.getTime() - itemProdTime);
    if (saleTime > now.getTime()) continue;

    const saleDate = new Date(saleTime);
    const quantity = Math.floor(Math.random() * 4) + 1;
    
    // 85% profitable, 15% discount clearance (loss)
    const isDiscount = Math.random() < 0.15;
    const markupFactor = isDiscount ? (0.7 + Math.random() * 0.25) : (1.15 + Math.random() * 0.65);
    const sellPrice = Math.round(item.price * markupFactor * 100) / 100;

    sales.push({
      id: `sale-${i}-${Math.random().toString(36).slice(2, 7)}`,
      itemId: item.id,
      itemName: item.name,
      itemCost: item.price,
      quantity,
      sellPrice,
      date: saleDate.toISOString(),
    });
  }

  sales.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return { categories, items, sales };
}
