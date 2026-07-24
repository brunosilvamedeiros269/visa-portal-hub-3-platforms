import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Database,
  Globe,
  CheckCircle2, 
  Server, 
  Layers,
  Sparkles,
  RefreshCw,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  openHostingGuide,
  dockerStatus
}) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-lg tracking-wider">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-base tracking-tight">{t('appTitle')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-medium">
                  {t('appSubtitle')}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">OpenProject + BookStack + Data Wiki</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tracking'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>{t('projectsTab')}</span>
            </button>

            <button
              onClick={() => setActiveTab('shelves')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'shelves'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('shelvesTab')}</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'data'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{t('dataTab')}</span>
            </button>
          </nav>

          {/* Right Actions, Language Selector & Docker Status */}
          <div className="flex items-center gap-3">
            {/* Seletor de Idioma (PT / ES) */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <Languages className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
              <button
                onClick={() => setLanguage('pt')}
                title={t('portuguese')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'pt'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                🇧🇷 PT
              </button>
              <button
                onClick={() => setLanguage('es')}
                title={t('spanish')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'es'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                🇪🇸 ES
              </button>
            </div>

            {/* Status do Docker / Serviços */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 text-[11px]">{t('dockerActive')}</span>
            </div>

            {/* Botão Guia Web Grátis */}
            <button
              onClick={openHostingGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-medium shadow-md shadow-emerald-600/20 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('freeHostingButton')}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

