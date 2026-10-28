import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, MapPin, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ProjectTable } from '../../components/ProjectTable';
import { ProjectStatus } from '../../types';

export const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useData();

  const [activeTab, setActiveTab] = useState<'All' | ProjectStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesTab = activeTab === 'All' || p.status === activeTab;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.activityType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [projects, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter((p) => p.status === 'Active').length,
      underReview: projects.filter((p) => p.status === 'Under Review' || p.status === 'Submitted').length,
      rejected: projects.filter((p) => p.status === 'Rejected').length
    };
  }, [projects]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Registered Environmental Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track verification milestones, plot geotags, and minted green credits across India
          </p>
        </div>

        <button
          onClick={() => navigate('/projects/new')}
          className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Project</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'All'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Projects ({counts.all})
          </button>
          <button
            onClick={() => setActiveTab('Active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'Active'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({counts.active})
          </button>
          <button
            onClick={() => setActiveTab('Under Review')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'Under Review'
                ? 'bg-white text-orange-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Under Review ({counts.underReview})
          </button>
          <button
            onClick={() => setActiveTab('Rejected')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'Rejected'
                ? 'bg-white text-rose-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected ({counts.rejected})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Projects Table */}
      <ProjectTable projects={filteredProjects} />
    </div>
  );
};
