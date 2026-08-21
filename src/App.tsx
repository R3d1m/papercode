import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { TopNav } from './components/layout/TopNav';
import { HeroNotebook } from './components/marketing/HeroNotebook';
import { ProblemStats } from './components/marketing/ProblemStats';
import { WhyOthersFail } from './components/marketing/WhyOthersFail';
import { WriteScanRunFlow } from './components/marketing/WriteScanRunFlow';
import { Footer } from './components/marketing/Footer';
import { PublicRoadmapsPage } from './components/public/PublicRoadmapsPage';
import { PublicCoursesPage } from './components/public/PublicCoursesPage';
import { PublicPricingPage } from './components/public/PublicPricingPage';
import { PublicBlogsPage } from './components/public/PublicBlogsPage';
import { AuthModal } from './components/auth/AuthModal';
import { JoinClassModal } from './components/student/JoinClassModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentClassroomsView } from './components/student/StudentClassroomsView';
import { StudentClassroomDetailView } from './components/student/StudentClassroomDetailView';
import { StudentRoadmapsView } from './components/student/StudentRoadmapsView';
import { LessonPlayer } from './components/student/LessonPlayer';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherAnalyticsView } from './components/teacher/TeacherAnalyticsView';
import { CourseBuilder } from './components/teacher/CourseBuilder';
import { BatchGradingView } from './components/teacher/BatchGradingView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfileView } from './components/profile/ProfileView';
import { Classroom } from './types';

export const App: React.FC = () => {
  const { activeMode, setActiveMode } = useApp();
  
  // Navigation view state
  const [currentView, setCurrentView] = useState<string>('hero');
  const [previousView, setPreviousView] = useState<string>('student_dashboard');
  const [selectedClassroomForDetail, setSelectedClassroomForDetail] = useState<Classroom | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('login');
  const [joinModalOpen, setJoinModalOpen] = useState<boolean>(false);

  // Sync currentView whenever activeMode changes
  useEffect(() => {
    if (activeMode === 'student') {
      if (!currentView.startsWith('student_') && currentView !== 'profile' && currentView !== 'public_blogs') {
        setCurrentView('student_dashboard');
      }
    } else if (activeMode === 'teacher') {
      if (!currentView.startsWith('teacher_') && currentView !== 'profile' && currentView !== 'public_blogs') {
        setCurrentView('teacher_builder');
      }
    } else if (activeMode === 'moderator') {
      if (currentView !== 'profile' && currentView !== 'public_blogs') {
        setCurrentView('admin_cms');
      }
    } else if (activeMode === 'admin') {
      if (!currentView.startsWith('admin_') && currentView !== 'profile' && currentView !== 'public_blogs') {
        setCurrentView('admin_vitals');
      }
    } else if (activeMode === 'marketing') {
      if (!currentView.startsWith('public_') && currentView !== 'profile') {
        setCurrentView('hero');
      }
    }
  }, [activeMode]);

  const handleOpenAuth = (tab: 'login' | 'signup' = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleOpenJoinModal = () => {
    if (activeMode === 'marketing') {
      handleOpenAuth('signup');
    } else {
      setJoinModalOpen(true);
    }
  };

  const handleOpenClassroomDetail = (cls: Classroom) => {
    setSelectedClassroomForDetail(cls);
    setCurrentView('student_classroom_detail');
  };

  const handleOpenLesson = () => {
    setPreviousView(currentView);
    setCurrentView('student_lesson');
  };

  const handleBackFromLesson = () => {
    setCurrentView(previousView || 'student_dashboard');
  };

  const handleBackFromProfile = () => {
    if (activeMode === 'student') {
      setCurrentView('student_dashboard');
    } else if (activeMode === 'teacher') {
      setCurrentView('teacher_builder');
    } else if (activeMode === 'admin' || activeMode === 'moderator') {
      setCurrentView('admin_vitals');
    } else {
      setCurrentView('hero');
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-highlighter selection:text-ink">
      
      {/* Sleek Top Navigation Bar: Roadmaps | Courses | Pricing | Blogs */}
      <TopNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={handleOpenAuth}
        onOpenJoinModal={handleOpenJoinModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-12">
          
          {/* PROFILE VIEW (Shared across roles) */}
          {currentView === 'profile' ? (
            <ProfileView onBack={handleBackFromProfile} />
          ) : (
            <>
              {/* 1. PUBLIC MARKETING & DEDICATED PAGES */}
              {activeMode === 'marketing' && (
                <div>
                  {currentView === 'public_roadmaps' ? (
                    <PublicRoadmapsPage onOpenAuth={handleOpenAuth} />
                  ) : currentView === 'public_courses' ? (
                    <PublicCoursesPage onOpenAuth={handleOpenAuth} />
                  ) : currentView === 'public_pricing' ? (
                    <PublicPricingPage onOpenAuth={handleOpenAuth} />
                  ) : currentView === 'public_blogs' ? (
                    <PublicBlogsPage onOpenAuth={handleOpenAuth} />
                  ) : (
                    /* Default Clean Single-Page Landing */
                    <div className="space-y-16">
                      <section id="hero">
                        <HeroNotebook onOpenAuth={handleOpenAuth} />
                      </section>

                      <section id="digital-divide">
                        <ProblemStats />
                      </section>

                      <section id="why-others-fail">
                        <WhyOthersFail />
                      </section>

                      <section id="how-it-works">
                        <WriteScanRunFlow onOpenAuth={handleOpenAuth} />
                      </section>
                    </div>
                  )}
                </div>
              )}

              {/* 2. STUDENT PORTAL VIEWS */}
              {activeMode === 'student' && (
                <div>
                  {currentView === 'public_blogs' ? (
                    <PublicBlogsPage onOpenAuth={handleOpenAuth} />
                  ) : currentView === 'student_lesson' ? (
                    <LessonPlayer onBack={handleBackFromLesson} />
                  ) : currentView === 'student_classroom_detail' && selectedClassroomForDetail ? (
                    <StudentClassroomDetailView
                      classroom={selectedClassroomForDetail}
                      onBack={() => setCurrentView('student_classrooms')}
                      onOpenLesson={handleOpenLesson}
                    />
                  ) : currentView === 'student_classrooms' ? (
                    <StudentClassroomsView
                      onOpenLesson={handleOpenLesson}
                      onOpenJoinModal={handleOpenJoinModal}
                      onOpenClassroomDetail={handleOpenClassroomDetail}
                    />
                  ) : currentView === 'student_roadmaps' ? (
                    <StudentRoadmapsView
                      onOpenLesson={handleOpenLesson}
                    />
                  ) : (
                    <StudentDashboard
                      onOpenLesson={handleOpenLesson}
                      onOpenJoinModal={handleOpenJoinModal}
                    />
                  )}
                </div>
              )}

              {/* 3. TEACHER PORTAL VIEWS */}
              {activeMode === 'teacher' && (
                <div>
                  {currentView === 'public_blogs' ? (
                    <PublicBlogsPage onOpenAuth={handleOpenAuth} />
                  ) : currentView === 'teacher_gradebook' ? (
                    <BatchGradingView />
                  ) : currentView === 'teacher_classrooms' ? (
                    <TeacherDashboard />
                  ) : currentView === 'teacher_analytics' ? (
                    <TeacherAnalyticsView />
                  ) : (
                    <CourseBuilder />
                  )}
                </div>
              )}

              {/* 4. MODERATOR PORTAL VIEWS */}
              {activeMode === 'moderator' && (
                <div>
                  {currentView === 'public_blogs' ? (
                    <PublicBlogsPage onOpenAuth={handleOpenAuth} />
                  ) : currentView === 'teacher_builder' ? (
                    <CourseBuilder />
                  ) : currentView === 'teacher_gradebook' ? (
                    <BatchGradingView />
                  ) : currentView === 'teacher_classrooms' ? (
                    <TeacherDashboard />
                  ) : (
                    <AdminDashboard initialTab="courses" />
                  )}
                </div>
              )}

              {/* 5. ADMIN HQ VIEWS */}
              {activeMode === 'admin' && (
                <div>
                  {currentView === 'admin_courses' ? (
                    <AdminDashboard initialTab="courses" />
                  ) : currentView === 'admin_roadmaps' ? (
                    <AdminDashboard initialTab="roadmaps" />
                  ) : currentView === 'admin_blogs' ? (
                    <AdminDashboard initialTab="blogs" />
                  ) : currentView === 'admin_moderators' ? (
                    <AdminDashboard initialTab="moderators" />
                  ) : (
                    <AdminDashboard initialTab="vitals" />
                  )}
                </div>
              )}
            </>
          )}

        </main>

        {/* 100% Full-Width Footer */}
        {activeMode === 'marketing' && (
          <Footer onNavigate={(view) => setCurrentView(view)} />
        )}

      </div>

      {/* Global Auth Modal (Sign In & Sign Up only) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
      />

      {/* Dedicated Student Join Classroom Modal */}
      <JoinClassModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />

    </div>
  );
};
