import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  StudentProfile, 
  Scholarship, 
  ApplicationTrackerItem, 
  ApplicationStage, 
  RecommendationFeedback 
} from '../types';
import { SCHOLARSHIPS_DATA, DEMO_USER_PROFILE } from '../data/scholarships';
import { submitFeedbackApi } from '../services/api';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'deadline' | 'recommendation' | 'application';
}

interface AppContextType {
  user: User | null;
  profile: StudentProfile | null;
  isAuthenticated: boolean;
  scholarships: Scholarship[];
  savedScholarshipIds: string[];
  applications: ApplicationTrackerItem[];
  comparedScholarshipIds: string[];
  notifications: NotificationItem[];
  feedbacks: RecommendationFeedback[];
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  resetToDemoProfile: () => void;
  clearProfile: () => void;
  toggleSaveScholarship: (scholarshipId: string) => void;
  isSaved: (scholarshipId: string) => boolean;
  
  // Tracker actions
  addToTracker: (scholarshipId: string, stage?: ApplicationStage) => void;
  updateApplicationStage: (applicationId: string, stage: ApplicationStage) => void;
  updateApplicationNotes: (applicationId: string, notes: string) => void;
  updateApplicationDeadline: (applicationId: string, deadline: string) => void;
  toggleChecklistItem: (applicationId: string, checklistId: string) => void;
  removeApplication: (applicationId: string) => void;
  
  // Compare actions
  toggleCompare: (scholarshipId: string) => boolean; // returns true if added, false if removed or max reached
  clearCompare: () => void;
  
  // Feedback
  submitFeedback: (scholarshipId: string, type: RecommendationFeedback['feedback_type'], notes?: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'usr_demo_8932',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.edu',
  role: 'student',
  created_at: '2024-11-15T08:30:00Z',
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Deadline Approaching',
    message: 'Gates Cambridge Scholarship application deadline is coming up in under 3 weeks.',
    timestamp: '2 hours ago',
    read: false,
    type: 'deadline',
  },
  {
    id: 'notif-2',
    title: 'High Recommendation Match',
    message: 'Chevening Master\'s Scholarship has a 94% compatibility match with your Computer Science profile.',
    timestamp: '1 day ago',
    read: false,
    type: 'recommendation',
  },
  {
    id: 'notif-3',
    title: 'Profile Optimization Tip',
    message: 'Adding official IELTS or TOEFL score unlocks verified eligibility for 6 European scholarships.',
    timestamp: '3 days ago',
    read: true,
    type: 'application',
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage where possible
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sm_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('sm_profile');
    return saved ? JSON.parse(saved) : DEMO_USER_PROFILE;
  });

  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sm_saved_ids');
    return saved ? JSON.parse(saved) : ['chevening-uk-2025', 'daad-helmut-schmidt-2025', 'gates-cambridge-2025'];
  });

  const [applications, setApplications] = useState<ApplicationTrackerItem[]>(() => {
    const saved = localStorage.getItem('sm_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default initial seeded applications for demo realism
    const chevening = SCHOLARSHIPS_DATA.find(s => s.id === 'chevening-uk-2025');
    const daad = SCHOLARSHIPS_DATA.find(s => s.id === 'daad-helmut-schmidt-2025');
    const defaultApps: ApplicationTrackerItem[] = [];
    
    if (chevening) {
      defaultApps.push({
        id: 'app-chevening',
        scholarship_id: chevening.id,
        scholarship: chevening,
        status: 'preparing_documents',
        personal_notes: 'Drafted leadership essays. Need professor to finalize reference letter by next Tuesday.',
        custom_deadline: chevening.application_deadline,
        checklist: [
          { id: 'c1', label: 'Draft 4 leadership essays (500 words each)', completed: true },
          { id: 'c2', label: 'Secure 2 reference letters', completed: false },
          { id: 'c3', label: 'Official university transcripts', completed: true },
          { id: 'c4', label: 'Apply to 3 target UK universities', completed: false },
        ],
        updated_at: new Date().toISOString(),
      });
    }

    if (daad) {
      defaultApps.push({
        id: 'app-daad',
        scholarship_id: daad.id,
        scholarship: daad,
        status: 'planning_to_apply',
        personal_notes: 'Selecting between Hertie School and Passau Master of Governance courses.',
        custom_deadline: daad.application_deadline,
        checklist: [
          { id: 'd1', label: 'Complete DAAD application form', completed: false },
          { id: 'd2', label: 'Europass CV updated', completed: true },
          { id: 'd3', label: 'Motivation letter tailored to public governance', completed: false },
        ],
        updated_at: new Date().toISOString(),
      });
    }
    return defaultApps;
  });

  const [comparedScholarshipIds, setComparedScholarshipIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [feedbacks, setFeedbacks] = useState<RecommendationFeedback[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('sm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sm_user');
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('sm_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('sm_profile');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sm_saved_ids', JSON.stringify(savedScholarshipIds));
  }, [savedScholarshipIds]);

  useEffect(() => {
    localStorage.setItem('sm_applications', JSON.stringify(applications));
  }, [applications]);

  const login = (email: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: 'student',
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile(prev => {
      if (!prev) {
        return {
          ...DEMO_USER_PROFILE,
          ...updated,
          user_id: user?.id || 'guest',
          updated_at: new Date().toISOString()
        };
      }
      const newProf = { ...prev, ...updated, updated_at: new Date().toISOString() };
      
      // Calculate completion score dynamically
      let score = 0;
      if (newProf.full_name) score += 10;
      if (newProf.citizenship) score += 10;
      if (newProf.gpa) score += 15;
      if (newProf.target_degree) score += 15;
      if (newProf.field_of_study) score += 15;
      if (newProf.preferred_countries && newProf.preferred_countries.length > 0) score += 10;
      if (newProf.language_test_status !== 'none') score += 10;
      if (newProf.funding_need) score += 10;
      if (newProf.has_research_experience || newProf.years_of_work_experience > 0) score += 5;
      newProf.profile_completion_percentage = Math.min(100, score);

      return newProf;
    });
  };

  const resetToDemoProfile = () => {
    setProfile(DEMO_USER_PROFILE);
    setUser(DEMO_USER);
  };

  const clearProfile = () => {
    setProfile(null);
  };

  const toggleSaveScholarship = (scholarshipId: string) => {
    setSavedScholarshipIds(prev => 
      prev.includes(scholarshipId)
        ? prev.filter(id => id !== scholarshipId)
        : [...prev, scholarshipId]
    );
  };

  const isSaved = (scholarshipId: string) => savedScholarshipIds.includes(scholarshipId);

  const addToTracker = (scholarshipId: string, stage: ApplicationStage = 'interested') => {
    const sch = SCHOLARSHIPS_DATA.find(s => s.id === scholarshipId);
    if (!sch) return;

    setApplications(prev => {
      const existing = prev.find(a => a.scholarship_id === scholarshipId);
      if (existing) {
        return prev.map(a => a.scholarship_id === scholarshipId ? { ...a, status: stage, updated_at: new Date().toISOString() } : a);
      }
      const initialChecklist = sch.required_documents.map((doc, idx) => ({
        id: `chk_${idx}`,
        label: doc.name,
        completed: false
      }));

      const newApp: ApplicationTrackerItem = {
        id: `app_${Date.now()}`,
        scholarship_id: scholarshipId,
        scholarship: sch,
        status: stage,
        personal_notes: '',
        custom_deadline: sch.application_deadline,
        checklist: initialChecklist,
        updated_at: new Date().toISOString()
      };
      return [newApp, ...prev];
    });
  };

  const updateApplicationStage = (applicationId: string, stage: ApplicationStage) => {
    setApplications(prev => prev.map(a => 
      a.id === applicationId 
        ? { ...a, status: stage, updated_at: new Date().toISOString() } 
        : a
    ));
  };

  const updateApplicationNotes = (applicationId: string, notes: string) => {
    setApplications(prev => prev.map(a => 
      a.id === applicationId 
        ? { ...a, personal_notes: notes, updated_at: new Date().toISOString() } 
        : a
    ));
  };

  const updateApplicationDeadline = (applicationId: string, deadline: string) => {
    setApplications(prev => prev.map(a => 
      a.id === applicationId 
        ? { ...a, custom_deadline: deadline, updated_at: new Date().toISOString() } 
        : a
    ));
  };

  const toggleChecklistItem = (applicationId: string, checklistId: string) => {
    setApplications(prev => prev.map(a => {
      if (a.id !== applicationId) return a;
      return {
        ...a,
        checklist: a.checklist.map(item => 
          item.id === checklistId ? { ...item, completed: !item.completed } : item
        ),
        updated_at: new Date().toISOString()
      };
    }));
  };

  const removeApplication = (applicationId: string) => {
    setApplications(prev => prev.filter(a => a.id !== applicationId));
  };

  const toggleCompare = (scholarshipId: string): boolean => {
    if (comparedScholarshipIds.includes(scholarshipId)) {
      setComparedScholarshipIds(prev => prev.filter(id => id !== scholarshipId));
      return false;
    }
    if (comparedScholarshipIds.length >= 4) {
      alert('You can compare a maximum of 4 scholarships simultaneously.');
      return false;
    }
    setComparedScholarshipIds(prev => [...prev, scholarshipId]);
    return true;
  };

  const clearCompare = () => {
    setComparedScholarshipIds([]);
  };

  const submitFeedback = (scholarshipId: string, type: RecommendationFeedback['feedback_type'], notes?: string) => {
    const newFeedback: RecommendationFeedback = {
      id: `fb_${Date.now()}`,
      scholarship_id: scholarshipId,
      user_id: user?.id || 'anonymous',
      feedback_type: type,
      notes,
      created_at: new Date().toISOString(),
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
    // Asynchronously submit to backend ML feedback loop if online
    submitFeedbackApi(scholarshipId, type, notes).catch(() => {});
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        scholarships: SCHOLARSHIPS_DATA,
        savedScholarshipIds,
        applications,
        comparedScholarshipIds,
        notifications,
        feedbacks,
        login,
        logout,
        updateProfile,
        resetToDemoProfile,
        clearProfile,
        toggleSaveScholarship,
        isSaved,
        addToTracker,
        updateApplicationStage,
        updateApplicationNotes,
        updateApplicationDeadline,
        toggleChecklistItem,
        removeApplication,
        toggleCompare,
        clearCompare,
        submitFeedback,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
