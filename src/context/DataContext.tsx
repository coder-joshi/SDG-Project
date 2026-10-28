import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, CreditsData, ActivityItem } from '../types';
import { mockApi } from '../lib/mockApi';
import { useAuth } from './AuthContext';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface DataContextType {
  projects: Project[];
  creditsData: CreditsData | null;
  activities: ActivityItem[];
  isLoading: boolean;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addProject: (
    newProjectData: Omit<Project, 'id' | 'status' | 'creditsGenerated' | 'creditsAvailable' | 'submittedDate'>
  ) => Promise<Project>;
  verifyProject: (
    projectId: string,
    approved: boolean,
    reason?: string,
    creditsAwarded?: number
  ) => Promise<void>;
  buyCredits: (projectId: string, quantity: number) => Promise<{ success: boolean; totalCost: number }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateCurrentUserBalance } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [creditsData, setCreditsData] = useState<CreditsData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    let mounted = true;
    Promise.all([mockApi.getProjects(), mockApi.getCreditsData(), mockApi.getActivities()])
      .then(([loadedProjects, loadedCredits, loadedActivities]) => {
        if (!mounted) return;
        setProjects(loadedProjects);
        setCreditsData(loadedCredits);
        setActivities(loadedActivities);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load initial data:', err);
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const addProject = async (
    newProjectData: Omit<Project, 'id' | 'status' | 'creditsGenerated' | 'creditsAvailable' | 'submittedDate'>
  ): Promise<Project> => {
    const created = await mockApi.createProject(newProjectData);
    setProjects((prev) => [created, ...prev]);

    // Push pending activity
    const activity: ActivityItem = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      type: 'verification_pending',
      amount: 'Submitted',
      numericAmount: 0,
      status: 'Pending',
      badgeColor: 'amber',
      title: 'New Project Registered',
      description: `Submitted ${created.title} (${created.activityType}, ${created.state}) for verification`,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      entity: created.applicantName || 'Citizen Applicant'
    };
    setActivities((prev) => [activity, ...prev]);
    showToast(`Project "${created.title}" submitted successfully for verification!`, 'success');
    return created;
  };

  const verifyProject = async (
    projectId: string,
    approved: boolean,
    reason?: string,
    creditsAwarded: number = 1850
  ) => {
    const verifierName = currentUser?.name || 'Dr. Sunita Rao';
    const result = await mockApi.verifyProject(projectId, {
      approved,
      reason,
      creditsAwarded,
      verifierName
    });

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            ...result.project
          };
        }
        return p;
      })
    );

    setActivities((prev) => [result.activity, ...prev]);

    if (approved) {
      // Update global creditsData stat cards
      setCreditsData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          summary: {
            ...prev.summary,
            totalCredits: prev.summary.totalCredits + creditsAwarded,
            availableForTrading: prev.summary.availableForTrading + Math.round(creditsAwarded * 0.75),
            activeProjects: prev.summary.activeProjects + 1
          }
        };
      });

      // Update current user balance if citizen
      updateCurrentUserBalance(creditsAwarded);
      showToast(`Project approved! ${creditsAwarded} Green Credits minted and credited.`, 'success');
    } else {
      showToast(`Project rejected: ${reason || 'Criteria not met.'}`, 'error');
    }
  };

  const buyCredits = async (
    projectId: string,
    quantity: number
  ): Promise<{ success: boolean; totalCost: number }> => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const result = await mockApi.buyCredits({
      projectId,
      projectTitle: project.title,
      quantity,
      pricePerCreditINR: project.pricePerCreditINR,
      buyerName: currentUser?.name || 'Corporate Buyer'
    });

    // Update project available credits
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            creditsAvailable: Math.max(0, p.creditsAvailable - quantity)
          };
        }
        return p;
      })
    );

    setActivities((prev) => [result.activity, ...prev]);

    // Update credits data
    setCreditsData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        summary: {
          ...prev.summary,
          availableForTrading: Math.max(0, prev.summary.availableForTrading - quantity)
        }
      };
    });

    updateCurrentUserBalance(0, -result.totalCost);
    showToast(`Acquired ${quantity} Green Credits for ₹${result.totalCost.toLocaleString('en-IN')}`, 'success');

    return { success: true, totalCost: result.totalCost };
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        creditsData,
        activities,
        isLoading,
        toasts,
        showToast,
        removeToast,
        addProject,
        verifyProject,
        buyCredits
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
