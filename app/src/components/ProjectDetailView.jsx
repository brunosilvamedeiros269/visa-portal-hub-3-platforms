import React, { useState } from 'react';
import { ArrowLeft, Clock, FileText, AlertTriangle, Layers, Calendar, User, Sparkles, Plus, Edit3, Globe } from 'lucide-react';
import { renderStatusBadge } from './DashboardView';
import ProjectDescription from './ProjectDescription';

export default function ProjectDetailView({ project, meetings, onBack, onOpenIngestion, onOpenAddTrack, onOpenEditClient }) {
  const [activeSubTab, setActiveSubTab] = useState('tracks'); // 'tracks' | 'reunioes'
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('Todas');

  if (!project) return null;

  const projectMeetings = meetings.filter(m => m.projeto_id === project.id || m.cliente === project.cliente);

  const filteredTracks = (project.tracks || []).filter(t => {
    if (selectedTrackFilter === 'Produtos') return t.tipo === 'Produto';
    if (selectedTrackFilter === 'Mandatos') return t.tipo === 'Mandato';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <button onClick={onBack} className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Dashboard</span>
        </button>
        <span>/</span>
        <span>Clientes no Cone Sul</span>
        <span>/</span>
        <span className="text-[#FAA61A] font-semibold">{project.cliente}</span>
      </div>

      {/* Project Executive Header Card */}
      <div className="bg-[#122131] border border-[#273647] p-6 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#273647] pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xl">{project.logo || '🌎'}</span>
              <span className="bg-[#1A1F71] text-xs font-bold text-blue-200 px-3 py-1 rounded-lg border border-blue-500/30">
                {project.cliente}
              </span>
              <span className="bg-[#051424] text-xs font-semibold text-slate-300 px-2.5 py-1 rounded-lg border border-[#273647] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                {project.pais || 'Brasil'}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${renderStatusBadge(project.status)}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                {project.status}
              </span>
              <span className="bg-[#1C2B3C] text-[#FAA61A] text-xs font-semibold px-2.5 py-0.5 rounded">
                {(project.tracks || []).length} Tracks Ativas
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white mt-2">{project.titulo}</h1>
            <ProjectDescription description={project.descricao} className="max-w-3xl" />
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center">
            <button
              onClick={() => onOpenEditClient(project)}
              className="bg-[#1C2B3C] hover:bg-[#1A1F71] text-white border border-[#273647] font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Edit3 className="w-4 h-4 text-[#FAA61A]" />
              <span>Editar Cliente & Tracks</span>
            </button>

            <button
              onClick={onOpenIngestion}
              className="bg-[#FAA61A] hover:bg-[#E59510] text-[#0A142F] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg"
            >
              + Ingerir Ata / Doc
            </button>
          </div>
        </div>

        {/* Meta Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Gerente de Projetos Visa</span>
            <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
              <User className="w-3.5 h-3.5 text-[#FAA61A]" />
              {project.gerente_visa} (Client PM)
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">Data de Início</span>
            <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {project.data_inicio}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">Progresso Geral Macro</span>
            <span className="font-semibold text-amber-300 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {project.progresso}% Concluído
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">Região de Atuação</span>
            <span className="font-semibold text-slate-200 block truncate mt-0.5">
              Cone Sul ({project.pais})
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Tracks & Meetings), Right Column (Key Decisions & Team) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#122131] border border-[#273647] rounded-2xl p-6 space-y-6">
            
            {/* Sub-tabs header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#273647] pb-3 gap-3">
              <div className="flex space-x-6 text-xs font-semibold">
                <button
                  onClick={() => setActiveSubTab('tracks')}
                  className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeSubTab === 'tracks' ? 'border-[#FAA61A] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#FAA61A]" />
                  <span>Tracks de Trabalho ({(project.tracks || []).length})</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('reunioes')}
                  className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeSubTab === 'reunioes' ? 'border-[#FAA61A] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Atas & Ingestões ({projectMeetings.length})</span>
                </button>
              </div>

              {activeSubTab === 'tracks' && (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1 text-[11px]">
                    <button
                      onClick={() => setSelectedTrackFilter('Todas')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedTrackFilter === 'Todas' ? 'bg-[#FAA61A] text-[#0A142F] font-bold' : 'bg-[#1C2B3C] text-slate-400'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setSelectedTrackFilter('Produtos')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedTrackFilter === 'Produtos' ? 'bg-[#FAA61A] text-[#0A142F] font-bold' : 'bg-[#1C2B3C] text-slate-400'
                      }`}
                    >
                      Produtos
                    </button>
                    <button
                      onClick={() => setSelectedTrackFilter('Mandatos')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedTrackFilter === 'Mandatos' ? 'bg-[#FAA61A] text-[#0A142F] font-bold' : 'bg-[#1C2B3C] text-slate-400'
                      }`}
                    >
                      Mandatos
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenEditClient(project)}
                    className="bg-[#1A1F71] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FAA61A]" />
                    <span>+ Track</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: Tracks List */}
            {activeSubTab === 'tracks' && (
              <div className="space-y-4">
                {filteredTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-[#1C2B3C] border border-[#273647] p-5 rounded-xl space-y-4 hover:border-[#FAA61A]/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              track.tipo === 'Mandato'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : track.tipo === 'Produto'
                                ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                                : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            }`}
                          >
                            {track.tipo === 'Produto' ? '📦 Produto' : track.tipo === 'Mandato' ? '📋 Mandato' : '⚙️ Outro'}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${renderStatusBadge(track.status)}`}>
                            {track.status}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white mt-1.5">{track.nome}</h3>
                      </div>

                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-slate-400">Progresso: <strong className="text-amber-300">{track.progresso}%</strong></span>
                        <button
                          onClick={() => onOpenEditClient(project)}
                          className="text-slate-400 hover:text-[#FAA61A] text-xs p-1"
                          title="Editar esta track"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#051424] rounded-full h-2 overflow-hidden border border-[#273647]">
                      <div
                        className="bg-[#FAA61A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${track.progresso}%` }}
                      ></div>
                    </div>

                    {/* Track Details Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-[#273647]/50">
                      <span className="text-slate-400">
                        Responsável: <strong className="text-slate-200">{track.responsavel || 'Equipe Visa / Cliente'}</strong>
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Próximo Marco: <strong className="text-slate-200">{track.proximo_marco}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Reuniões List */}
            {activeSubTab === 'reunioes' && (
              <div className="space-y-4">
                {projectMeetings.map((m) => (
                  <div key={m.id} className="bg-[#1C2B3C] border border-[#273647] p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#1A1F71] text-blue-200 px-2.5 py-0.5 rounded font-semibold text-[11px]">
                          {m.tipo}
                        </span>
                        {m.track_nome && (
                          <span className="bg-[#FAA61A]/10 text-[#FAA61A] border border-[#FAA61A]/30 text-[10px] px-2 py-0.5 rounded font-medium">
                            {m.track_nome}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400">{m.data}</span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug">{m.titulo}</h3>

                    <div className="bg-[#122131] border border-[#273647] p-3 rounded-lg text-xs text-slate-300 space-y-1">
                      <div className="flex items-center gap-1 text-[#FAA61A] text-[11px] font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Resumo da IA:</span>
                      </div>
                      <p className="leading-relaxed text-[11px]">{m.resumo_ia}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Decisões Chave */}
          <div className="bg-[#122131] border border-[#273647] p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#273647] pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Decisões Chave & Arquitetura
            </h3>

            <div className="bg-[#1C2B3C] border-l-4 border-[#FAA61A] p-4 rounded-r-xl space-y-2 text-xs">
              <div className="font-bold text-white">Tratamento de Mensageria ISO 8583</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Validação das mensagens de autorização e envio de cryptograms EMV no ambiente de certificação CTE.
              </p>
            </div>
          </div>

          {/* Equipe do Cliente */}
          <div className="bg-[#122131] border border-[#273647] p-6 rounded-2xl space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white border-b border-[#273647] pb-3">Equipe Envolvida ({project.pais})</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Bruno (Visa)</span>
                <span className="font-semibold text-white">PM Lead Visa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Equipe Técnica {project.cliente}</span>
                <span className="font-semibold text-white">Líderes de TI</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
