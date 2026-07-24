import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  FolderGit2, 
  Globe, 
  ShieldCheck, 
  FileText, 
  Book, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WikiShelvesView({ 
  shelves, 
  projects, 
  selectedShelfId, 
  onAddShelf,
  onAddBookToShelf 
}) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState('all'); // 'all', 'geral', 'projeto'
  const [activeShelfId, setActiveShelfId] = useState(selectedShelfId || shelves[0]?.id);
  const [activeBookId, setActiveBookId] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddShelfModal, setShowAddShelfModal] = useState(false);
  const [newShelf, setNewShelf] = useState({ nome: '', tipo: 'geral', projeto_id: '', descricao: '' });

  const filteredShelves = shelves.filter(shelf => {
    const matchesFilter = filterType === 'all' || shelf.tipo === filterType;
    const matchesSearch = shelf.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          shelf.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeShelf = shelves.find(s => s.id === activeShelfId) || shelves[0];

  const handleCreateShelf = (e) => {
    e.preventDefault();
    if (!newShelf.nome.trim()) return;

    onAddShelf({
      ...newShelf,
      id: `shelf-${Date.now()}`,
      icone: newShelf.tipo === 'geral' ? 'BookOpen' : 'FolderGit2',
      cor: newShelf.tipo === 'geral' ? 'border-amber-500/30 bg-amber-500/5' : 'border-blue-500/30 bg-blue-500/5',
      livros: []
    });

    setNewShelf({ nome: '', tipo: 'geral', projeto_id: '', descricao: '' });
    setShowAddShelfModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">{t('wikiTitle')}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
              BookStack Architecture
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {t('wikiSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:8080"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('openBookStackLocal')}</span>
          </a>

          <button
            onClick={() => setShowAddShelfModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newShelf')}</span>
          </button>
        </div>
      </div>


      {/* Filter Tabs (Estantes Gerais vs Estantes de Projetos) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              filterType === 'all' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas as Estantes ({shelves.length})
          </button>

          <button
            onClick={() => setFilterType('geral')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              filterType === 'geral' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Estantes Gerais ({shelves.filter(s => s.tipo === 'geral').length})</span>
          </button>

          <button
            onClick={() => setFilterType('projeto')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              filterType === 'projeto' ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Estantes de Projetos ({shelves.filter(s => s.tipo === 'projeto').length})</span>
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Filtrar estantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Grid: Left Shelves Navigation, Right Books & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Shelves List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Estantes de Conhecimento</span>
            <span className="text-[10px] text-slate-500 font-mono">BookStack Shelves</span>
          </h2>

          <div className="space-y-2.5">
            {filteredShelves.map((shelf) => {
              const isSelected = shelf.id === activeShelfId;
              const isGeral = shelf.tipo === 'geral';

              return (
                <div
                  key={shelf.id}
                  onClick={() => {
                    setActiveShelfId(shelf.id);
                    setActiveBookId(null);
                    setActivePage(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20' 
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${shelf.cor || 'bg-slate-800 text-slate-300'}`}>
                        {isGeral ? <Globe className="w-4 h-4 text-amber-400" /> : <FolderGit2 className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100">{shelf.nome}</h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          isGeral ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {isGeral ? '🌐 Estante Geral' : '📁 Estante de Projeto'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{shelf.descricao}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{shelf.livros.length} Livros inclusos</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Books & Document Pages inside Active Shelf */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          {activeShelf ? (
            <div>
              {/* Shelf Header */}
              <div className="pb-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-100">{activeShelf.nome}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono ${
                      activeShelf.tipo === 'geral' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {activeShelf.tipo === 'geral' ? 'Informação Geral' : 'Projeto Específico'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{activeShelf.descricao}</p>
                </div>
              </div>

              {/* Books List inside Shelf */}
              <div className="mt-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Book className="w-3.5 h-3.5 text-emerald-400" /> Livros da Estante ({activeShelf.livros.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeShelf.livros.map((book) => (
                    <div 
                      key={book.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        activeBookId === book.id 
                          ? 'bg-slate-800 border-emerald-500/60' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Book className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-slate-200">{book.nome}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{book.descricao}</p>

                      <div className="space-y-1.5 border-t border-slate-800/80 pt-2.5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Páginas:</span>
                        {book.paginas.map((pg) => (
                          <button
                            key={pg.id}
                            onClick={() => {
                              setActiveBookId(book.id);
                              setActivePage(pg);
                            }}
                            className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                              activePage?.id === pg.id 
                                ? 'bg-emerald-600 text-white font-medium' 
                                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate">{pg.titulo}</span>
                            <ChevronRight className="w-3 h-3 shrink-0 opacity-70" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Page Content Reader */}
                {activePage && (
                  <div className="mt-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-base font-bold text-emerald-400">{activePage.titulo}</h3>
                      <span className="text-[10px] text-slate-500 font-mono">BookStack Document Reader</span>
                    </div>

                    <div className="prose prose-invert max-w-none text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {activePage.conteudo}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">Selecione uma estante ao lado para visualizar os livros e documentos.</div>
          )}
        </div>

      </div>

      {/* Modal Criar Nova Estante (Geral ou Projeto) */}
      {showAddShelfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Criar Nova Estante no BookStack</h3>
            <form onSubmit={handleCreateShelf} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nome da Estante</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Estante Geral: Padrões de Segurança PCI & ISO"
                  value={newShelf.nome}
                  onChange={e => setNewShelf({...newShelf, nome: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tipo de Estante</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewShelf({...newShelf, tipo: 'geral', projeto_id: ''})}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      newShelf.tipo === 'geral' 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Globe className="w-4 h-4 text-amber-400" />
                      <span>Estante Geral</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal">Informações gerais não vinculadas a um projeto específico.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewShelf({...newShelf, tipo: 'projeto'})}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      newShelf.tipo === 'projeto' 
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-bold' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <FolderGit2 className="w-4 h-4 text-blue-400" />
                      <span>Estante de Projeto</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal">Estante de documentação associada a um Projeto Macro.</p>
                  </button>
                </div>
              </div>

              {newShelf.tipo === 'projeto' && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Projeto Macro Associado</label>
                  <select
                    value={newShelf.projeto_id}
                    onChange={e => setNewShelf({...newShelf, projeto_id: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Selecione o Projeto...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.titulo} ({p.cliente})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Descrição</label>
                <textarea
                  rows="3"
                  placeholder="Finalidade e conteúdos cobertos por esta estante..."
                  value={newShelf.descricao}
                  onChange={e => setNewShelf({...newShelf, descricao: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddShelfModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30"
                >
                  Criar Estante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
