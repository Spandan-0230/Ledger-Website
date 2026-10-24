const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!code.includes("import { motion }")) {
  code = "import { motion } from 'motion/react';\n" + code;
  code = code.replace(
    '<header className="bg-custom-bg w-full top-0 h-[80px] border-b border-custom-divider z-50 fixed">',
    '<motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-custom-bg/80 backdrop-blur-md w-full top-0 h-[80px] border-b border-custom-divider z-50 fixed">'
  );
  code = code.replace(
    '</header>',
    '</motion.header>'
  );
  fs.writeFileSync('src/components/Header.tsx', code);
}
