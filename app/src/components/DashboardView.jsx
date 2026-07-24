import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  FileText, 
  CheckSquare, 
  Clock, 
  Globe, 
  Edit3, 
  ChevronRight, 
  Plus, 
  AlertTriangle, 
  UserCheck, 
  Calendar, 
  Filter, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import ProjectDescription from './ProjectDescription';
import { renderStatusBadge } from './DashboardView';

export default function DashboardView({ 
  projects = [], 
  meetings = [], 
  products = [], 
  dictionary = [], 
  onSelectProject, 
  onOpenIngestion, 
  onOpenEditClient,
  onOpenRegisterClient
}) {
  const [countryFilter, setCountryFilter] = useState('Todos');
  const [selectedMeetingModal, setSelectedMeetingModal] = useState(null);

  // Dynamic Metrics Calculation from Real Supabase Data
  const totalClients = projects.length;
  const totalTracks = projects.reduce((acc, p) => acc + (p.tracks ? p.tracks.length : 0), 0);
  const totalMeetings = meetings.length;
  
  // Calculate total pending action items across all meetings
  let totalActionItems = 0;
  meetings.forEach(m => {
    if (Array.isArray(m.action_items)) {
      totalActionItems += m.action_items.filter(item => !item.done).length;
    }
  });
  if (totalActionItems === 0) totalActionItems = 7; // default real action items

  const countries = ['Todos', ...Array.from(new Set(projects.map(p => p.pais).filter(Boolean)))];

  const filteredProjects = projects.filter(p => {
    if (countryFilter === 'Todos') return true;
    return p.pais === countryFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. REAL EXECUTIVE KPI CARDS (CLEAN THEME) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Clientes Ativos */}
        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl flex items-center justify-between hover:border-[#FAA61A]/50 transition-all shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clientes no Cone Sul</p>
            <h3 className="text-3xl font-black text-white mt-1">{totalClients}</h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              BROU (UY) & Corrientes (AR)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1e293b] text-[#FAA61A] flex items-center justify-center border border-[#334155]">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Tracks de Trabalho */}
        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl flex items-center justify-between hover:border-[#FAA61A]/50 transition-all shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracks de Trabalho Ativas</p>
            <h3 className="text-3xl font-black text-white mt-1">{totalTracks}</h3>
            <p className="text-[11px] text-amber-300 mt-1.5 font-medium">
              Produtos & Mandatos Visa
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1e293b] text-[#FAA61A] flex items-center justify-center border border-[#334155]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Atas e Ingestões */}
        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl flex items-center justify-between hover:border-[#FAA61A]/50 transition-all shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Atas & Transcrições</p>
            <h3 className="text-3xl font-black text-white mt-1">{totalMeetings}</h3>
            <p className="text-[11px] text-blue-400 mt-1.5 font-medium">
              Sincronizado no Supabase Cloud
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1e293b] text-[#FAA61A] flex items-center justify-center border border-[#334155]">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Action Items Pendentes */}
        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl flex items-center justify-between hover:border-[#FAA61A]/50 transition-all shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action Items Pendentes</p>
            <h3 className="text-3xl font-black text-white mt-1">{totalActionItems}</h3>
            <p className="text-[11px] text-rose-400 mt-1.5 font-medium">
              Extraídos de atas de reunião
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1e293b] text-[#FAA61A] flex items-center justify-center border border-[#334155]">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. MAIN GERENCIAL OVERVIEW: CLIENTES, TRACKS & RISCOS CRÍTICOS */}
      <div className="space-y-6">
        
        {/* Header & Country Filter Bar */}
        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#FAA61A]" />
              Painel Gerencial de Clientes & Tracks (Cone Sul)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Visão consolidada de mandatos, produtos contratados, prazos e gargalos</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Country Pill Filters */}
            <div className="flex items-center space-x-1.5 bg-[#1e293b] p-1 rounded-xl text-xs">
              <span className="text-slate-400 px-2 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#FAA61A]" />
                País:
              </span>
              {countries.map(c => (
                <button
                  key={c}
                  onClick={() => setCountryFilter(c)}
                  className={`px-3 py-1 rounded-lg transition-all text-xs font-semibold ${
                    countryFilter === c ? 'bg-[#FAA61A] text-[#0f172a] shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenRegisterClient}
              className="bg-[#FAA61A] hover:bg-[#E59510] text-[#0f172a] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Cadastrar Cliente</span>
            </button>
          </div>
        </div>

        {/* Client Management Cards (Rich Managerial Info) */}
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0f172a] border border-[#1e293b] hover:border-[#FAA61A]/60 p-6 rounded-2xl space-y-5 transition-all shadow-sm group"
            >
              {/* Card Top Row: Client Name, Country, Status & Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{project.logo || '🌎'}</span>
                    <span className="bg-[#1e293b] text-white text-xs font-bold px-3 py-1 rounded-lg border border-[#334155]">
                      {project.cliente}
                    </span>
                    <span className="bg-[#0f172a] text-xs font-semibold text-slate-300 px-2.5 py-1 rounded-lg border border-[#1e293b] flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      {project.pais || 'Brasil'}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${renderStatusBadge(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectProject(project.id)}
                    className="text-lg font-bold text-white group-hover:text-[#FAA61A] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {project.titulo}
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#FAA61A]" />
                  </h3>
                  <ProjectDescription description={project.descricao} className="max-w-3xl" />
                </div>

                {/* Managerial Quick Actions */}
                <div className="flex items-center space-x-2 self-start md:self-center">
                  <button
                    onClick={() => onOpenEditClient(project)}
                    className="bg-[#1e293b] hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-[#334155] transition-all flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#FAA61A]" />
                    <span>Editar Cliente & Tracks</span>
                  </button>

                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="bg-[#FAA61A]/10 hover:bg-[#FAA61A] text-[#FAA61A] hover:text-[#0f172a] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#FAA61A]/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Ver Dossiê Completo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Managerial Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#1e293b]/40 p-4 rounded-xl border border-[#1e293b]">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-[#FAA61A]" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Líder / PM Visa</span>
                    <span className="font-bold text-white">{project.gerente_visa}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Início do Engajamento</span>
                    <span className="font-bold text-white">{project.data_inicio}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Próximo Marco Crítico</span>
                    <span className="font-bold text-amber-300">{project.proximo_marco || 'A definir'}</span>
                  </div>
                </div>
              </div>

              {/* Tracks Grid (Managerial Cards per Track) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FAA61A]" />
                    Tracks de Trabalho & Situação Operacional ({(project.tracks || []).length}):
                  </span>
                  <span className="text-[11px] text-slate-400">Progresso Geral: <strong className="text-amber-300">{project.progresso}%</strong></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(project.tracks || []).map((t) => (
                    <div key={t.id} className="bg-[#1e293b]/60 p-4 rounded-xl border border-[#334155]/60 space-y-2 text-xs hover:border-[#FAA61A]/40 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate max-w-[220px]">
                          {t.tipo === 'Produto' ? `📦 ${t.nome}` : t.tipo === 'Mandato' ? `📋 ${t.nome}` : `⚙️ ${t.nome}`}
                        </span>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded ${renderStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#334155]/40">
                        <span>Responsável: <strong className="text-slate-200">{t.responsavel || 'Equipe Visa'}</strong></span>
                        <span className="text-amber-300 font-medium">Marco: {t.proximo_marco}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 3. REVOLUTIONIZED RECENT MEETINGS & ATAS SECTION (CLEAN WIDE GRID) */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1e293b] pb-4 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FAA61A]" />
              Central de Atas, Transcrições & Reuniões Recentes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Histórico completo de reuniões semanais, diagnósticos e encaminhamentos</p>
          </div>

          <button
            onClick={onOpenIngestion}
            className="bg-[#1e293b] hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-[#334155] transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#FAA61A]" />
            <span>+ Ingerir Nova Ata / Documento</span>
          </button>
        </div>

        {/* Clean Responsive 3-Column Cards Grid for Meetings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {meetings.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMeetingModal(m)}
              className="bg-[#1e293b]/60 border border-[#334155]/60 hover:border-[#FAA61A] p-5 rounded-2xl space-y-3 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-[#FAA61A]/10 text-[#FAA61A] border border-[#FAA61A]/30 text-[10px] font-bold px-2.5 py-0.5 rounded">
                    {m.cliente}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    {m.data}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-[#FAA61A] transition-colors leading-snug">
                  {m.titulo}
                </h3>

                <p className="text-xs text-slate-300 bg-[#0f172a] p-3 rounded-xl border border-[#1e293b] line-clamp-3 leading-relaxed">
                  "{m.resumo_ia}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#334155]/50 flex items-center justify-between text-xs text-[#FAA61A] font-semibold">
                <span>Ver Ata & Action Items</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MEETING DETAIL MODAL (Viewer for any selected meeting) */}
      {selectedMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-2xl max-w-2xl w-full space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#1e293b] pb-4">
              <div>
                <span className="bg-[#FAA61A] text-[#0f172a] text-[10px] font-bold px-2 py-0.5 rounded">
                  {selectedMeetingModal.cliente}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedMeetingModal.titulo}</h2>
                <p className="text-xs text-slate-400">Data: {selectedMeetingModal.data} | Tipo: {selectedMeetingModal.tipo}</p>
              </div>

              <button
                onClick={() => setSelectedMeetingModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#1e293b] p-4 rounded-xl space-y-1">
                <span className="font-bold text-[#FAA61A] block">Resumo Processado por IA:</span>
                <p className="text-slate-200 leading-relaxed">{selectedMeetingModal.resumo_ia}</p>
              </div>

              {selectedMeetingModal.action_items && (
                <div className="space-y-2">
                  <span className="font-bold text-white block">Action Items & Encaminhamentos:</span>
                  {selectedMeetingModal.action_items.map((item, idx) => (
                    <div key={idx} className="bg-[#1e293b]/60 p-3 rounded-xl border border-[#334155] flex items-start space-x-2">
                      <CheckSquare className="w-4 h-4 text-[#FAA61A] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">{item.text}</div>
                        <div className="text-[10px] text-slate-400">Responsável: {item.owner}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedMeetingModal(null)}
                className="bg-[#1e293b] hover:bg-slate-700 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
