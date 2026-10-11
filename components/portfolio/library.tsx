import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/portfolio';
const categories=['All work','AI & Automation','Product Strategy','Growth & Retention','Research & UX'];
export function Library(){
 const [category,setCategory]=useState('All work'); const [search,setSearch]=useState('');
 const filtered=projects.filter(p=>(category==='All work'||p.category===category)&&`${p.name} ${p.summary}`.toLowerCase().includes(search.toLowerCase()));
 return <><div className="library-controls"><div className="filters" role="group" aria-label="Filter by project category">{categories.map(c=><Button key={c} variant={category===c?'secondary':'ghost'} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}{c==='All work'&&<span className="filter-count">{projects.length}</span>}</Button>)}</div><label className="project-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a project" aria-label="Search projects"/>{search&&<Button variant="ghost" size="icon" onClick={()=>setSearch('')} aria-label="Clear search"><X/></Button>}</label></div><div className="library-results" aria-live="polite"><span className="sr-only">{filtered.length} projects</span>{filtered.map((p)=><Link key={p.slug} to="/projects/$slug" params={{slug:p.slug}} className="library-row"><span className="project-number">{String(projects.indexOf(p)+1).padStart(2,'0')}</span><div><h3>{p.name}</h3><p>{p.summary}</p><span className="library-status">{p.status}</span></div><span className="library-category">{p.category}</span><ArrowUpRight className="row-arrow"/></Link>)}{filtered.length===0&&<div className="empty-state"><Search/><h3>No projects found</h3><p>Try another project name or category.</p><Button variant="outline" onClick={()=>{setCategory('All work');setSearch('');}}>Reset filters</Button></div>}</div></>;
}
