import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TrackingView from './components/TrackingView';
import ProjectsView from './components/ProjectsView';
import WikiShelvesView from './components/WikiShelvesView';
import DataWikiView from './components/DataWikiView';
import FreeHostingGuideModal from './components/FreeHostingGuideModal';
import { LanguageProvider } from './context/LanguageContext';

import { 
  initialProjectsMacro, 
  initialShelves, 
  initialDataTerms 
} from './mockData';

import { 
  fetchProjectsMacroSupabase, 
  saveProjectMacroSupabase,
  fetchShelvesSupabase,
  saveShelfSupabase,
  fetchDataTermsSupabase,
  saveDataTermSupabase
} from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('tracking');
  const [projects, setProjects] = useState(initialProjectsMacro);
  const [shelves, setShelves] = useState(initialShelves);
  const [dataTerms, setDataTerms] = useState(initialDataTerms);
  const [selectedShelfId, setSelectedShelfId] = useState(null);
  const [isHostingGuideOpen, setIsHostingGuideOpen] = useState(false);

  // Carregar dados do Supabase ao iniciar
  useEffect(() => {
    async function loadSupabaseData() {
      const dbProjects = await fetchProjectsMacroSupabase();
      if (dbProjects && dbProjects.length > 0) {
        // Garantir subprojetos mock se não houver
        const merged = dbProjects.map(p => {
          const matchMock = initialProjectsMacro.find(m => m.id === p.id || m.openproject_id === p.openproject_id);
          let rawSub = p.subprojetos;
          if (typeof rawSub === 'string') {
            try { rawSub = JSON.parse(rawSub); } catch(e) {}
          }
          const validSub = (Array.isArray(rawSub) && rawSub.length > 0) ? rawSub : (matchMock ? matchMock.subprojetos : []);
          return {
            ...p,
            subprojetos: validSub
          };
        });
        setProjects(merged);
      }

      const dbShelves = await fetchShelvesSupabase();
      if (dbShelves && dbShelves.length > 0) {
        setShelves(dbShelves);
      }

      const dbTerms = await fetchDataTermsSupabase();
      if (dbTerms && dbTerms.length > 0) {
        setDataTerms(dbTerms);
      }
    }

    loadSupabaseData();
  }, []);

  // Handlers
  const handleAddProject = async (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    await saveProjectMacroSupabase(newProject);

    // Criar automaticamente uma Estante de Projeto correspondente no BookStack
    const newShelf = {
      id: `shelf-${Date.now()}`,
      nome: `Estante: Documentação ${newProject.cliente}`,
      tipo: 'projeto',
      projeto_id: newProject.id,
      descricao: `Documentação oficial e arquivos do projeto ${newProject.titulo}.`,
      icone: 'FolderGit2',
      cor: 'border-blue-500/30 bg-blue-500/5',
      livros: [
        {
          id: `book-${Date.now()}-1`,
          nome: `Arquitetura & Setup — ${newProject.cliente}`,
          descricao: 'Manual de integrações e requisitos técnicos.',
          paginas: [
            {
              id: `pg-${Date.now()}-1`,
              titulo: 'Introdução e Escopo do Projeto',
              conteudo: `# Escopo do Projeto ${newProject.titulo}\n\nEste documento detalha o setup inicial e participantes para ${newProject.cliente}.`
            }
          ]
        }
      ]
    };

    setShelves(prev => [newShelf, ...prev]);
    await saveShelfSupabase(newShelf);
  };

  const handleAddShelf = async (newShelf) => {
    setShelves(prev => [newShelf, ...prev]);
    await saveShelfSupabase(newShelf);
  };

  const handleAddDataTerm = async (newTerm) => {
    setDataTerms(prev => [newTerm, ...prev]);
    await saveDataTermSupabase(newTerm);
  };

  const handleSelectShelfFromProject = (shelfId) => {
    setSelectedShelfId(shelfId);
    setActiveTab('shelves');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
        
        {/* Header Fixo */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openHostingGuide={() => setIsHostingGuideOpen(true)}
        />

        {/* Conteúdo Principal */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'tracking' && (
            <TrackingView />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              shelves={shelves}
              onAddProject={handleAddProject}
              onSelectShelf={handleSelectShelfFromProject}
            />
          )}

          {activeTab === 'shelves' && (
            <WikiShelvesView
              shelves={shelves}
              projects={projects}
              selectedShelfId={selectedShelfId}
              onAddShelf={handleAddShelf}
            />
          )}

          {activeTab === 'data' && (
            <DataWikiView
              dataTerms={dataTerms}
              onAddDataTerm={handleAddDataTerm}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>Visa Portal Hub — 3-Platforms Enterprise Architecture</span>
            <span className="font-mono text-[11px] text-slate-600">OpenProject (:8082) • BookStack (:8080) • Supabase Cloud</span>
          </div>
        </footer>

        {/* Modal de Guia de Hospedagem Web Gratuita */}
        <FreeHostingGuideModal
          isOpen={isHostingGuideOpen}
          onClose={() => setIsHostingGuideOpen(false)}
        />

      </div>
    </LanguageProvider>
  );
}
