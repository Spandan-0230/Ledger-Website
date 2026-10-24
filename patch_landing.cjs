const fs = require('fs');

// Patch index.css
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('scroll-behavior: smooth')) {
  css += '\nhtml { scroll-behavior: smooth; }\n';
  fs.writeFileSync('src/index.css', css);
}

// Patch Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(
  'href="#">Dashboard</a>',
  'href="#">Dashboard</a>'
).replace(
  'href="#">Transactions</a>',
  'href="#transactions">Transactions</a>'
).replace(
  'href="#">Budgets</a>',
  'href="#budgets">Budgets</a>'
).replace(
  'href="#">Reports</a>',
  'href="#reports">Reports</a>'
);
fs.writeFileSync('src/components/Header.tsx', header);

// Patch Features.tsx
let features = fs.readFileSync('src/components/Features.tsx', 'utf8');
// Add IDs
features = features.replace(
  'function FeatureTransactions() {',
  'function FeatureTransactions() {\n  return <div id="transactions">'
);
features = features.replace(
  'function FeatureBudgets() {',
  'function FeatureBudgets() {\n  return <div id="budgets" className="pt-24">'
);
features = features.replace(
  'function FeatureReports() {',
  'function FeatureReports() {\n  return <div id="reports" className="pt-24">'
);

// Close divs for the IDs added above
// Wait, replacing return is tricky. I'll just do a more targeted replace.
