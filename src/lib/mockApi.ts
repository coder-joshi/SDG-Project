import initialProjects from '../data/projects.json';
import initialCredits from '../data/credits.json';
import initialActivity from '../data/activity.json';
import initialUsers from '../data/users.json';
import { Project, User, ActivityItem, CreditsData } from '../types';

const delay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async getUsers(): Promise<User[]> {
    await delay();
    return JSON.parse(JSON.stringify(initialUsers));
  },

  async getProjects(): Promise<Project[]> {
    await delay();
    return JSON.parse(JSON.stringify(initialProjects));
  },

  async getProjectById(id: string): Promise<Project | null> {
    await delay();
    const list = initialProjects as unknown as Project[];
    const match = list.find((p) => p.id === id);
    return match ? JSON.parse(JSON.stringify(match)) : null;
  },

  async createProject(newProject: Omit<Project, 'id' | 'status' | 'creditsGenerated' | 'creditsAvailable' | 'submittedDate'>): Promise<Project> {
    await delay();
    const created: Project = {
      ...newProject,
      id: `PRJ-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: 'Under Review',
      creditsGenerated: 0,
      creditsAvailable: 0,
      submittedDate: new Date().toISOString().split('T')[0],
      verifiedDate: null,
      verifierName: null
    };
    return created;
  },

  async verifyProject(
    projectId: string,
    action: { approved: boolean; reason?: string; creditsAwarded?: number; verifierName: string }
  ): Promise<{ project: Partial<Project>; activity: ActivityItem }> {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    if (action.approved) {
      const awarded = action.creditsAwarded || 1200;
      const activity: ActivityItem = {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        timestamp: nowIso,
        type: 'credit_earned',
        amount: `+${awarded} GCP`,
        numericAmount: awarded,
        status: 'Completed',
        badgeColor: 'green',
        title: 'Project Verified & Credits Minted',
        description: `Project ${projectId} verified by ${action.verifierName}`,
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        entity: 'MoEFCC National Green Credit Registry'
      };
      return {
        project: {
          id: projectId,
          status: 'Active',
          creditsGenerated: awarded,
          creditsAvailable: Math.round(awarded * 0.75),
          verifiedDate: today,
          verifierName: action.verifierName
        },
        activity
      };
    } else {
      const activity: ActivityItem = {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        timestamp: nowIso,
        type: 'verification_rejected',
        amount: '0 GCP',
        numericAmount: 0,
        status: 'Rejected',
        badgeColor: 'rose',
        title: 'Verification Request Rejected',
        description: action.reason || 'Verification criteria not satisfied on satellite inspection',
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        entity: 'MoEFCC National Green Credit Registry'
      };
      return {
        project: {
          id: projectId,
          status: 'Rejected',
          rejectionReason: action.reason || 'Criteria not met'
        },
        activity
      };
    }
  },

  async buyCredits(params: {
    projectId: string;
    projectTitle: string;
    quantity: number;
    pricePerCreditINR: number;
    buyerName: string;
  }): Promise<{ success: boolean; activity: ActivityItem; orderId: string; totalCost: number }> {
    await delay();
    const totalCost = params.quantity * params.pricePerCreditINR;
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const activity: ActivityItem = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: nowIso,
      type: 'credit_traded',
      amount: `-${params.quantity} GCP`,
      numericAmount: -params.quantity,
      status: 'Completed',
      badgeColor: 'blue',
      title: 'Marketplace Acquisition',
      description: `Purchased ${params.quantity} GCP from ${params.projectTitle} for ₹${totalCost.toLocaleString('en-IN')}`,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      entity: params.buyerName
    };

    return {
      success: true,
      activity,
      orderId,
      totalCost
    };
  },

  async getCreditsData(): Promise<CreditsData> {
    await delay();
    return JSON.parse(JSON.stringify(initialCredits));
  },

  async getActivities(): Promise<ActivityItem[]> {
    await delay();
    return JSON.parse(JSON.stringify(initialActivity));
  }
};
