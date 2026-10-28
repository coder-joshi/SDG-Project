import React from 'react';
import { Project, ProjectStatus } from '../types';
import { MapPin, ArrowUpRight, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectTableProps {
  projects: Project[];
  limit?: number;
  showAllLink?: boolean;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  limit,
  showAllLink = false
}) => {
  const navigate = useNavigate();
  const displayList = limit ? projects.slice(0, limit) : projects;

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Active
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <Clock className="w-3 h-3 text-orange-600" />
            Under Review
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#E5EAE7] shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            My Registered Projects
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified ecological conservation and restoration assets
          </p>
        </div>

        {showAllLink && (
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAF9] text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4">Project Name & ID</th>
              <th className="py-3 px-4">Activity Type</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Credits Minted</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No projects registered yet. Click &quot;Register Project&quot; to submit your first ecological plot.
                </td>
              </tr>
            ) : (
              displayList.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/marketplace/${project.id}`)}
                >
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors truncate max-w-xs sm:max-w-sm">
                      {project.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {project.id} · {project.areaHa} Ha
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-medium">{project.activityType}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {project.district}, {project.state}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {project.creditsGenerated ? (
                      <span className="text-emerald-700 font-display">
                        {project.creditsGenerated.toLocaleString('en-IN')} GCP
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">0 GCP</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/marketplace/${project.id}`);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline px-2 py-1"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
