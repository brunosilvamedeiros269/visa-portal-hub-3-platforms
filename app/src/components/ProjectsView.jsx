import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  Layers, 
  Clock, 
  User, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';

export default function ProjectsView({ 
  projects, 
  shelves, 
  onAddProject, 
  onAddSubproject,
  onSelectShelf 
}) {
  const [expandedProjects, setExpandedProjects] = useState({ 'op-macro-01': true, 'op-macro-02': true });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ titulo: '', cliente: '', pais: 'Brasil', bandeira: '🇧🇷', descricao: '' });

  const toggleExpand = (id) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.titulo.trim()) return;
    onAddProject({
      ...newProject,
      id: `op-macro-${Date.now()}`,
      openproject_id: Math.floor(100 + Math.random() * 900),
      status: 'Em Progresso',
      gerente: 'Bruno',
      progresso: 10,
      data_inicio: new Date().toISOString().split('T')[0],
      data_fim: '2026-12-31',
      subprojetos: []
    });
    setNewProject({ titulo: '', cliente: '', pais: 'Brasil', bandeira: '🇧🇷', descricao: '' });
    setShowAddModal(false);
  };

  const filteredProjects = projects.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Info bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FolderGit2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Gestão Macro de Projetos & Subprojetos</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">
              OpenProject Integration
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Gerencie iniciativas macro da Visa e navegue pela árvore de subprojetos técnicos e entregáveis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:8082"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Abrir OpenProject Local (:8082)</span>
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Projeto Macro</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome do projeto ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Exibindo {filteredProjects.length} Projetos Macro
        </div>
      </div>

      {/* Project Cards List */}
      <div className="space-y-4">
        {filteredProjects.map((proj) => {
          const isExpanded = expandedProjects[proj.id];
          const linkedShelf = shelves.find(s => s.id === proj.estante_id || s.projeto_id === proj.id);

          return (
            <div key={proj.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700/80 shadow-md">
              
              {/* Header do Card Macro */}
              <div className="p-5 flex items-start justify-between gap-4 border-b border-slate-800/60 bg-slate-900/40">
                <div className="flex items-start gap-3">
                  <button 
                    onClick={() => toggleExpand(proj.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors mt-0.5"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{proj.bandeira}</span>
                      <h3 className="font-bold text-slate-100 text-base">{proj.titulo}</h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {proj.cliente}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        proj.status === 'Em Progresso' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">{proj.descricao}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Gerente: <strong className="text-slate-300">{proj.gerente}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Prazo: {proj.data_inicio} até {proj.data_fim}</span>
                      </div>
                      {linkedShelf && (
                        <button 
                          onClick={() => onSelectShelf(linkedShelf.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs border border-blue-500/20 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Ver Estante da Wiki</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Circle & OpenProject ID */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono">OP ID: #{proj.openproject_id}</span>
                  <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${proj.progresso}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">{proj.progresso}% Concluído</span>
                </div>
              </div>

              {/* Subprojetos (Micro) Lista */}
              {isExpanded && (
                <div className="p-5 bg-slate-950/40 space-y-3 border-t border-slate-800/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" /> Subprojetos Técnicos ({proj.subprojetos.length})
                    </span>
                  </div>

                  {proj.subprojetos.length === 0 ? (
                    <div className="text-xs text-slate-500 py-3 italic">Nenhum subprojeto registrado ainda neste projeto macro.</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {proj.subprojetos.map((sub) => (
                        <div key={sub.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-4 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-200">{sub.titulo}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                                <span>Responsável: <strong className="text-slate-300">{sub.responsavel}</strong></span>
                                <span>•</span>
                                <span>Entregável: <span className="text-blue-400">{sub.entregavel}</span></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
                              {sub.status}
                            </span>
                            <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${sub.progresso}%` }}></div>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono w-8 text-right">{sub.progresso}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Modal Criar Projeto Macro */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Criar Novo Projeto Macro (OpenProject)</h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Título do Projeto Macro</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Programa Habilitação Tokenização Bradesco"
                  value={newProject.titulo}
                  onChange={e => setNewProject({...newProject, titulo: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Cliente / Emissor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Banco Bradesco"
                    value={newProject.cliente}
                    onChange={e => setNewProject({...newProject, cliente: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">País</label>
                  <select
                    value={newProject.pais}
                    onChange={e => {
                      const flags = { Brasil: '🇧🇷', Argentina: '🇦🇷', Chile: '🇨🇱', Uruguai: '🇺🇾', Paraguai: '🇵🇾' };
                      setNewProject({...newProject, pais: e.target.value, bandeira: flags[e.target.value] || '🌐'});
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Brasil">Brasil 🇧🇷</option>
                    <option value="Argentina">Argentina 🇦🇷</option>
                    <option value="Chile">Chile 🇨🇱</option>
                    <option value="Uruguai">Uruguai 🇺🇾</option>
                    <option value="Paraguai">Paraguai 🇵🇾</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Descrição</label>
                <textarea
                  rows="3"
                  placeholder="Resumo do projeto macro e objetivos estratégicos..."
                  value={newProject.descricao}
                  onChange={e => setNewProject({...newProject, descricao: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30"
                >
                  Criar no OpenProject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
