import React from 'react';
import { LayoutDashboard } from 'lucide-react';

// Wordmark Visa (evocação da marca para uso interno do time VIS).
function VisaWordmark() {
  return (
    <span className="relative inline-flex items-start" aria-label="Visa">
      <span
        className="text-[26px] font-black italic tracking-tight text-white leading-none select-none"
        style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
      >
        VISA
      </span>
      <span className="ml-[3px] mt-[3px] w-2 h-2 rotate-45 rounded-[2px] bg-[#FAA61A]" />
    </span>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#0A142F]/95 backdrop-blur-md border-b border-[#1e2a44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Marca */}
          <div className="flex items-center gap-3 flex-none">
            <VisaWordmark />
            <div className="hidden md:block border-l border-[#26365a] pl-3">
              <div className="text-[13px] font-semibold text-slate-100 leading-tight">Base de Conocimiento Activa</div>
              <div className="text-[11px] text-slate-400 leading-tight">Visa Implementation Services</div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex items-center gap-1 bg-[#050e1f]/70 p-1 rounded-xl border border-[#1e2a44]">
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-[#1A1F71] text-white shadow-md shadow-[#1A1F71]/40">
              <LayoutDashboard className="w-4 h-4" />
              Seguimiento
            </span>
          </nav>

          {/* Estado en vivo */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#050e1f]/70 border border-[#1e2a44] flex-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-400">Datos en vivo</span>
          </div>

        </div>
      </div>
    </header>
  );
}
