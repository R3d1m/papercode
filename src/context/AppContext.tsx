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
  login: (email: string, role?: Role) => { success: boolean; message: string; user?: User };
  signup: (userData: { name: string; email: string; role: Role; school?: string; division?: string }) => { success: boolean; message: string; user?: User };
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
  joinClassroom: (code: string) => { success: boolean; message: string; classroom?: Classroom };
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMode, setActiveMode] = useState<'marketing' | 'student' | 'teacher' | 'moderator' | 'admin'>('marketing');
  const [currentRole, setCurrentRole] = useState<Role>('student');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_STUDENT);
  
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [moderators, setModerators] = useState<User[]>(SEED_MODERATORS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(SEED_CLASSROOMS);
  const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(SEED_ROADMAPS);
  const [submissions, setSubmissions] = useState<Submission[]>(SEED_SUBMISSIONS);
  
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(SEED_COURSES[0].modules[0].lessons[0]);
  const [studentXp, setStudentXp] = useState<number>(0);
  const [studentStreak, setStudentStreak] = useState<number>(0);

  // Sync classrooms from backend on mount with safe object normalization
  useEffect(() => {
    apiClient.getClassrooms().then(res => {
      if (res && res.classrooms && Array.isArray(res.classrooms) && res.classrooms.length > 0) {
        const normalized = res.classrooms.map((c: any) => ({
          id: c.id,
          name: c.name || 'Classroom',
          gradeLevel: c.gradeLevel || c.grade || 'Class 9',
          subject: c.subject || 'ICT',
          teacherId: c.teacherId || c.teacher_id || '',
          teacherName: c.teacherName || 'Teacher',
          joinCode: c.joinCode || c.join_code || 'PC-1000',
          archived: Boolean(c.archived),
          roster: Array.isArray(c.roster) ? c.roster : [],
          assignments: Array.isArray(c.assignments) ? c.assignments : [],
          courseIds: Array.isArray(c.courseIds) ? c.courseIds : ['crs-py-basics']
        }));

        setClassrooms(prev => {
          const ids = new Set(prev.map(c => c.id));
          const newOnes = normalized.filter((c: any) => !ids.has(c.id));
          return [...newOnes, ...prev];
        });
      }
    }).catch(e => {
      console.warn('Classroom sync skipped:', e);
    });
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

  const login = (email: string, role?: Role) => {
    const formattedEmail = email.trim().toLowerCase();
    
    // Call backend API
    apiClient.login(formattedEmail, role);

    if (formattedEmail.includes('admin') || formattedEmail === CURRENT_ADMIN.email.toLowerCase()) {
      setCurrentUser(CURRENT_ADMIN);
      setCurrentRole('admin');
      setActiveMode('admin');
      return { success: true, message: 'Logged in as Admin HQ', user: CURRENT_ADMIN };
    }

    const matchedUser = users.find(u => u.email.toLowerCase() === formattedEmail);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      setCurrentRole(matchedUser.role);
      setActiveMode(matchedUser.role);
      setStudentXp(matchedUser.xp);
      setStudentStreak(matchedUser.streak);
      console.log('Existing user found:', matchedUser);
      return { success: true, message: 'Welcome back, ' + matchedUser.name + '!', user: matchedUser };
    }

    // Default clean user session (0 courses, 0 classrooms)
    const freshUser: User = {
      id: 'usr-' + Date.now(),
      name: formattedEmail.split('@')[0].replace('.', ' '),
      email: formattedEmail,
      role: role || 'student',
      school: 'Independent Learner',
      division: 'Dhaka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      xp: 0,
      streak: 0,
      completedLessons: [],
      enrolledClassroomIds: [],
      enrolledRoadmapIds: [],
      joinedAt: new Date().toISOString().slice(0, 10)
    };

    setUsers(prev => [freshUser, ...prev]);
    setCurrentUser(freshUser);
    setCurrentRole(freshUser.role);
    setActiveMode(freshUser.role);
    setStudentXp(0);
    setStudentStreak(0);

    return { success: true, message: 'Signed in successfully!', user: freshUser };
  };

  const signup = (userData: { name: string; email: string; role: Role; school?: string; division?: string }) => {
    // Send to backend API
    apiClient.signup(userData);

    // Clean initial state: 0 XP, 0 streak, 0 pre-enrolled courses, 0 classrooms
    const newUser: User = {
      id: 'usr-' + Date.now(),
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
    setCompletedLessonIds([]);

    return { success: true, message: 'Account created successfully for ' + newUser.name + '!', user: newUser };
  };

  const logout = () => {
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

  const joinClassroom = (code: string) => {
    const formattedCode = (code || '').trim().toUpperCase();
    if (!formattedCode) return { success: false, message: 'Please enter a 6-digit Join Code.' };
    apiClient.joinClassroom(formattedCode, currentUser?.id);

    const found = classrooms.find(c => (c?.joinCode || (c as any)?.join_code || '').toUpperCase() === formattedCode);
    if (found) {
      if (!(currentUser?.enrolledClassroomIds || []).includes(found.id)) {
        setCurrentUser(prev => ({
          ...prev,
          enrolledClassroomIds: [...(prev.enrolledClassroomIds || []), found.id]
        }));
      }
      return { success: true, message: 'Enrolled in ' + (found.name || 'Classroom') + ' successfully!', classroom: found };
    }
    return { success: false, message: 'Invalid or expired 6-character Join Code. Please verify with your teacher.' };
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

    apiClient.createClassroom({ name, subject, grade: gradeLevel, teacherId: currentUser.id });
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
    setClassrooms(prev => prev.map(c => {
      if (c.id === classroomId) {
        return {
          ...c,
          roster: c.roster.filter(s => s.studentId !== studentId)
        };
      }
      return c;
    }));
  };

  const deleteClassroom = (classroomId: string) => {
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
      totalStudents: classrooms.find(c => c.id === classroomId)?.roster.length || 0,
      status: 'active'
    };

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
    setCourses(prev => [course, ...prev]);
  };

  const updateCourse = (courseId: string, data: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...data } : c));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const addModuleToCourse = (courseId: string, moduleData: any) => {
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
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          modules: (course.modules || []).map(module => {
            if (module.id === moduleId) {
              return {
                ...module,
                lessons: (module.lessons || []).map(les => les.id === lessonId ? updatedLesson : les)
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
