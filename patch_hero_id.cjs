const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

code = code.replace(
  '<section className="px-margin-safe relative pt-32 pb-20">',
  '<section id="dashboard" className="px-margin-safe relative pt-32 pb-20">'
);

fs.writeFileSync('src/components/Hero.tsx', code);
