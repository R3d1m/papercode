import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User, Classroom, Course, Roadmap, Submission, Lesson, Module, ClassroomAssignment } from '../types';
import { 
  CURRENT_STUDENT, 
  CURRENT_TEACHER, 
  CURRENT_MODERATOR,
  SEED_MODERATORS,
  CURRENT_ADMIN, 
  SEED_USERS,
  SEED_COURSES, 
  SEED_ROADMAPS, 
  SEED_CLASSROOMS, 
  SEED_SUBMISSIONS 
} from '../data/seedData';
import { apiClient } from '../services/apiClient';

interface AppContextType {
  activeMode: 'marketing' | 'student' | 'teacher' | 'moderator' | 'admin';
  setActiveMode: (mode: 'marketing' | 'student' | 'teacher' | 'moderator' | 'admin') => void;
  currentRole: Role;
  currentUser: User;
  switchRole: (role: Role) => void;
  login: (email: string, password?: string, role?: Role) => Promise<{ success: boolean; message: string; user?: User }>;
  loginWithGoogle: (data: { credential?: string; accessToken?: string; role?: Role; school?: string; division?: string; profile?: any }) => Promise<{ success: boolean; message: string; user?: User }>;
  signup: (userData: { name: string; email: string; password?: string; role: Role; school?: string; division?: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  users: User[];
  moderators: User[];
  addModerator: (data: { name: string; email: string; school?: string; permissions?: string[] }) => User;
  removeModerator: (moderatorId: string) => void;
  promoteTeacherToModerator: (teacherId: string, permissions?: string[]) => User | null;
  demoteModerator: (moderatorId: string) => void;
  classrooms: Classroom[];
  courses: Course[];
  roadmaps: Roadmap[];
  submissions: Submission[];
  activeLesson: Lesson | null;
  setActiveLesson: (lesson: Lesson | null) => void;
  completedLessonIds: string[];
  completeLesson: (lessonId: string) => void;
  isLessonUnlocked: (lessonId: string) => boolean;
  studentXp: number;
  studentStreak: number;
  addXp: (amount: number) => void;
  joinClassroom: (code: string) => Promise<{ success: boolean; message: string; classroom?: Classroom }>;
  createClassroom: (name: string, gradeLevel: string, subject: string, courseIds?: string[]) => Classroom;
  updateClassroom: (classroomId: string, data: Partial<Classroom>) => void;
  updateClassroomCourses: (classroomId: string, courseIds: string[]) => void;
  removeStudentFromClassroom: (classroomId: string, studentId: string) => void;
  deleteClassroom: (classroomId: string) => void;
  regenerateJoinCode: (classroomId: string) => string;
  addAssignmentToClassroom: (classroomId: string, assignment: Omit<ClassroomAssignment, 'id' | 'totalSubmissions' | 'totalStudents' | 'status'>) => void;
  deleteAssignmentFromClassroom: (classroomId: string, assignmentId: string) => void;
  submitExercise: (submission: Omit<Submission, 'id' | 'submittedAt'>) => Submission;
  updateSubmissionGrade: (submissionId: string, score: number, feedback: string, teacherNotes?: string) => void;
  applyBatchCurve: (assignmentId: string, curveBonusPercentage: number) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, data: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addModuleToCourse: (courseId: string, moduleData: any) => void;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, updatedLesson: Lesson) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  publishRoadmap: (roadmapId: string) => void;
  updateRoadmap: (roadmapId: string, data: Partial<Roadmap>) => void;
  addRoadmap: (roadmapData: Omit<Roadmap, 'id'>) => Roadmap;
  deleteRoadmap: (roadmapId: string) => void;
  addCourseToRoadmap: (roadmapId: string, courseId: string) => void;
  removeCourseFromRoadmap: (roadmapId: string, courseId: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  enrollInCourse: (courseId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getSavedUser = (): User => {
  try {
    const saved = localStorage.getItem('papercode_user_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email) return parsed;
    }
  } catch (e) {}
  return CURRENT_STUDENT;
};

const getSavedMode = (): 'marketing' | 'student' | 'teacher' | 'moderator' | 'admin' => {
  try {
    const saved = localStorage.getItem('papercode_user_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.role) return parsed.role;
    }
  } catch (e) {}
  return 'marketing';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMode, setActiveMode] = useState<'marketing' | 'student' | 'teacher' | 'moderator' | 'admin'>(getSavedMode);
  const [currentRole, setCurrentRole] = useState<Role>(() => getSavedUser().role || 'student');
  const [currentUser, setCurrentUser] = useState<User>(getSavedUser);
  
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [moderators, setModerators] = useState<User[]>(SEED_MODERATORS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(SEED_CLASSROOMS);
  const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(SEED_ROADMAPS);
  const [submissions, setSubmissions] = useState<Submission[]>(SEED_SUBMISSIONS);
  
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(SEED_COURSES[0]?.modules?.[0]?.lessons?.[0] || null);
  const [studentXp, setStudentXp] = useState<number>(0);
  const [studentStreak, setStudentStreak] = useState<number>(0);

  // Sync classrooms from PostgreSQL backend on mount
  useEffect(() => {    
    apiClient.getClassrooms().then(res => {
      if (res && res.classrooms && Array.isArray(res.classrooms)) {
        setClassrooms(res.classrooms);
      }
    }).catch(e => {
      console.warn('Classroom sync skipped:', e);
    });

    // Sync courses from PostgreSQL backend on mount
    apiClient.getCourses().then(res => {
      if (res && res.courses && Array.isArray(res.courses) && res.courses.length > 0) {
        setCourses(res.courses);
        if (res.courses[0]?.modules?.[0]?.lessons?.[0]) {
          setActiveLesson(res.courses[0].modules[0].lessons[0]);
        }
        
        // Build dynamic roadmaps from database courses
        const dbRoadmaps: Roadmap[] = [
          {
            id: 'rdm-db-hsc-ict',
            title: 'NCTB HSC ICT Chapter 5 (Structured Programming)',
            description: 'Master variables, data types, conditional branching, loops, and arrays directly on paper notebook.',
            badge: '🏆 National HSC Board Exam Mastery',
            targetAudience: 'HSC & College Students',
            courses: res.courses,
            isPublic: true,
            totalXp: 5000,
            enrolledCount: 150
          }
        ];
        setRoadmaps(dbRoadmaps);
      }
    }).catch(() => {});
  }, []);

  const allOrderedLessons: Lesson[] = courses.flatMap(c => (c.modules || []).flatMap(m => m.lessons || []));

  const completeLesson = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  const isLessonUnlocked = (lessonId: string): boolean => {
    const index = allOrderedLessons.findIndex(l => l.id === lessonId);
    if (index <= 0) return true;
    const previousLesson = allOrderedLessons[index - 1];
    return completedLessonIds.includes(previousLesson.id);
  };

  const switchRole = (role: Role) => {
    setCurrentRole(role);
    if (role === 'student') {
      setCurrentUser(CURRENT_STUDENT);
      setStudentXp(CURRENT_STUDENT.xp);
      setStudentStreak(CURRENT_STUDENT.streak);
      setActiveMode('student');
    } else if (role === 'teacher') {
      setCurrentUser(CURRENT_TEACHER);
      setActiveMode('teacher');
    } else if (role === 'moderator') {
      setCurrentUser(CURRENT_MODERATOR);
      setActiveMode('moderator');
    } else if (role === 'admin') {
      setCurrentUser(CURRENT_ADMIN);
      setActiveMode('admin');
    }
  };

  const login = async (email: string, password?: string, role?: Role) => {
    const formattedEmail = email.trim().toLowerCase();
    
    // Call backend PostgreSQL API
    const res = await apiClient.login(formattedEmail, password, role);

    if (!res || !res.success) {
      return { 
        success: false, 
        message: res?.message || 'Invalid email or password. Please check your credentials or click Sign Up.' 
      };
    }

    const authUser: User = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      role: res.user.role,
      school: res.user.school || 'Independent Learner',
      division: res.user.division || 'Dhaka',
      avatar: res.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      xp: res.user.xp || 0,
      streak: res.user.streak || 0,
      completedLessons: res.user.completedLessons || [],
      enrolledClassroomIds: res.user.enrolledClassroomIds || [],
      enrolledRoadmapIds: res.user.enrolledRoadmapIds || [],
      permissions: res.user.permissions,
      joinedAt: new Date().toISOString().slice(0, 10)
    };

    setCurrentUser(authUser);
    setCurrentRole(authUser.role);
    setActiveMode(authUser.role);
    setStudentXp(authUser.xp);
    setStudentStreak(authUser.streak);

    try {
      localStorage.setItem('papercode_user_session', JSON.stringify(authUser));
    } catch (e) {}

    return { 
      success: true, 
      message: res.message || ('Welcome back, ' + authUser.name + '!'), 
      user: authUser 
    };
  };

  const loginWithGoogle = async (data: { credential?: string; accessToken?: string; role?: Role; school?: string; division?: string; profile?: any }) => {
    const res = await apiClient.googleAuth(data);
    if (!res || !res.success || !res.user) {
      return {
        success: false,
        message: res?.message || 'Google authentication failed. Please try again.'
      };
    }

    const userRole: Role = (res.user.role === 'teacher' || res.user.role === 'moderator' || res.user.role === 'admin') ? res.user.role : 'student';

    const authUser: User = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      role: userRole,
      school: res.user.school || (userRole === 'teacher' ? 'Independent Educator' : 'Independent Learner'),
      division: res.user.division || 'Chittagong',
      avatar: res.user.avatar || res.user.avatar_url || (userRole === 'teacher'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
      xp: res.user.xp || 0,
      streak: res.user.streak || 0,
      completedLessons: res.user.completedLessons || [],
      enrolledClassroomIds: res.user.enrolledClassroomIds || [],
      enrolledRoadmapIds: res.user.enrolledRoadmapIds || [],
      permissions: res.user.permissions,
      joinedAt: new Date().toISOString().slice(0, 10)
    };

    setUsers(prev => {
      const exists = prev.some(u => u.id === authUser.id || u.email.toLowerCase() === authUser.email.toLowerCase());
      if (exists) {
        return prev.map(u => (u.id === authUser.id || u.email.toLowerCase() === authUser.email.toLowerCase()) ? authUser : u);
      }
      return [authUser, ...prev];
    });

    setCurrentUser(authUser);
    setCurrentRole(userRole);
    setActiveMode(userRole);
    setStudentXp(authUser.xp);
    setStudentStreak(authUser.streak);

    try {
      localStorage.setItem('papercode_user_session', JSON.stringify(authUser));
    } catch (e) {}

    return {
      success: true,
      message: res.message || ('Welcome, ' + authUser.name + '!'),
      user: authUser
    };
  };

  const signup = async (userData: { name: string; email: string; password?: string; role: Role; school?: string; division?: string }) => {
    // Send to backend API
    const res = await apiClient.signup(userData);

    if (!res || !res.success) {
      return {
        success: false,
        message: res?.message || 'Error creating account. Email may already be registered.'
      };
    }

    const newUser: User = {
      id: res.user?.id || ('usr-' + Date.now()),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.role === 'teacher'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      school: userData.school || (userData.role === 'teacher' ? 'Independent Educator' : 'Independent Learner'),
      division: userData.division || 'Chittagong',
      xp: 0,
      streak: 0,
      completedLessons: [],
      enrolledClassroomIds: [],
      enrolledRoadmapIds: [],
      joinedAt: new Date().toISOString().slice(0, 10)
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);
    setActiveMode(newUser.role);
    setStudentXp(0);
    setStudentStreak(0);

    try {
      localStorage.setItem('papercode_user_session', JSON.stringify(newUser));
    } catch (e) {}

    return { success: true, message: 'Account created successfully for ' + newUser.name + '!', user: newUser };
  };

  const logout = () => {
    try {
      localStorage.removeItem('papercode_user_session');
    } catch (e) {}
    setActiveMode('marketing');
    setCurrentRole('student');
    setCurrentUser(CURRENT_STUDENT);
  };

  const enrollInCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course && course.modules?.[0]?.lessons?.[0]) {
      setActiveLesson(course.modules[0].lessons[0]);
    }
  };

  const addModerator = (data: { name: string; email: string; school?: string; permissions?: string[] }) => {
    const newMod: User = {
      id: 'usr-mod-' + Date.now(),
      name: data.name,
      email: data.email,
      role: 'moderator',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      school: data.school || 'Curriculum Editorial Board',
      division: 'Dhaka',
      xp: 0,
      streak: 0,
      completedLessons: [],
      enrolledClassroomIds: [],
      enrolledRoadmapIds: [],
      permissions: data.permissions || ['edit_roadmaps', 'create_courses', 'manage_lessons'],
      addedBy: currentUser.name,
      joinedAt: new Date().toISOString().slice(0, 10)
    };

    setModerators(prev => [newMod, ...prev]);
    setUsers(prev => [newMod, ...prev]);
    return newMod;
  };

  const promoteTeacherToModerator = (teacherId: string, permissions: string[] = ['edit_roadmaps', 'moderate_curriculum', 'moderate_blogs']) => {
    const teacher = users.find(u => u.id === teacherId);
    if (!teacher) return null;

    const promotedUser: User = {
      ...teacher,
      role: 'moderator',
      permissions
    };

    setUsers(prev => prev.map(u => u.id === teacherId ? promotedUser : u));
    setModerators(prev => {
      const exists = prev.some(m => m.id === teacherId);
      if (exists) return prev.map(m => m.id === teacherId ? promotedUser : m);
      return [promotedUser, ...prev];
    });

    if (currentUser.id === teacherId) {
      setCurrentUser(promotedUser);
      setCurrentRole('moderator');
      setActiveMode('moderator');
    }

    return promotedUser;
  };

  const demoteModerator = (moderatorId: string) => {
    setModerators(prev => prev.filter(m => m.id !== moderatorId));
    setUsers(prev => prev.map(u => {
      if (u.id === moderatorId) {
        return { ...u, role: 'teacher', permissions: [] };
      }
      return u;
    }));

    if (currentUser.id === moderatorId) {
      setCurrentUser(prev => ({ ...prev, role: 'teacher', permissions: [] }));
      setCurrentRole('teacher');
      setActiveMode('teacher');
    }
  };

  const removeModerator = (moderatorId: string) => {
    demoteModerator(moderatorId);
  };

  const addXp = (amount: number) => {
    setStudentXp(prev => prev + amount);
    setCurrentUser(prev => ({ ...prev, xp: (prev.xp || 0) + amount }));
  };

  const joinClassroom = async (code: string): Promise<{ success: boolean; message: string; classroom?: any }> => {
    const formattedCode = (code || '').trim().toUpperCase();
    if (!formattedCode) return { success: false, message: 'Please enter a valid Join Code.' };
    
    const backendRes = await apiClient.joinClassroom(formattedCode, currentUser?.id);
    if (!backendRes || !backendRes.success) {
      return { 
        success: false, 
        message: backendRes?.message || 'Invalid or expired Join Code. Please verify with your teacher.' 
      };
    }

    // Refresh all classrooms from backend to get fresh rosters
    const classRes = await apiClient.getClassrooms();
    if (classRes && Array.isArray(classRes.classrooms)) {
      setClassrooms(classRes.classrooms);
    }

    if (backendRes.classroom) {
      const clsId = backendRes.classroom.id;
      if (!(currentUser?.enrolledClassroomIds || []).includes(clsId)) {
        const updatedUser: User = {
          ...currentUser,
          enrolledClassroomIds: [...(currentUser?.enrolledClassroomIds || []), clsId]
        };
        setCurrentUser(updatedUser);
        try {
          localStorage.setItem('papercode_user_session', JSON.stringify(updatedUser));
        } catch {}
      }
    }

    return { 
      success: true, 
      message: backendRes.message || 'Enrolled successfully!', 
      classroom: backendRes.classroom 
    };
  };

  const createClassroom = (name: string, gradeLevel: string, subject: string, courseIds: string[] = ['crs-py-basics']) => {
    const randomCode = 'CUET-' + Math.floor(100 + Math.random() * 900);
    const newClassroom: Classroom = {
      id: 'cls-' + Date.now(),
      name,
      gradeLevel,
      subject,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      joinCode: randomCode,
      archived: false,
      roster: [],
      assignments: [],
      courseIds: courseIds.length > 0 ? courseIds : ['crs-py-basics']
    };

    apiClient.createClassroom({ name, subject, grade: gradeLevel, teacherId: currentUser.id, courseIds });
    setClassrooms(prev => [newClassroom, ...prev]);
    return newClassroom;
  };

  const updateClassroom = (classroomId: string, data: Partial<Classroom>) => {
    setClassrooms(prev => prev.map(c => c.id === classroomId ? { ...c, ...data } : c));
  };

  const updateClassroomCourses = (classroomId: string, courseIds: string[]) => {
    setClassrooms(prev => prev.map(c => c.id === classroomId ? { ...c, courseIds } : c));
  };

  const removeStudentFromClassroom = (classroomId: string, studentId: string) => {
    apiClient.removeStudentFromClassroom(classroomId, studentId);
    setClassrooms(prev => prev.map(c => {
      if (c.id === classroomId) {
        return {
          ...c,
          roster: (c.roster || []).filter(s => s.studentId !== studentId)
        };
      }
      return c;
    }));
  };

  const deleteClassroom = (classroomId: string) => {
    apiClient.deleteClassroom(classroomId);
    setClassrooms(prev => prev.filter(c => c.id !== classroomId));
  };

  const regenerateJoinCode = (classroomId: string) => {
    const newCode = 'PC-' + Math.floor(1000 + Math.random() * 9000);
    setClassrooms(prev => prev.map(c => c.id === classroomId ? { ...c, joinCode: newCode } : c));
    return newCode;
  };

  const addAssignmentToClassroom = (
    classroomId: string,
    assignmentData: Omit<ClassroomAssignment, 'id' | 'totalSubmissions' | 'totalStudents' | 'status'>
  ) => {
    const newAssignment: ClassroomAssignment = {
      ...assignmentData,
      id: 'asg-' + Date.now(),
      totalSubmissions: 0,
      totalStudents: classrooms.find(c => c.id === classroomId)?.roster?.length || 0,
      status: 'active'
    };

    apiClient.addAssignmentToClassroom(classroomId, newAssignment);
    setClassrooms(prev => prev.map(c => {
      if (c.id === classroomId) {
        return {
          ...c,
          assignments: [newAssignment, ...(c.assignments || [])]
        };
      }
      return c;
    }));
  };

  const deleteAssignmentFromClassroom = (classroomId: string, assignmentId: string) => {
    apiClient.deleteAssignmentFromClassroom(classroomId, assignmentId);
    setClassrooms(prev => prev.map(c => {
      if (c.id === classroomId) {
        return {
          ...c,
          assignments: (c.assignments || []).filter(a => a.id !== assignmentId)
        };
      }
      return c;
    }));
  };

  const submitExercise = (submissionData: Omit<Submission, 'id' | 'submittedAt'>): Submission => {
    const newSub: Submission = {
      ...submissionData,
      id: 'sub-' + Date.now(),
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    apiClient.submitExercise(newSub);
    setSubmissions(prev => [newSub, ...prev]);
    addXp(150);
    if (activeLesson) {
      completeLesson(activeLesson.id);
    }
    return newSub;
  };

  const updateSubmissionGrade = (submissionId: string, score: number, feedback: string, teacherNotes?: string) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          score,
          feedback,
          teacherNotes: teacherNotes || sub.teacherNotes,
          status: 'graded',
          gradedBy: currentUser.name,
          gradedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return sub;
    }));
  };

  const applyBatchCurve = (assignmentId: string, curveBonusPercentage: number) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.assignmentId === assignmentId) {
        const bonus = (sub.maxScore * curveBonusPercentage) / 100;
        const newScore = Math.min(sub.maxScore, +(sub.score + bonus).toFixed(1));
        return {
          ...sub,
          score: newScore,
          status: 'graded',
          feedback: sub.feedback + ' [Class Curve: +' + curveBonusPercentage + '% applied]'
        };
      }
      return sub;
    }));
  };

  const addCourse = (course: Course) => {
    apiClient.createCourse({
      id: course.id,
      title: course.title,
      description: course.subtitle || course.description,
      language: course.language || 'python',
      level: course.level || 'Beginner',
      authorId: currentUser.id,
      authorName: currentUser.name
    });
    setCourses(prev => [course, ...prev]);
  };

  const updateCourse = (courseId: string, data: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...data } : c));
  };

  const deleteCourse = (courseId: string) => {
    apiClient.deleteCourse(courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const addModuleToCourse = (courseId: string, moduleData: any) => {
    apiClient.createModule(courseId, {
      title: moduleData.title,
      description: moduleData.description,
      sortOrder: (courses.find(c => c.id === courseId)?.modules?.length || 0) + 1
    });
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: [...(c.modules || []), moduleData]
        };
      }
      return c;
    }));
  };

  const updateLesson = (courseId: string, moduleId: string, lessonId: string, updatedLesson: Lesson) => {
    apiClient.createLesson(courseId, moduleId, {
      id: updatedLesson.id,
      title: updatedLesson.title,
      subtitle: updatedLesson.subtitle,
      theoryHtml: updatedLesson.theoryContent || (updatedLesson as any).theoryHtml || '',
      exercise: updatedLesson.exercise,
      mcq: updatedLesson.mcq,
      xpReward: updatedLesson.xpReward || 100
    });
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          modules: (course.modules || []).map(module => {
            if (module.id === moduleId) {
              const existingIdx = (module.lessons || []).findIndex(les => les.id === lessonId);
              const newLessons = existingIdx >= 0
                ? module.lessons.map(les => les.id === lessonId ? updatedLesson : les)
                : [...(module.lessons || []), updatedLesson];
              return {
                ...module,
                lessons: newLessons
              };
            }
            return module;
          })
        };
      }
      return course;
    }));

    if (activeLesson?.id === lessonId) {
      setActiveLesson(updatedLesson);
    }
  };

  const deleteLesson = (courseId: string, moduleId: string, lessonId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          modules: (course.modules || []).map(module => {
            if (module.id === moduleId) {
              return {
                ...module,
                lessons: (module.lessons || []).filter(les => les.id !== lessonId)
              };
            }
            return module;
          })
        };
      }
      return course;
    }));
  };

  const publishRoadmap = (roadmapId: string) => {
    setRoadmaps(prev => prev.map(r => r.id === roadmapId ? { ...r, isPublic: true } : r));
  };

  const updateRoadmap = (roadmapId: string, data: Partial<Roadmap>) => {
    setRoadmaps(prev => prev.map(r => r.id === roadmapId ? { ...r, ...data } : r));
  };

  const addRoadmap = (roadmapData: Omit<Roadmap, 'id'>): Roadmap => {
    const newRoadmap: Roadmap = {
      ...roadmapData,
      id: 'rdm-' + Date.now()
    };
    setRoadmaps(prev => [newRoadmap, ...prev]);
    return newRoadmap;
  };

  const deleteRoadmap = (roadmapId: string) => {
    setRoadmaps(prev => prev.filter(r => r.id !== roadmapId));
  };

  const addCourseToRoadmap = (roadmapId: string, courseId: string) => {
    const courseToAdd = courses.find(c => c.id === courseId);
    if (!courseToAdd) return;

    setRoadmaps(prev => prev.map(r => {
      if (r.id === roadmapId) {
        const alreadyExists = r.courses.some(c => c.id === courseId);
        if (!alreadyExists) {
          return {
            ...r,
            courses: [...r.courses, courseToAdd]
          };
        }
      }
      return r;
    }));
  };

  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...data } : u));
  };

  const removeCourseFromRoadmap = (roadmapId: string, courseId: string) => {
    setRoadmaps(prev => prev.map(r => {
      if (r.id === roadmapId) {
        return {
          ...r,
          courses: r.courses.filter(c => c.id !== courseId)
        };
      }
      return r;
    }));
  };

  return (
    <AppContext.Provider value={{
      activeMode,
      setActiveMode,
      currentRole,
      currentUser,
      switchRole,
      login,
      loginWithGoogle,
      signup,
      logout,
      users,
      moderators,
      addModerator,
      removeModerator,
      promoteTeacherToModerator,
      demoteModerator,
      classrooms,
      courses,
      roadmaps,
      submissions,
      activeLesson,
      setActiveLesson,
      completedLessonIds,
      completeLesson,
      isLessonUnlocked,
      studentXp,
      studentStreak,
      addXp,
      joinClassroom,
      createClassroom,
      updateClassroom,
      updateClassroomCourses,
      removeStudentFromClassroom,
      deleteClassroom,
      regenerateJoinCode,
      addAssignmentToClassroom,
      deleteAssignmentFromClassroom,
      submitExercise,
      updateSubmissionGrade,
      applyBatchCurve,
      addCourse,
      updateCourse,
      deleteCourse,
      addModuleToCourse,
      updateLesson,
      deleteLesson,
      publishRoadmap,
      updateRoadmap,
      addRoadmap,
      deleteRoadmap,
      addCourseToRoadmap,
      removeCourseFromRoadmap,
      updateUserProfile,
      enrollInCourse
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
