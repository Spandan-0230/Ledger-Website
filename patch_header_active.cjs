const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const replacement = `
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function Header() {
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const sections = ['dashboard', 'transactions', 'budgets', 'reports'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -40% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', href: '#' },
    { id: 'transactions', label: 'Transactions', href: '#transactions' },
    { id: 'budgets', label: 'Budgets', href: '#budgets' },
    { id: 'reports', label: 'Reports', href: '#reports' },
  ];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="bg-custom-bg/80 backdrop-blur-md w-full top-0 h-[80px] border-b border-custom-divider z-50 fixed"
    >
      <div className="flex justify-between items-center w-full px-margin-safe max-w-[1728px] mx-auto h-full">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full border border-custom-text-muted flex items-center justify-center text-on-surface font-h3 font-bold">L</div>
          <span className="font-h3 text-h3 font-bold tracking-tight text-on-surface">Ledger</span>
        </div>
        <nav className="hidden md:flex gap-lg h-full items-center">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                className={\`relative flex items-center h-full font-body-md text-body-md transition-colors duration-200 \${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }\`}
                href={link.href}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="header-active-underline"
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>
        <div className="flex gap-md">
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 px-md py-sm rounded border border-custom-divider" href="/login">Log in</a>
          <a className="font-body-md text-body-md bg-white text-black px-md py-sm rounded hover:bg-opacity-90 transition-colors duration-200 font-bold" href="/login">Get Started</a>
        </div>
      </div>
    </motion.header>
  );
}
`;

fs.writeFileSync('src/components/Header.tsx', replacement);
