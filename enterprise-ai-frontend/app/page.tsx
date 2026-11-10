'use client';

import { useMemo, useRef, useState } from 'react';
import { Activity, ArrowDownToLine, ArrowUpRight, Bot, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Command, File, FileText, Files, Filter, FolderOpen, LayoutDashboard, LogOut, Menu, MessageSquare, MoreHorizontal, Plus, Search, Settings, ShieldCheck, Sparkles, UploadCloud, Workflow, X, Trash2, PanelLeftClose, Bell, Zap, FileUp } from 'lucide-react';

type Doc = { id: number; name: string; type: string; size: string; date: string; status: 'Ready' | 'Processing'; category: string };
const initialDocs: Doc[] = [
  { id: 1, name: 'Employee_Handbook_2026.pdf', type: 'PDF', size: '2.4 MB', date: 'Today, 9:42 AM', status: 'Ready', category: 'HR & Policies' },
  { id: 2, name: 'Leave_and_Absence_Policy.pdf', type: 'PDF', size: '1.1 MB', date: 'Today, 9:18 AM', status: 'Ready', category: 'HR & Policies' },
  { id: 3, name: 'Engineering_Onboarding.docx', type: 'DOCX', size: '846 KB', date: 'Yesterday', status: 'Ready', category: 'Engineering' },
  { id: 4, name: 'API_Integration_Guidelines.pdf', type: 'PDF', size: '3.8 MB', date: 'Nov 7, 2026', status: 'Ready', category: 'Engineering' },
  { id: 5, name: 'Remote_Work_Policy.pdf', type: 'PDF', size: '620 KB', date: 'Nov 6, 2026', status: 'Ready', category: 'HR & Policies' },
];
const navItems = [
  { label: 'Workspace', items: [{ name: 'Overview', icon: LayoutDashboard }, { name: 'Documents', icon: Files }, { name: 'AI Assistant', icon: MessageSquare }, { name: 'Agent workflows', icon: Workflow }] },
  { label: 'Manage', items: [{ name: 'Activity', icon: Activity }, { name: 'Settings', icon: Settings }] },
];

export default function Home() {
  const [active, setActive] = useState('Overview');
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [query, setQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredDocs = useMemo(() => docs.filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.category.toLowerCase().includes(query.toLowerCase())), [docs, query]);
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 3200); };
  
  const addFiles = async (files: FileList | File[]) => {
    const selected = Array.from(files);

    if (selected.length === 0) return;

    const accepted = selected.filter(file =>
      /\.(pdf|docx|txt)$/i.test(file.name)
    );

    if (accepted.length !== selected.length) {
      showNotice('Only PDF, DOCX and TXT files are supported.');
    }

    if (accepted.length === 0) return;

    const uploadedDocs: Doc[] = [];

    for (const file of accepted) {
      if (file.size > 25 * 1024 * 1024) {
        showNotice(`${file.name} exceeds the 25 MB limit.`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
          'http://localhost:8000/api/documents/upload',
          {
            method: 'POST',
            body: formData
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Upload failed');
        }

        const result = await response.json();

        uploadedDocs.push({
          id: Date.now() + uploadedDocs.length,
          name: result.original_filename,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          size: file.size > 1024 * 1024
            ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
            : `${Math.max(1, Math.round(file.size / 1024))} KB`,
          date: 'Just now',
          status: 'Ready',
          category: 'Uncategorized'
        });

      } catch (error) {
        console.error('Upload error:', error);

        showNotice(
          `Failed to upload ${file.name}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }

    if (uploadedDocs.length > 0) {
      setDocs(prev => [...uploadedDocs, ...prev]);

      showNotice(
        `${uploadedDocs.length} document(s) uploaded successfully!`
      );
    }

    setShowUpload(false);
    setSelectedFile(null);

    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const sendMessage = () => { if (!chatInput.trim()) return; const q = chatInput.trim(); setChatMessages(prev => [...prev, { role: 'user', text: q }, { role: 'assistant', text: 'The AI assistant will answer this using your uploaded documents once we connect the FastAPI and RAG backend. For now, this is a frontend preview.' }]); setChatInput(''); };
  const deleteDoc = (id: number) => { setDocs(prev => prev.filter(d => d.id !== id)); showNotice('Document removed from the demo list.'); };

  return <div className="app-shell">
    {sidebarOpen && <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Command size={19}/></div><span>northstar<span className="brand-dot">.</span></span><button className="icon-btn sidebar-collapse" onClick={() => setSidebarOpen(false)} aria-label="Collapse sidebar"><PanelLeftClose size={17}/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">A</div><div className="workspace-meta"><b>Acme Corporation</b><span>Free workspace</span></div><ChevronDown size={15} className="muted"/></div>
      <div className="nav-area">{navItems.map(group => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(item => <button key={item.name} onClick={() => setActive(item.name)} className={`nav-item ${active === item.name ? 'active' : ''}`}><item.icon size={18}/><span>{item.name}</span>{item.name === 'Agent workflows' && <span className="soon">Soon</span>}</button>)}</div>)}</div>
      <div className="sidebar-bottom"><div className="usage-card"><div className="usage-top"><span>Storage used</span><b>18%</b></div><div className="progress"><span/></div><small>1.8 GB of 10 GB</small><button onClick={() => showNotice('Plan management will be available in a later version.')}>Manage plan <ArrowUpRight size={13}/></button></div><div className="profile"><div className="profile-avatar">SH</div><div className="profile-meta"><b>Sumit Hanwate</b><span>Administrator</span></div><MoreHorizontal size={18} className="muted"/></div></div>
    </aside>}
    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs">{!sidebarOpen && <button className="icon-btn" onClick={() => setSidebarOpen(true)}><Menu size={18}/></button>}<span>Workspace</span><ChevronRight size={14}/><b>{active}</b></div><div className="top-actions"><div className="env-pill"><span/> Demo environment</div><button className="icon-btn" onClick={() => showNotice('You are all caught up.')} aria-label="Notifications"><Bell size={18}/></button><button className="help-btn" onClick={() => showNotice('Help centre coming soon.')}><CircleHelp size={17}/> Help</button></div></header>
      <div className="page-content">
        {active === 'Overview' && <>
          <div className="page-heading"><div><div className="eyebrow">MONDAY, NOVEMBER 10, 2026</div><h1>Good morning, Sumit <span className="wave">✦</span></h1><p>Here's what's happening in your knowledge workspace.</p></div><button className="primary-btn" onClick={() => setShowUpload(true)}><Plus size={17}/> Upload documents</button></div>
          <section className="stats-grid"><Stat icon={<Files size={18}/>} label="Total documents" value={String(docs.length).padStart(2,'0')} delta="In your workspace" tone="violet"/><Stat icon={<MessageSquare size={18}/>} label="Conversations" value="12" delta="Across 4 users" tone="blue"/><Stat icon={<Workflow size={18}/>} label="Agent runs" value="08" delta="2 workflows drafted" tone="orange"/><Stat icon={<Zap size={18}/>} label="Knowledge indexed" value="84%" delta="Ready for AI search" tone="green"/></section>
          <div className="content-grid"><section className="panel documents-panel"><div className="panel-header"><div><h2>Recent documents</h2><p>Your latest knowledge uploads</p></div><button className="text-btn" onClick={() => setActive('Documents')}>View all <ArrowUpRight size={14}/></button></div><DocumentTable docs={docs.slice(0,4)} onDelete={deleteDoc}/><button className="upload-strip" onClick={() => setShowUpload(true)}><UploadCloud size={18}/><span><b>Upload a new document</b><small>PDF, DOCX or TXT up to 25 MB</small></span><Plus size={17}/></button></section>
          <section className="right-column"><div className="welcome-card"><div className="welcome-glow"/><div className="welcome-icon"><Sparkles size={20}/></div><div className="welcome-tag">YOUR AI WORKSPACE</div><h2>Your knowledge,<br/>ready to work.</h2><p>Ask questions across your documents, find insights and automate repetitive work.</p><button onClick={() => setActive('AI Assistant')}>Explore AI assistant <ArrowUpRight size={15}/></button><div className="welcome-orbit orbit-one"/><div className="welcome-orbit orbit-two"/></div><div className="panel activity-panel"><div className="panel-header"><div><h2>Recent activity</h2><p>Latest workspace events</p></div><button className="icon-btn" onClick={() => setActive('Activity')}><ArrowUpRight size={16}/></button></div><ActivityRow icon={<FileText size={15}/>} title="Document uploaded" desc="Employee_Handbook_2026.pdf" time="9:42 AM"/><ActivityRow icon={<ShieldCheck size={15}/>} title="Workspace secured" desc="Access settings updated" time="Yesterday"/><ActivityRow icon={<Bot size={15}/>} title="Agent workspace created" desc="Getting started template" time="Nov 7"/></div></section></div>
          <section className="bottom-banner"><div className="banner-icon"><Bot size={19}/></div><div><b>Next up: Connect your AI brain</b><p>Once the backend is ready, we'll connect document processing, semantic search and your first AI agent.</p></div><span className="banner-status">PHASE 02 <ChevronRight size={13}/></span></section>
        </>}
        {active === 'Documents' && <><div className="page-heading"><div><div className="eyebrow">KNOWLEDGE BASE</div><h1>Documents</h1><p>Manage the files that power your AI workspace.</p></div><button className="primary-btn" onClick={() => setShowUpload(true)}><Plus size={17}/> Upload documents</button></div><div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search documents or categories..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><button className="filter-btn" onClick={() => showNotice('All document types are currently displayed.')}><Filter size={16}/> Filters <ChevronDown size={14}/></button></div><section className="panel full-docs"><div className="panel-header"><div><h2>All documents <span className="count-badge">{filteredDocs.length}</span></h2><p>Files uploaded to this workspace</p></div><button className="text-btn" onClick={() => showNotice('Export will be available after backend integration.')}><ArrowDownToLine size={15}/> Export list</button></div><DocumentTable docs={filteredDocs} onDelete={deleteDoc}/>{filteredDocs.length === 0 && <div className="empty-state"><FolderOpen size={28}/><b>No documents found</b><span>Try another search or upload a document.</span></div>}</section></>}
        {active === 'AI Assistant' && <><div className="page-heading"><div><div className="eyebrow">ASK YOUR KNOWLEDGE BASE</div><h1>AI Assistant</h1><p>Get answers grounded in your organization's documents.</p></div><span className="coming-pill"><span/> Backend connection pending</span></div><div className="chat-layout"><div className="chat-main"><div className="chat-empty"><div className="chat-spark"><Sparkles size={25}/></div><h2>What would you like to know?</h2><p>Ask a question about your documents. Your AI assistant will search, reason and cite its sources.</p><div className="suggestions"><button onClick={() => setChatInput('Summarize the employee handbook')}>Summarize the employee handbook <ArrowUpRight size={13}/></button><button onClick={() => setChatInput('What is our remote work policy?')}>What is our remote work policy? <ArrowUpRight size={13}/></button><button onClick={() => setChatInput('Compare the leave policies')}>Compare the leave policies <ArrowUpRight size={13}/></button></div></div>{chatMessages.length > 0 && <div className="chat-thread">{chatMessages.map((m,i)=><div className={`chat-bubble ${m.role}`} key={i}><b>{m.role === 'user' ? 'You' : 'Northstar AI'}</b><p>{m.text}</p></div>)}</div>}<div className="chat-composer"><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask anything about your documents..."/><button onClick={sendMessage}><ArrowUpRight size={17}/></button></div><div className="composer-note">Demo mode · AI responses will be enabled when we connect the backend</div></div><aside className="chat-context"><h3>Knowledge sources</h3><p>Documents available to your assistant</p>{docs.slice(0,4).map(d=><div className="source-row" key={d.id}><FileText size={16}/><span>{d.name}</span><Check size={14} className="check-green"/></div>)}<div className="context-note"><ShieldCheck size={16}/><span>Answers will include source citations and page references.</span></div></aside></div></>}
        {active === 'Agent workflows' && <Coming title="Agent workflows" eyebrow="AUTOMATION STUDIO" text="Build AI workflows that research, reason and take action across your knowledge base." icon={<Workflow size={25}/>} onAction={() => showNotice('Agent workflows are planned for a later milestone.')}/>}
        {active === 'Activity' && <Coming title="Workspace activity" eyebrow="AUDIT TRAIL" text="A unified timeline of document uploads, searches and agent executions will appear here." icon={<Activity size={25}/>} onAction={() => setActive('Overview')}/>}
        {active === 'Settings' && <Coming title="Workspace settings" eyebrow="PREFERENCES & ACCESS" text="Manage workspace members, permissions, integrations and security settings." icon={<Settings size={25}/>} onAction={() => showNotice('Settings will be enabled in a later milestone.')}/>}
      </div>
    </main>
    {showUpload && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowUpload(false)}><div className="upload-modal"><div className="modal-head"><div><div className="eyebrow">KNOWLEDGE BASE</div><h2>Upload documents</h2><p>Add files to your organization's knowledge workspace.</p></div><button className="icon-btn" onClick={() => setShowUpload(false)}><X size={19}/></button></div><div className={`dropzone ${dragging ? 'dragging' : ''}`} onDragOver={e => {e.preventDefault();setDragging(true)}} onDragLeave={() => setDragging(false)} onDrop={e => {e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files)}} onClick={() => fileRef.current?.click()}><div className="drop-icon"><FileUp size={23}/></div><b>Drag and drop your files here</b><span>or <u>browse files</u> on your computer</span><small>PDF, DOCX, TXT · Maximum 25 MB per file</small><input ref={fileRef} type="file" accept=".pdf,.docx,.txt" multiple hidden onChange={e => e.target.files && addFiles(e.target.files)}/></div>{selectedFile && <div className="selected-file"><FileText size={17}/>{selectedFile.name}</div>}<div className="modal-foot"><span><ShieldCheck size={15}/> Files uploaded to local server storage</span><button className="secondary-btn" onClick={() => setShowUpload(false)}>Cancel</button></div></div></div>}
    {notice && <div className="toast"><Check size={16}/>{notice}</div>}
  </div>;
}

function Stat({icon,label,value,delta,tone}:{icon:React.ReactNode;label:string;value:string;delta:string;tone:string}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-delta">{delta}</div></div>; }
function DocumentTable({docs,onDelete}:{docs:Doc[];onDelete:(id:number)=>void}) { return <div className="table-wrap"><table><thead><tr><th>NAME</th><th>CATEGORY</th><th>SIZE</th><th>STATUS</th><th>UPLOADED</th><th></th></tr></thead><tbody>{docs.map(d=><tr key={d.id}><td><div className="file-cell"><div className={`file-icon ${d.type.toLowerCase()}`}>{d.type === 'PDF' ? 'PDF' : d.type === 'DOCX' ? 'DOC' : 'TXT'}</div><b>{d.name}</b></div></td><td><span className="category-pill">{d.category}</span></td><td className="table-muted">{d.size}</td><td><span className="status-ready"><span/>{d.status}</span></td><td className="table-muted">{d.date}</td><td><button className="row-menu" title="Delete document" onClick={() => onDelete(d.id)}><Trash2 size={15}/></button></td></tr>)}</tbody></table></div>; }
function ActivityRow({icon,title,desc,time}:{icon:React.ReactNode;title:string;desc:string;time:string}) { return <div className="activity-row"><div className="activity-icon">{icon}</div><div className="activity-copy"><b>{title}</b><span>{desc}</span></div><time>{time}</time></div>; }
function Coming({title,eyebrow,text,icon,onAction}:{title:string;eyebrow:string;text:string;icon:React.ReactNode;onAction:()=>void}) { return <div className="coming-page"><div className="coming-icon">{icon}</div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p><span className="coming-pill"><span/> Planned for a future milestone</span><button className="secondary-btn" onClick={onAction}>Back to workspace</button></div>; }
