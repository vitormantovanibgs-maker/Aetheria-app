```react
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Brain, 
  Clock, 
  Grid, 
  CheckSquare, 
  Activity, 
  Plus, 
  Search, 
  Trash2, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  Share2, 
  Zap, 
  ShieldAlert, 
  Tag, 
  Layers, 
  ChevronRight, 
  Smartphone, 
  Globe, 
  FileText, 
  Key, 
  Link as LinkIcon, 
  Lightbulb, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flame, 
  Cpu, 
  RefreshCw, 
  X, 
  Eye, 
  EyeOff,
  Pin,
  MoveRight,
  Maximize2,
  HardDrive,
  Copy,
  Check,
  Wand2,
  HelpCircle,
  BarChart3
} from 'lucide-react';

// --- INITIAL DUMMY DATA ---
const INITIAL_MEMORIES = [
  {
    id: 'mem-1',
    title: 'Arquitetura Neural Distributed Cosmos',
    content: 'Estrutura baseada em microsserviços orientados a eventos para garantir alta disponibilidade e latência mínima em redes globais. Implementar WebSockets no gateway.',
    type: 'note',
    category: 'Code',
    tags: ['Arquitetura', 'Cloud', 'Microservices'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isEncrypted: false,
    pinned: true
  },
  {
    id: 'mem-2',
    title: 'Estratégia de Alta Performance no Futsal',
    content: 'Foco na transição rápida 3-1, movimentação em pivô e pressão alta no primeiro terço de quadra nos primeiros 10 minutos para forçar erro do adversário.',
    type: 'note',
    category: 'Work',
    tags: ['Futsal', 'Tática', 'Treino'],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    isEncrypted: false,
    pinned: true
  },
  {
    id: 'mem-3',
    title: 'Repositório de Prompts IA Generativa',
    content: 'https://github.com/aetheria/awesome-prompts-vault',
    type: 'link',
    category: 'Ideas',
    tags: ['AI', 'GitHub', 'Recursos'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    isEncrypted: false,
    pinned: false
  },
  {
    id: 'mem-4',
    title: 'Chave Mestra do Cofre Secundário',
    content: 'AETH-9842-X771-PL99-SECURE-KEY-2026',
    type: 'secret',
    category: 'Personal',
    tags: ['Segurança', 'Cofre'],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    isEncrypted: true,
    pinned: false
  }
];

const INITIAL_NODES = [
  { id: 'node-1', label: 'AETHERIA CORE', x: 260, y: 160, category: 'Code' },
  { id: 'node-2', label: 'Neural Engine', x: 110, y: 280, category: 'Code' },
  { id: 'node-3', label: 'Estratégia Esportiva', x: 420, y: 260, category: 'Work' },
  { id: 'node-4', label: 'Visão 2030', x: 280, y: 390, category: 'Ideas' },
  { id: 'node-5', label: 'Rotina de Estudos', x: 120, y: 90, category: 'Daily' }
];

const INITIAL_CONNECTIONS = [
  { from: 'node-1', to: 'node-2' },
  { from: 'node-1', to: 'node-3' },
  { from: 'node-1', to: 'node-4' },
  { from: 'node-1', to: 'node-5' }
];

const INITIAL_CAPSULES = [
  {
    id: 'cap-1',
    title: 'Visão do Futuro & Lançamento Global',
    content: 'Se você está lendo isso, o AETHERIA se tornou um ecossistema completo de gestão do conhecimento pessoal. Continue expandindo sua mente!',
    unlockDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    createdAt: new Date().toISOString(),
    isLocked: true
  },
  {
    id: 'cap-2',
    title: 'Carta de Objetivos Alcançados',
    content: 'Lembre-se de manter a consistência diária nos seus treinos, leituras e no desenvolvimento de software.',
    unlockDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    isLocked: false
  }
];

const INITIAL_TASKS = [
  { id: 't-1', text: 'Finalizar a documentação da API do Aetheria', quadrant: 'do_first', completed: false },
  { id: 't-2', text: 'Planejar rotina de treino tático', quadrant: 'schedule', completed: true },
  { id: 't-3', text: 'Organizar downloads da área de trabalho', quadrant: 'delegate', completed: false },
  { id: 't-4', text: 'Limpar arquivos temporários do sistema', quadrant: 'dont_do', completed: true }
];

const INITIAL_HABITS = [
  { id: 'h-1', name: 'Leitura Técnica & Artigos (30m)', streak: 14, completedToday: true, history: [true, true, true, false, true, true, true] },
  { id: 'h-2', name: 'Treino de Condicionamento / Futsal', streak: 6, completedToday: false, history: [true, true, false, true, true, true, false] },
  { id: 'h-3', name: 'Revisão e Registro no Cofre', streak: 21, completedToday: true, history: [true, true, true, true, true, true, true] }
];

export default function App() {
  // Active Tab View
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Quick Brain Dump modal / drawer state
  const [isQuickDumpOpen, setIsQuickDumpOpen] = useState(false);
  const [quickDumpText, setQuickDumpText] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);

  // Data persistence from LocalStorage
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('aetheria_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem('aetheria_nodes');
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  });

  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('aetheria_connections');
    return saved ? JSON.parse(saved) : INITIAL_CONNECTIONS;
  });

  const [capsules, setCapsules] = useState(() => {
    const saved = localStorage.getItem('aetheria_capsules');
    return saved ? JSON.parse(saved) : INITIAL_CAPSULES;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('aetheria_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('aetheria_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  // Sync state to LocalStorage
  useEffect(() => { localStorage.setItem('aetheria_memories', JSON.stringify(memories)); }, [memories]);
  useEffect(() => { 
    localStorage.setItem('aetheria_nodes', JSON.stringify(nodes));
    localStorage.setItem('aetheria_connections', JSON.stringify(connections));
  }, [nodes, connections]);
  useEffect(() => { localStorage.setItem('aetheria_capsules', JSON.stringify(capsules)); }, [capsules]);
  useEffect(() => { localStorage.setItem('aetheria_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('aetheria_habits', JSON.stringify(habits)); }, [habits]);

  // Form states
  const [newMemory, setNewMemory] = useState({ title: '', content: '', type: 'note', category: 'Ideas', tags: '' });
  const [newCapsule, setNewCapsule] = useState({ title: '', content: '', unlockDays: 7 });
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskQuadrant, setNewTaskQuadrant] = useState('do_first');
  const [newHabitName, setNewHabitName] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState({});

  // Canvas interaction
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [draggedNode, setDraggedNode] = useState(null);
  const canvasRef = useRef(null);

  // Copy indicator state
  const [copiedId, setCopiedId] = useState(null);

  // Live Timer tick for countdown updates
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Automatic AI tag simulator on quick dump typing
  useEffect(() => {
    if (!quickDumpText) {
      setSuggestedTags([]);
      return;
    }
    const txt = quickDumpText.toLowerCase();
    const tags = [];
    if (txt.includes('código') || txt.includes('api') || txt.includes('bug') || txt.includes('react') || txt.includes('tech')) tags.push('Code');
    if (txt.includes('treino') || txt.includes('futsal') || txt.includes('saúde') || txt.includes('corrida')) tags.push('Sports');
    if (txt.includes('idéia') || txt.includes('projeto') || txt.includes('criar') || txt.includes('app')) tags.push('Ideas');
    if (txt.includes('urgente') || txt.includes('hoje') || txt.includes('meta')) tags.push('Work');
    if (tags.length === 0) tags.push('Insights');
    setSuggestedTags(tags);
  }, [quickDumpText]);

  // Handlers for Memory
  const handleAddMemory = (e) => {
    e?.preventDefault();
    if (!newMemory.title.trim()) return;

    const created = {
      id: `mem-${Date.now()}`,
      title: newMemory.title,
      content: newMemory.content,
      type: newMemory.type,
      category: newMemory.category,
      tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      isEncrypted: newMemory.type === 'secret',
      pinned: false
    };

    setMemories([created, ...memories]);
    setNewMemory({ title: '', content: '', type: 'note', category: 'Ideas', tags: '' });
  };

  const handleQuickDumpSubmit = () => {
    if (!quickDumpText.trim()) return;
    const created = {
      id: `mem-${Date.now()}`,
      title: quickDumpText.slice(0, 35) + (quickDumpText.length > 35 ? '...' : ''),
      content: quickDumpText,
      type: 'note',
      category: suggestedTags[0] || 'Daily',
      tags: [...suggestedTags, 'BrainDump'],
      createdAt: new Date().toISOString(),
      isEncrypted: false,
      pinned: false
    };
    setMemories([created, ...memories]);
    setQuickDumpText('');
    setIsQuickDumpOpen(false);
  };

  const handleDeleteMemory = (id) => {
    setMemories(memories.filter(m => m.id !== id));
  };

  const togglePinMemory = (id) => {
    setMemories(memories.map(m => m.id === id ? { ...m, pinned: !m.pinned } : m));
  };

  const toggleSecret = (id) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handlers for Tasks
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: `t-${Date.now()}`, text: newTaskText, quadrant: newTaskQuadrant, completed: false }]);
    setNewTaskText('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Handlers for Habits
  const toggleHabitToday = (id) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const nextState = !h.completedToday;
        const newStreak = nextState ? h.streak + 1 : Math.max(0, h.streak - 1);
        const newHistory = [...(h.history || [false, false, false, false, false, false, false])];
        newHistory[newHistory.length - 1] = nextState;
        return { ...h, completedToday: nextState, streak: newStreak, history: newHistory };
      }
      return h;
    }));
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits([...habits, { 
      id: `h-${Date.now()}`, 
      name: newHabitName, 
      streak: 1, 
      completedToday: true, 
      history: [false, false, false, false, false, false, true] 
    }]);
    setNewHabitName('');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // Handlers for Capsules
  const handleAddCapsule = (e) => {
    e.preventDefault();
    if (!newCapsule.title.trim()) return;
    const unlockTime = new Date(Date.now() + newCapsule.unlockDays * 86400000).toISOString();
    setCapsules([
      ...capsules,
      {
        id: `cap-${Date.now()}`,
        title: newCapsule.title,
        content: newCapsule.content,
        unlockDate: unlockTime,
        createdAt: new Date().toISOString(),
        isLocked: true
      }
    ]);
    setNewCapsule({ title: '', content: '', unlockDays: 7 });
  };

  const deleteCapsule = (id) => {
    setCapsules(capsules.filter(c => c.id !== id));
  };

  // Canvas Handlers
  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return;
    const newNode = {
      id: `node-${Date.now()}`,
      label: newNodeLabel,
      x: 180 + Math.random() * 200,
      y: 120 + Math.random() * 180,
      category: 'Ideas'
    };
    setNodes([...nodes, newNode]);
    if (selectedNodeId) {
      setConnections([...connections, { from: selectedNodeId, to: newNode.id }]);
    }
    setNewNodeLabel('');
  };

  const handleNodeClick = (nodeId) => {
    if (selectedNodeId && selectedNodeId !== nodeId) {
      // Toggle connection
      const exists = connections.some(
        c => (c.from === selectedNodeId && c.to === nodeId) || (c.from === nodeId && c.to === selectedNodeId)
      );
      if (exists) {
        setConnections(connections.filter(c => 
          !((c.from === selectedNodeId && c.to === nodeId) || (c.from === nodeId && c.to === selectedNodeId))
        ));
      } else {
        setConnections([...connections, { from: selectedNodeId, to: nodeId }]);
      }
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
    }
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Export / Import JSON Data
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      memories, nodes, connections, capsules, tasks, habits
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aetheria_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (event) => {
    const fileReader = new FileReader();
    if (event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.memories) setMemories(parsed.memories);
          if (parsed.nodes) setNodes(parsed.nodes);
          if (parsed.connections) setConnections(parsed.connections);
          if (parsed.capsules) setCapsules(parsed.capsules);
          if (parsed.tasks) setTasks(parsed.tasks);
          if (parsed.habits) setHabits(parsed.habits);
          alert('Dados do Aetheria importados com sucesso!');
        } catch (err) {
          alert('Arquivo JSON inválido.');
        }
      };
    }
  };

  const resetAllData = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações originais do Aetheria?')) {
      setMemories(INITIAL_MEMORIES);
      setNodes(INITIAL_NODES);
      setConnections(INITIAL_CONNECTIONS);
      setCapsules(INITIAL_CAPSULES);
      setTasks(INITIAL_TASKS);
      setHabits(INITIAL_HABITS);
      localStorage.clear();
    }
  };

  // Filtered Memories memo
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
      return matchesSearch && matchesCat;
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [memories, searchQuery, selectedCategory]);

  // Helper Countdown Calculator
  const getRemainingTime = (unlockDateStr) => {
    const diff = new Date(unlockDateStr) - new Date();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500 bg-clip-text text-transparent">
                AETHERIA
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Cognitive Core
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'dashboard', label: 'Painel', icon: Activity },
              { id: 'vault', label: 'Cofre', icon: Brain },
              { id: 'canvas', label: 'Teia Synaptic', icon: Layers },
              { id: 'capsules', label: 'Cápsula do Tempo', icon: Clock },
              { id: 'matrix', label: 'Matriz Eisenhower', icon: Grid },
              { id: 'habits', label: 'Hábitos', icon: Flame },
              { id: 'export', label: 'App Sync', icon: Smartphone },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Brain Dump Floating Trigger */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsQuickDumpOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Captura Rápida</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex overflow-x-auto border-t border-blue-50 px-2 py-1.5 space-x-1 bg-white">
          {[
            { id: 'dashboard', label: 'Painel', icon: Activity },
            { id: 'vault', label: 'Cofre', icon: Brain },
            { id: 'canvas', label: 'Teia', icon: Layers },
            { id: 'capsules', label: 'Cápsula', icon: Clock },
            { id: 'matrix', label: 'Matriz', icon: Grid },
            { id: 'habits', label: 'Hábitos', icon: Flame },
            { id: 'export', label: 'Sync', icon: Smartphone },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  isActive ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* QUICK BRAIN DUMP MODAL */}
      {isQuickDumpOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-blue-100 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Captura Rápida Instantânea</h3>
                  <p className="text-xs text-slate-400">Grave um pensamento ou ideia antes que ele desapareça.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsQuickDumpOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={4}
              autoFocus
              placeholder="Digite o que está na sua mente (ex: Ideia de app, treino de futsal, bug para corrigir...)"
              value={quickDumpText}
              onChange={(e) => setQuickDumpText(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* AI Tag Suggestion */}
            {suggestedTags.length > 0 && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 font-semibold flex items-center">
                  <Sparkles className="w-3 h-3 text-sky-500 mr-1" /> Tags Inteligentes:
                </span>
                <div className="flex flex-wrap gap-1">
                  {suggestedTags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsQuickDumpOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleQuickDumpSubmit}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition"
              >
                Salvar no Cofre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: DASHBOARD & NEURAL STATS OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-10 shadow-xl shadow-blue-900/10 border border-blue-700/30">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-sky-200 border border-sky-400/30 mb-4 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sky-300" /> Núcleo Cognitivo Ativo
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
                  Sua Mente Expandida Digitalmente
                </h1>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                  Guarde conhecimentos, projete conexões sinápticas em rede, bloqueie metas no tempo e otimize sua rotina com total privacidade.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('vault')}
                    className="px-4 py-2.5 bg-white text-blue-900 rounded-xl font-bold text-xs hover:bg-blue-50 transition shadow-lg shadow-black/10 flex items-center space-x-2"
                  >
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span>Abrir Cofre</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('canvas')}
                    className="px-4 py-2.5 bg-blue-700/50 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs backdrop-blur-md border border-blue-400/30 transition flex items-center space-x-2"
                  >
                    <Layers className="w-4 h-4 text-sky-300" />
                    <span>Teia Synaptic</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Neural Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Memórias no Cofre', val: memories.length, icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Nós na Teia', val: nodes.length, icon: Layers, color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Cápsulas Seladas', val: capsules.filter(c => new Date() < new Date(c.unlockDate)).length, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Maior Sequência', val: `${Math.max(...habits.map(h => h.streak), 0)} Dias`, icon: Flame, color: 'text-amber-500', bg: 'bg-amber-50' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-2xl font-black text-slate-800 mt-0.5">{stat.val}</h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Memories */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span>Registros Recentes no Cofre</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('vault')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Ver todas <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {memories.slice(0, 4).map(mem => (
                    <div key={mem.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">
                            {mem.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(mem.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{mem.title}</h3>
                        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                          {mem.isEncrypted ? '••••••••••••••••••••' : mem.content}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {mem.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                        {mem.isEncrypted && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Habit Tracker */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span>Hábitos de Hoje</span>
                    </h2>
                    <button onClick={() => setActiveTab('habits')} className="text-xs font-semibold text-blue-600">
                      Gerenciar
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {habits.map(h => (
                      <div 
                        key={h.id} 
                        onClick={() => toggleHabitToday(h.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          h.completedToday 
                            ? 'bg-amber-50/40 border-amber-200 text-amber-900' 
                            : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {h.completedToday ? (
                            <CheckCircle2 className="w-5 h-5 text-amber-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                          <span className={`text-xs font-semibold ${h.completedToday ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {h.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                          🔥 {h.streak}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eisenhower Focus Widget */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                      <Grid className="w-5 h-5 text-blue-600" />
                      <span>Urgente e Importante</span>
                    </h2>
                    <button onClick={() => setActiveTab('matrix')} className="text-xs font-semibold text-blue-600">
                      Matriz
                    </button>
                  </div>

                  <div className="space-y-2">
                    {tasks.filter(t => t.quadrant === 'do_first').slice(0, 3).map(task => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-medium"
                      >
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => {}} 
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                        />
                        <span className={`flex-1 text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: COFRE DE MEMÓRIAS (MEMORY VAULT) */}
        {activeTab === 'vault' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header / Search Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <span>Cofre de Memórias & Base de Conhecimento</span>
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">Armazene ideias, trechos de código, notas e segredos criptografados.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar no cofre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">Todas Categorias</option>
                  <option value="Work">Work</option>
                  <option value="Ideas">Ideas</option>
                  <option value="Personal">Personal</option>
                  <option value="Code">Code</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
            </div>

            {/* Creation Form + List Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Side */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
                <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Nova Memória</span>
                </h2>

                <form onSubmit={handleAddMemory} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Título</label>
                    <input
                      type="text"
                      placeholder="Ex: Arquitetura de Software"
                      value={newMemory.title}
                      onChange={e => setNewMemory({ ...newMemory, title: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo</label>
                      <select
                        value={newMemory.type}
                        onChange={e => setNewMemory({ ...newMemory, type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="note">Nota Texto</option>
                        <option value="link">Link / URL</option>
                        <option value="secret">Chave / Segredo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Categoria</label>
                      <select
                        value={newMemory.category}
                        onChange={e => setNewMemory({ ...newMemory, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Work">Work</option>
                        <option value="Ideas">Ideas</option>
                        <option value="Personal">Personal</option>
                        <option value="Code">Code</option>
                        <option value="Daily">Daily</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Conteúdo</label>
                    <textarea
                      rows={4}
                      placeholder="Escreva detalhes, ideias ou o valor do segredo..."
                      value={newMemory.content}
                      onChange={e => setNewMemory({ ...newMemory, content: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tags (separadas por vírgula)</label>
                    <input
                      type="text"
                      placeholder="ex: React, Futsal, Estudo"
                      value={newMemory.tags}
                      onChange={e => setNewMemory({ ...newMemory, tags: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition"
                  >
                    Salvar no Cofre
                  </button>
                </form>
              </div>

              {/* Memory Cards Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMemories.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium text-sm">Nenhuma memória encontrada no cofre.</p>
                  </div>
                ) : (
                  filteredMemories.map(mem => {
                    const isSecretRevealed = revealedSecrets[mem.id];
                    return (
                      <div key={mem.id} className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between group relative ${
                        mem.pinned ? 'border-blue-400 ring-1 ring-blue-300' : 'border-slate-200/80 hover:border-blue-300'
                      }`}>
                        <div>
                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase flex items-center space-x-1">
                              {mem.type === 'link' && <LinkIcon className="w-3 h-3 mr-1" />}
                              {mem.type === 'secret' && <Key className="w-3 h-3 mr-1" />}
                              {mem.type === 'note' && <FileText className="w-3 h-3 mr-1" />}
                              <span>{mem.category}</span>
                            </span>
                            
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => togglePinMemory(mem.id)}
                                className={`p-1 transition ${mem.pinned ? 'text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}
                                title={mem.pinned ? 'Desafixar' : 'Fixar no topo'}
                              >
                                <Pin className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteMemory(mem.id)}
                                className="text-slate-300 hover:text-red-500 transition p-1"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h3 className="font-bold text-slate-800 text-base mb-2">{mem.title}</h3>

                          {/* Content Display */}
                          <div className="text-slate-600 text-xs leading-relaxed mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {mem.type === 'secret' ? (
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-semibold text-slate-800">
                                  {isSecretRevealed ? mem.content : '••••••••••••••••••••'}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => copyToClipboard(mem.content, mem.id)}
                                    className="text-slate-400 hover:text-blue-600 p-1"
                                    title="Copiar"
                                  >
                                    {copiedId === mem.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={() => toggleSecret(mem.id)}
                                    className="text-slate-400 hover:text-blue-600 p-1"
                                  >
                                    {isSecretRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            ) : mem.type === 'link' ? (
                              <a
                                href={mem.content}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline font-medium break-all flex items-center space-x-1"
                              >
                                <span>{mem.content}</span>
                              </a>
                            ) : (
                              <p className="whitespace-pre-wrap">{mem.content}</p>
                            )}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex flex-wrap gap-1">
                            {mem.tags.map((t, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <span>{new Date(mem.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: SYNAPTIC CANVAS (MIND MAP WEB) */}
        {activeTab === 'canvas' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
                  <Layers className="w-6 h-6 text-blue-600" />
                  <span>Teia Synaptic & Mapa de Conexões</span>
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">Conecte conceitos visualmente para expandir ideias e estratégias.</p>
              </div>

              {/* Add Node Controls */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Nome da ideia ou nó..."
                  value={newNodeLabel}
                  onChange={e => setNewNodeLabel(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddNode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Nó</span>
                </button>
              </div>
            </div>

            {/* Interactive Canvas Grid Area */}
            <div 
              ref={canvasRef}
              className="relative w-full h-[520px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl"
            >
              {/* Subtle Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"></div>

              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((conn, idx) => {
                  const fromNode = nodes.find(n => n.id === conn.from);
                  const toNode = nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                    />
                  );
                })}
              </svg>

              {/* Render Nodes */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-200 flex items-center space-x-2 border select-none group ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-sky-300 scale-110 shadow-blue-500/50 ring-4 ring-blue-500/30' 
                        : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:border-blue-500 hover:scale-105'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-sky-300 animate-ping' : 'bg-blue-500'}`}></div>
                    <span className="font-bold text-xs">{node.label}</span>

                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNode(node.id);
                        }}
                        className="ml-1 text-sky-200 hover:text-white p-0.5 rounded"
                        title="Excluir Nó"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Instructions Panel Overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-1.5 max-w-sm shadow-xl">
                <p className="font-bold text-sky-400 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Como usar a Teia Synaptic:
                </p>
                <p>• Clique em um nó e depois em outro para <b>conectar/desconectar</b> com linhas sinápticas.</p>
                <p>• Com um nó selecionado, crie um novo nó no menu superior para gerar uma ramificação imediata.</p>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 4: CÁPSULA DO TEMPO (TIME CAPSULE) */}
        {activeTab === 'capsules' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span>Cápsula do Tempo & Metas Seladas</span>
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">Guarde segredos, relatórios e metas que só serão revelados no futuro.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Side */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
                <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span>Selar Nova Cápsula</span>
                </h2>

                <form onSubmit={handleAddCapsule} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Título do Selo</label>
                    <input
                      type="text"
                      placeholder="Ex: Metas do Futsal e Tech para 2027"
                      value={newCapsule.title}
                      onChange={e => setNewCapsule({ ...newCapsule, title: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bloqueio (Dias a partir de hoje)</label>
                    <input
                      type="number"
                      min="1"
                      max="3650"
                      value={newCapsule.unlockDays}
                      onChange={e => setNewCapsule({ ...newCapsule, unlockDays: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mensagem Selada</label>
                    <textarea
                      rows={4}
                      placeholder="Escreva a mensagem ou meta que permanecerá ocultada..."
                      value={newCapsule.content}
                      onChange={e => setNewCapsule({ ...newCapsule, content: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition"
                  >
                    Trancar Cápsula
                  </button>
                </form>
              </div>

              {/* Capsule Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capsules.map(cap => {
                  const remaining = getRemainingTime(cap.unlockDate);
                  const isLockedNow = remaining !== null;

                  return (
                    <div 
                      key={cap.id} 
                      className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                        isLockedNow 
                          ? 'bg-slate-900 text-white border-slate-800 shadow-xl' 
                          : 'bg-white text-slate-800 border-emerald-200 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center space-x-1 uppercase ${
                            isLockedNow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isLockedNow ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                            <span>{isLockedNow ? 'Bloqueada' : 'Revelada'}</span>
                          </span>

                          <button 
                            onClick={() => deleteCapsule(cap.id)}
                            className="text-slate-500 hover:text-red-400 p-1"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h3 className="text-base font-bold mb-3">{cap.title}</h3>

                        {isLockedNow ? (
                          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                            <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider text-center">
                              ⏳ Revelação em Contagem Regressiva:
                            </p>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div className="bg-slate-900 p-2 rounded-lg">
                                <span className="text-base font-black text-white">{remaining.days}</span>
                                <p className="text-[9px] text-slate-400 uppercase">Dias</p>
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg">
                                <span className="text-base font-black text-white">{remaining.hours}</span>
                                <p className="text-[9px] text-slate-400 uppercase">Horas</p>
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg">
                                <span className="text-base font-black text-white">{remaining.minutes}</span>
                                <p className="text-[9px] text-slate-400 uppercase">Min</p>
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg">
                                <span className="text-base font-black text-sky-400">{remaining.seconds}</span>
                                <p className="text-[9px] text-slate-400 uppercase">Seg</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-slate-700 text-xs font-medium leading-relaxed">
                            <p className="whitespace-pre-wrap">{cap.content}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-700/30 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Desbloqueio: {new Date(cap.unlockDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 5: EISENHOWER MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
                  <Grid className="w-6 h-6 text-blue-600" />
                  <span>Matriz de Tarefas Eisenhower</span>
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">Organize tarefas por urgência e importância estratégica.</p>
              </div>

              {/* Add Task Control */}
              <form onSubmit={handleAddTask} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Nova tarefa..."
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newTaskQuadrant}
                  onChange={e => setNewTaskQuadrant(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="do_first">1. Fazer Primeiro</option>
                  <option value="schedule">2. Agendar</option>
                  <option value="delegate">3. Delegar</option>
                  <option value="dont_do">4. Eliminar</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition"
                >
                  Adicionar
                </button>
              </form>
            </div>

            {/* Matrix 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'do_first', title: '1. Fazer Primeiro', badge: 'Urgente & Importante', border: 'border-blue-500', headerBg: 'bg-blue-50 text-blue-800' },
                { id: 'schedule', title: '2. Agendar / Planejar', badge: 'Importante / Não Urgente', border: 'border-sky-400', headerBg: 'bg-sky-50 text-sky-800' },
                { id: 'delegate', title: '3. Delegar / Rápido', badge: 'Urgente / Não Importante', border: 'border-indigo-400', headerBg: 'bg-indigo-50 text-indigo-800' },
                { id: 'dont_do', title: '4. Eliminar / Arquivar', badge: 'Nem Urgente, Nem Importante', border: 'border-slate-300', headerBg: 'bg-slate-100 text-slate-700' },
              ].map(quadrant => {
                const quadTasks = tasks.filter(t => t.quadrant === quadrant.id);

                return (
                  <div key={quadrant.id} className={`bg-white rounded-2xl border-2 ${quadrant.border} shadow-xs p-5 flex flex-col justify-between min-h-[220px]`}>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{quadrant.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${quadrant.headerBg} uppercase tracking-wider mt-1 inline-block`}>
                            {quadrant.badge}
                          </span>
                        </div>
                        <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {quadTasks.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {quadTasks.map(task => (
                          <div 
                            key={task.id} 
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition group"
                          >
                            <div 
                              onClick={() => toggleTask(task.id)}
                              className="flex items-center space-x-3 cursor-pointer flex-1"
                            >
                              <input 
                                type="checkbox" 
                                checked={task.completed} 
                                onChange={() => {}} 
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                              />
                              <span className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {task.text}
                              </span>
                            </div>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* VIEW 6: HÁBITOS & STREAKS */}
        {activeTab === 'habits' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <span>Rastreador de Hábitos & Consistência</span>
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">Acompanhe sua frequência diária e construa sequências inabaláveis.</p>
              </div>

              <form onSubmit={handleAddHabit} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Novo hábito..."
                  value={newHabitName}
                  onChange={e => setNewHabitName(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition"
                >
                  Criar Hábito
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {habits.map(habit => (
                <div key={habit.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{habit.streak} Dias Seguidos</span>
                      </span>

                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="text-slate-300 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 mb-4">{habit.name}</h3>

                    {/* Habit Visual Heatmap (7 Days) */}
                    <div className="space-y-1.5 mb-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Histórico da Semana:</span>
                      <div className="flex items-center justify-between gap-1">
                        {(habit.history || [false, false, false, false, false, false, false]).map((done, idx) => (
                          <div 
                            key={idx} 
                            className={`h-7 flex-1 rounded-md flex items-center justify-center font-bold text-[10px] ${
                              done ? 'bg-amber-400 text-amber-950 shadow-xs' : 'bg-slate-100 text-slate-300'
                            }`}
                          >
                            {done ? '✓' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                      habit.completedToday 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600'
                    }`}
                  >
                    {habit.completedToday ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Concluído Hoje!</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Marcar Concluído</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* VIEW 7: PWA APP EXPORT & BACKUP CENTER */}
        {activeTab === 'export' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <h1 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <span>Central de Sincronização & Aplicativo Mobile</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">Exporte seus dados locais ou instale o Aetheria como aplicativo no seu celular.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Backup / Export Box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                  <span>Backup de Dados (JSON)</span>
                </h2>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Faça download de todas as suas memórias, cápsulas, hábitos e conexões em um único arquivo de backup seguro.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={exportData}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Backup JSON</span>
                  </button>

                  <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Importar JSON</span>
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={resetAllData}
                    className="text-xs text-red-500 hover:underline font-semibold flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restaurar dados padrões de fábrica</span>
                  </button>
                </div>
              </div>

              {/* PWA Conversion Instructions */}
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-sky-400" />
                  <h2 className="text-base font-bold">Como publicar como Aplicativo Móvel (PWA)</h2>
                </div>

                <p className="text-blue-100 text-xs leading-relaxed">
                  Você pode usar o Aetheria como um app nativo no iOS ou Android sem precisar publicar em lojas de aplicativos:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-blue-800/60 rounded-xl border border-blue-700/50">
                    <p className="font-bold text-sky-300">📱 No iPhone (Safari):</p>
                    <p className="text-blue-100 mt-1">Clique no botão de <b>Compartilhar</b> e selecione <b>"Adicionar à Tela de Início"</b>.</p>
                  </div>

                  <div className="p-3 bg-blue-800/60 rounded-xl border border-blue-700/50">
                    <p className="font-bold text-sky-300">🤖 No Android (Chrome):</p>
                    <p className="text-blue-100 mt-1">Toque nos três pontos do menu e escolha <b>"Instalar aplicativo"</b> ou <b>"Adicionar à tela inicial"</b>.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">AETHERIA</span>
            <span>— Cognitive Core & Digital Vault</span>
          </div>
          <p>© 2026 Aetheria Systems. Mente expandida com privacidade total.</p>
        </div>
      </footer>

    </div>
  );
}
```
