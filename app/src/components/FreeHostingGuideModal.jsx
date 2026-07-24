import React, { useState } from 'react';
import { X, Cloud, Server, Database, Globe, CheckCircle2, Copy, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FreeHostingGuideModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [copiedStep, setCopiedStep] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, stepId) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                {t('hostingGuideTitle')}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  R$ 0,00 / mês
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {t('hostingGuideSubtitle')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 text-slate-300">
          
          {/* Card Resumo da Arquitetura Cloud */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
                <Globe className="w-4 h-4" /> {t('step1Title')}
              </div>
              <p className="text-xs text-slate-400 mb-2">{t('step1Desc')}</p>
              <div className="text-sm font-bold text-slate-200">Vercel / Netlify</div>
              <span className="text-[10px] text-emerald-400 font-mono">Grátis para sempre (SSL Incluso)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
                <Database className="w-4 h-4" /> {t('step2Title')}
              </div>
              <p className="text-xs text-slate-400 mb-2">{t('step2Desc')}</p>
              <div className="text-sm font-bold text-slate-200">Supabase Cloud</div>
              <span className="text-[10px] text-emerald-400 font-mono">Plano Free (2 Projetos Postgres)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/40 transition-all">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                <Server className="w-4 h-4" /> {t('step3Title')}
              </div>
              <p className="text-xs text-slate-400 mb-2">{t('step3Desc')}</p>
              <div className="text-sm font-bold text-slate-200">Oracle Free / Render</div>
              <span className="text-[10px] text-emerald-400 font-mono">4 vCPU + 24GB RAM Grátis</span>
            </div>
          </div>

          {/* Passo 1: Vercel / Netlify */}
          <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">1</span>
              Deploy do Portal Hub (Frontend React) na Vercel
            </h3>
            <p className="text-xs text-slate-400">
              Conecte este repositório do GitHub com a <strong>Vercel</strong> para ter build automático a cada commit.
            </p>
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>npx vercel --prod</span>
              <button 
                onClick={() => copyToClipboard('npx vercel --prod', 'vercel')}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
              >
                {copiedStep === 'vercel' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStep === 'vercel' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Passo 2: Supabase Cloud */}
          <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">2</span>
              Banco de Dados & Autenticação no Supabase Cloud
            </h3>
            <p className="text-xs text-slate-400">
              Crie um projeto gratuito em <strong>supabase.com</strong>. O Supabase fornece um banco Postgres gerenciado com REST API automática, autenticação e suporte a tabelas sem custo.
            </p>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              <li>Cadastre-se grátis em <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a></li>
              <li>Copie a <strong>Project URL</strong> e a <strong>anon key</strong> para as variáveis do projeto.</li>
            </ul>
          </div>

          {/* Passo 3: Oracle Cloud Free Tier ou Render/Railway */}
          <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">3</span>
              Servidor Gratuito para OpenProject & BookStack (Docker)
            </h3>
            <p className="text-xs text-slate-400">
              Para executar o <strong>OpenProject</strong> e o <strong>BookStack</strong> via Docker na nuvem 100% grátis:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
                <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Opção A: Oracle Cloud Free Always
                </div>
                <p className="text-[11px] text-slate-400">
                  A Oracle oferece <strong>4 vCPUs Ampere ARM + 24 GB de RAM</strong> gratuitamente para sempre. Você pode subir o `docker-compose.yml` neste servidor com 1 comando.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
                <div className="font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" /> Opção B: Render.com / Railway
                </div>
                <p className="text-[11px] text-slate-400">
                  Plataforma de contêineres PaaS. Permite fazer deploy de imagens Docker diretamente do GitHub no plano gratuito.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-lg shadow-blue-500/20"
          >
            {t('close')}
          </button>
        </div>

      </div>
    </div>
  );
}

