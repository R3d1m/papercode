import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { HeroNotebook } from '../components/marketing/HeroNotebook';
import { ProblemStats } from '../components/marketing/ProblemStats';
import { WhyOthersFail } from '../components/marketing/WhyOthersFail';
import { WriteScanRunFlow } from '../components/marketing/WriteScanRunFlow';
import { LivePlaygroundSection } from '../components/marketing/LivePlaygroundSection';
import { PublicRoadmapsPage } from '../components/public/PublicRoadmapsPage';
import { PublicCoursesPage } from '../components/public/PublicCoursesPage';
import { PublicPricingPage } from '../components/public/PublicPricingPage';
import { PublicBlogsPage } from '../components/public/PublicBlogsPage';
import { PublicPlaygroundPage } from '../components/public/PublicPlaygroundPage';
import { StudentDashboard } from '../components/student/StudentDashboard';
import { StudentClassroomsView } from '../components/student/StudentClassroomsView';
import { StudentClassroomDetailView } from '../components/student/StudentClassroomDetailView';
import { StudentRoadmapsView } from '../components/student/StudentRoadmapsView';
import { LessonPlayer } from '../components/student/LessonPlayer';
import { CourseDetailView } from '../components/student/CourseDetailView';
import { TeacherDashboard } from '../components/teacher/TeacherDashboard';
import { TeacherAnalyticsView } from '../components/teacher/TeacherAnalyticsView';
import { CourseBuilder } from '../components/teacher/CourseBuilder';
import { BatchGradingView } from '../components/teacher/BatchGradingView';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { ProfileView } from '../components/profile/ProfileView';
import { NotFoundPage } from '../pages/NotFoundPage';
import { Lesson } from '../types';

// 1. PUBLIC LANDING PAGE (Auto-redirects authenticated users to their role workspace)
const PublicLandingPage: React.FC = () => {
  const { currentUser, activeMode, openAuthModal } = useApp();

  const isAuthenticated = currentUser && currentUser.id !== 'usr-guest' && activeMode !== 'marketing' && Boolean(currentUser.email);

  if (isAuthenticated) {
    const effectiveRole = currentUser?.role || activeMode;
    if (effectiveRole === 'teacher') {
      return <Navigate to="/teacher/courses" replace />;
    }
    if (effectiveRole === 'admin') {
      return <Navigate to="/admin/vitals" replace />;
    }
    if (effectiveRole === 'moderator') {
      return <Navigate to="/moderator/roadmaps" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div className="space-y-16 animate-fadeIn">
      <section id="hero">
        <HeroNotebook onOpenAuth={(tab) => openAuthModal(tab || 'signup')} />
      </section>
      <section id="live-playground">
        <LivePlaygroundSection />
      </section>
      <section id="digital-divide">
        <ProblemStats />
      </section>
      <section id="why-others-fail">
        <WhyOthersFail />
      </section>
      <section id="how-it-works">
        <WriteScanRunFlow onOpenAuth={(tab) => openAuthModal(tab || 'signup')} />
      </section>
    </div>
  );
};

// 2. COURSE DETAIL ROUTE ADAPTER
const CourseDetailRoutePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, activeMode, setActiveLesson, openAuthModal } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!courses.some(c => c.id === courseId));

  const course = courses.find(c => c.id === courseId);

  useEffect(() => {
    if (course) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [course, courses]);

  const handleOpenLesson = (lesson?: Lesson) => {
    if (activeMode === 'marketing') {
      openAuthModal('signup');
    } else {
      if (lesson) setActiveLesson(lesson);
      navigate('/student/lesson');
    }
  };

  if (!course) {
    if (loading) {
      return (
        <div className="max-w-4xl mx-auto py-24 text-center space-y-4 animate-fadeIn">
          <div className="w-10 h-10 border-4 border-stamp border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-sm font-extrabold text-graphite">Loading course curriculum...</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4 p-8 bg-paper-card border-2 border-ink rounded-2xl shadow-solid-md animate-fadeIn">
        <h2 className="text-2xl font-extrabold text-ink">Course Not Found</h2>
        <p className="text-sm text-graphite">The requested course "{courseId}" could not be loaded or was removed.</p>
        <button
          onClick={() => navigate(activeMode === 'student' ? '/student/dashboard' : '/courses')}
          className="px-6 py-2.5 bg-highlighter hover:bg-highlighter-hover border-2 border-ink rounded-xl font-extrabold text-xs shadow-solid-sm btn-bounce"
        >
          ← Back to All Courses
        </button>
      </div>
    );
  }

  return (
    <CourseDetailView
      course={course}
      onBack={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate(activeMode === 'student' ? '/student/dashboard' : '/courses');
        }
      }}
      onOpenLesson={handleOpenLesson}
    />
  );
};

// 3. STUDENT CLASSROOM DETAIL ROUTE ADAPTER
const StudentClassroomDetailRoutePage: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { classrooms, setActiveLesson } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!classrooms.some(c => c.id === classroomId));

  const classroom = classrooms.find(c => c.id === classroomId);

  useEffect(() => {
    if (classroom) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [classroom, classrooms]);

  if (!classroom) {
    if (loading) {
      return (
        <div className="max-w-4xl mx-auto py-24 text-center space-y-4 animate-fadeIn">
          <div className="w-10 h-10 border-4 border-stamp border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-sm font-extrabold text-graphite">Loading classroom...</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4 p-8 bg-paper-card border-2 border-ink rounded-2xl shadow-solid-md animate-fadeIn">
        <h2 className="text-2xl font-extrabold text-ink">Classroom Not Found</h2>
        <p className="text-sm text-graphite">The requested classroom could not be found.</p>
        <button
          onClick={() => navigate('/student/classrooms')}
          className="px-6 py-2.5 bg-highlighter hover:bg-highlighter-hover border-2 border-ink rounded-xl font-extrabold text-xs shadow-solid-sm btn-bounce"
        >
          ← Back to My Classrooms
        </button>
      </div>
    );
  }

  return (
    <StudentClassroomDetailView
      classroom={classroom}
      onBack={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/student/classrooms');
        }
      }}
      onOpenLesson={(lesson) => {
        if (lesson) setActiveLesson(lesson);
        navigate('/student/lesson');
      }}
    />
  );
};

// 4. LESSON PLAYER ROUTE ADAPTER
const LessonPlayerRoutePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <LessonPlayer
      onBack={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/student/dashboard');
        }
      }}
    />
  );
};

// 5. PROFILE ROUTE ADAPTER
const ProfileRoutePage: React.FC = () => {
  const { activeMode } = useApp();
  const navigate = useNavigate();

  return (
    <ProfileView
      onBack={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate(activeMode === 'student' ? '/student/dashboard' : (activeMode === 'teacher' ? '/teacher/courses' : '/'));
        }
      }}
    />
  );
};

export const AppRoutes: React.FC = () => {
  const { openAuthModal, openJoinModal } = useApp();
  const navigate = useNavigate();

  // Automatic clean up of any legacy hash URLs (e.g. /#/admin/vitals -> /admin/vitals)
  useEffect(() => {
    if (window.location.hash) {
      let cleanHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
      if (!cleanHash.startsWith('/')) cleanHash = '/' + cleanHash;
      window.history.replaceState(null, '', cleanHash);
      navigate(cleanHash, { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* ========================================================= */}
        {/* 1. PUBLIC & MARKETING ROUTES (Accessible by everyone)    */}
        {/* ========================================================= */}
        <Route path="/" element={<PublicLandingPage />} />
        <Route path="/home" element={<PublicLandingPage />} />
        <Route path="/roadmaps" element={<PublicRoadmapsPage onOpenAuth={(tab) => openAuthModal(tab || 'signup')} />} />
        <Route path="/courses" element={<PublicCoursesPage onOpenAuth={(tab) => openAuthModal(tab || 'signup')} onOpenCourseDetail={(c) => navigate('/courses/' + c.id)} />} />
        <Route path="/courses/:courseId" element={<CourseDetailRoutePage />} />
        <Route path="/pricing" element={<PublicPricingPage onOpenAuth={(tab) => openAuthModal(tab || 'signup')} />} />
        <Route path="/blogs" element={<PublicBlogsPage onOpenAuth={(tab) => openAuthModal(tab || 'signup')} />} />
        <Route path="/blogs/:blogId" element={<PublicBlogsPage onOpenAuth={(tab) => openAuthModal(tab || 'signup')} />} />

        {/* ========================================================= */}
        {/* 2. STUDENT PORTAL ROUTES (Strictly Students)              */}
        {/* ========================================================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Navigate to="/student/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard 
                onOpenLesson={() => navigate('/student/lesson')} 
                onOpenJoinModal={openJoinModal} 
                onOpenCourseDetail={(c) => navigate('/student/courses/' + c.id)} 
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/classrooms"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentClassroomsView 
                onOpenLesson={() => navigate('/student/lesson')} 
                onOpenJoinModal={openJoinModal} 
                onOpenClassroomDetail={(cls) => navigate('/student/classrooms/' + cls.id)} 
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/classrooms/:classroomId"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentClassroomDetailRoutePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/roadmaps"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentRoadmapsView onOpenLesson={() => navigate('/student/lesson')} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'moderator', 'admin']}>
              <CourseDetailRoutePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/lesson"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'moderator', 'admin']}>
              <LessonPlayerRoutePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/lesson/:lessonId"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'moderator', 'admin']}>
              <LessonPlayerRoutePage />
            </ProtectedRoute>
          }
        />

        {/* CODE RUNNER / PLAYGROUND (Authenticated only) */}
        <Route
          path="/playground"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'moderator', 'admin']}>
              <PublicPlaygroundPage onOpenAuth={(tab) => openAuthModal(tab || 'signup')} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/playground"
          element={<Navigate to="/playground" replace />}
        />

        {/* ========================================================= */}
        {/* 3. TEACHER PORTAL ROUTES (Strictly Teachers, Admins)      */}
        {/* ========================================================= */}
        <Route
          path="/teacher"
          element={<Navigate to="/teacher/courses" replace />}
        />
        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin', 'moderator']}>
              <CourseBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/builder"
          element={<Navigate to="/teacher/courses" replace />}
        />
        <Route
          path="/teacher/classrooms"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin', 'moderator']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/grading"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin', 'moderator']}>
              <BatchGradingView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/gradebook"
          element={<Navigate to="/teacher/grading" replace />}
        />
        <Route
          path="/teacher/analytics"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin', 'moderator']}>
              <TeacherAnalyticsView />
            </ProtectedRoute>
          }
        />

        {/* ========================================================= */}
        {/* 4. MODERATOR PORTAL ROUTES (Moderators, Admins)           */}
        {/* ========================================================= */}
        <Route
          path="/moderator"
          element={<Navigate to="/moderator/roadmaps" replace />}
        />
        <Route
          path="/moderator/roadmaps"
          element={
            <ProtectedRoute allowedRoles={['moderator', 'admin']}>
              <AdminDashboard initialTab="roadmaps" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator/courses"
          element={
            <ProtectedRoute allowedRoles={['moderator', 'admin']}>
              <AdminDashboard initialTab="courses" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator/blogs"
          element={
            <ProtectedRoute allowedRoles={['moderator', 'admin']}>
              <AdminDashboard initialTab="blogs" />
            </ProtectedRoute>
          }
        />

        {/* ========================================================= */}
        {/* 5. ADMIN HQ ROUTES (Strictly Admins)                      */}
        {/* ========================================================= */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/vitals" replace />}
        />
        <Route
          path="/admin/vitals"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard initialTab="vitals" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard initialTab="courses" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roadmaps"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard initialTab="roadmaps" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard initialTab="blogs" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/moderators"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard initialTab="moderators" />
            </ProtectedRoute>
          }
        />

        {/* ========================================================= */}
        {/* 6. USER PROFILE & SETTINGS (Authenticated Users)          */}
        {/* ========================================================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'moderator', 'admin']}>
              <ProfileRoutePage />
            </ProtectedRoute>
          }
        />

        {/* ========================================================= */}
        {/* 7. NOT FOUND / 404 CATCH-ALL                             */}
        {/* ========================================================= */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
