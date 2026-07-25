import React from 'react';
import Header from './components/Header';
import TrackingView from './components/TrackingView';

export default function App() {
  return (
    <div className="min-h-screen bg-[#051424] text-slate-100 flex flex-col font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrackingView />
      </main>

      <footer className="border-t border-[#1e2a44] bg-[#0A142F]/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Base de Conocimiento Activa · Visa Implementation Services</span>
          <span className="text-[11px] text-slate-600">Datos en vivo desde Supabase</span>
        </div>
      </footer>
    </div>
  );
}
