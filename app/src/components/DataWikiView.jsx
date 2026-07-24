import React, { useState } from 'react';
import { Database, Plus, Search, Tag, Code, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DataWikiView({ dataTerms, onAddDataTerm }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTerm, setNewTerm] = useState({ termo: '', categoria: 'Tokenização', formato: '', exemplo: '', definicao: '' });

  const categories = ['all', 'Tokenização', 'Mensageria', 'Segurança', 'Liquidação'];

  const filteredTerms = dataTerms.filter(t => {
    const matchesCat = selectedCategory === 'all' || t.categoria === selectedCategory;
    const matchesSearch = t.termo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.definicao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateTerm = (e) => {
    e.preventDefault();
    if (!newTerm.termo.trim()) return;
    onAddDataTerm({
      ...newTerm,
      id: `dt-${Date.now()}`
    });
    setNewTerm({ termo: '', categoria: 'Tokenização', formato: '', exemplo: '', definicao: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">{t('dataWikiTitle')}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">
              Supabase Metadata Store
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {t('dataWikiSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newTerm')}</span>
        </button>
      </div>


      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'Todos os Termos' : cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar por termo ou definição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map(term => (
          <div key={term.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3 shadow-md">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-slate-100">{term.termo}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-medium">
                {term.categoria}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{term.definicao}</p>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Formato / Tipo:</span>
                <span className="text-slate-300 font-mono font-semibold">{term.formato}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Exemplo / Payload:</span>
                <span className="text-indigo-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block truncate max-w-full">
                  {term.exemplo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Termo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Cadastrar Termo Técnico / Schema</h3>
            <form onSubmit={handleCreateTerm} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nome do Termo / Campo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TRID (Token Requestor ID)"
                  value={newTerm.termo}
                  onChange={e => setNewTerm({...newTerm, termo: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Categoria</label>
                  <select
                    value={newTerm.categoria}
                    onChange={e => setNewTerm({...newTerm, categoria: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Tokenização">Tokenização</option>
                    <option value="Mensageria">Mensageria</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Liquidação">Liquidação</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Formato / Tipo</label>
                  <input
                    type="text"
                    placeholder="Ex: String (11 dígitos)"
                    value={newTerm.formato}
                    onChange={e => setNewTerm({...newTerm, formato: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Exemplo / Exemplo de Valor</label>
                <input
                  type="text"
                  placeholder="Ex: 40297100001"
                  value={newTerm.exemplo}
                  onChange={e => setNewTerm({...newTerm, exemplo: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Definição Técnica</label>
                <textarea
                  rows="3"
                  placeholder="Explicação detalhada do significado e aplicação..."
                  value={newTerm.definicao}
                  onChange={e => setNewTerm({...newTerm, definicao: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Cadastrar Termo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
