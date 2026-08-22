import React from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { Classroom } from '../../types';
import { KeyRound, Users, GraduationCap, ArrowRight, School } from 'lucide-react';

interface StudentClassroomsViewProps {
  onOpenLesson: () => void;
  onOpenJoinModal: () => void;
  onOpenClassroomDetail: (classroom: Classroom) => void;
}

export const StudentClassroomsView: React.FC<StudentClassroomsViewProps> = ({
  onOpenLesson,
  onOpenJoinModal,
  onOpenClassroomDetail
}) => {
  const { classrooms, currentUser } = useApp();

  const enrolledClassrooms = classrooms.filter(c => 
    (currentUser?.enrolledClassroomIds || []).includes(c.id) ||
    (c.roster || []).some(r => r.studentId === currentUser?.id || (currentUser?.email && r.email === currentUser?.email))
  );

  return (
    <div className="space-y-8 py-2 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/15 pb-6">
        <div className="space-y-1">
          <div className="doodle-badge bg-highlighter text-ink">
            <School className="w-3.5 h-3.5 text-stamp" />
            <span>School Classrooms</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink">
            My Enrolled Classrooms
          </h1>
          <p className="text-xs sm:text-sm text-graphite font-medium">
            Join your school or teacher&apos;s live coding classroom to submit homework on paper and receive graded feedback.
          </p>
        </div>

        <PillButton
          variant="primary"
          size="md"
          onClick={onOpenJoinModal}
          className="btn-bounce shadow-solid-xs flex-shrink-0"
          icon={<KeyRound className="w-4 h-4" />}
        >
          + Enter Class Code to Join
        </PillButton>
      </div>

      {/* ZERO CLASSROOMS EMPTY STATE */}
      {enrolledClassrooms.length === 0 ? (
        <div className="p-10 sm:p-14 bg-paper-card border-2 border-ink rounded-[24px] text-center space-y-5 shadow-solid-md max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-highlighter border-2 border-ink flex items-center justify-center text-ink mx-auto shadow-solid-xs text-2xl">
            🏫
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-ink">You haven&apos;t joined any classrooms yet</h3>
            <p className="text-xs sm:text-sm text-graphite font-medium max-w-md mx-auto">
              Ask your ICT teacher for your school&apos;s 6-character Class Code (e.g. <span className="font-mono font-bold text-stamp">HAOR99</span>) to join your classroom.
            </p>
          </div>
          <div className="pt-2">
            <PillButton
              variant="highlighter"
              size="lg"
              onClick={onOpenJoinModal}
              className="btn-bounce shadow-solid-xs"
              icon={<KeyRound className="w-4 h-4 text-stamp" />}
            >
              Enter 6-Digit Class Code ➔
            </PillButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {enrolledClassrooms.map((cls) => (
            <BentoCard
              key={cls.id}
              variant="white"
              className="p-7 border-2 border-ink shadow-solid-md hover:shadow-solid-lg transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold rounded-full shadow-solid-xs">
                    {cls.gradeLevel || 'Class 9'}
                  </span>
                  <span className="font-mono text-xs font-bold text-graphite">
                    Code: <strong className="text-ink font-extrabold">{cls.joinCode}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-ink">{cls.name}</h3>
                  <p className="text-xs text-graphite mt-0.5 font-bold">
                    Subject: {cls.subject}
                  </p>
                </div>

                <div className="p-3 bg-paper-light border border-ink/20 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-stamp" />
                    <span className="font-bold text-ink">Teacher: {cls.teacherName || 'Teacher'}</span>
                  </div>
                  <span className="font-mono text-graphite font-bold">{cls.roster?.length || 0} Students</span>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/15 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-green-700">
                  ● Active Classroom
                </span>

                <PillButton
                  variant="highlighter"
                  size="md"
                  onClick={() => onOpenClassroomDetail(cls)}
                  className="btn-bounce shadow-solid-xs"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Enter Classroom ➔
                </PillButton>
              </div>
            </BentoCard>
          ))}
        </div>
      )}

    </div>
  );
};
