const fs = require('fs');
let code = fs.readFileSync('src/components/Features.tsx', 'utf8');

// Replace all instances of `once: true` with `once: false`
code = code.replace(/once:\s*true/g, 'once: false');

// Now let's inject IDs into the main wrapper divs of each component
code = code.replace(
  'function FeatureTransactions() {\n  const mockTransactions',
  'function FeatureTransactions() {\n  const mockTransactions'
);

code = code.replace(
  'return (\n    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">',
  'return (\n    <div id="transactions" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-24 -mt-24">'
);

code = code.replace(
  'function FeatureBudgets() {\n  return (\n    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">',
  'function FeatureBudgets() {\n  return (\n    <div id="budgets" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-24 -mt-24">'
);

code = code.replace(
  'function FeatureReports() {\n  return (\n    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">',
  'function FeatureReports() {\n  return (\n    <div id="reports" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-24 -mt-24">'
);

fs.writeFileSync('src/components/Features.tsx', code);
