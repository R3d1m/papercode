import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { SubmissionReviewModal } from './SubmissionReviewModal';
import { Submission, Classroom } from '../../types';
import { 
  Users, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  Eye, 
  Terminal, 
  Camera, 
  BookOpen, 
  KeyRound, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export const BatchGradingView: React.FC = () => {
  const { submissions, classrooms, courses, updateSubmissionGrade, applyBatchCurve } = useApp();
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('all');
  const [activeSubmissionForReview, setActiveSubmissionForReview] = useState<Submission | null>(null);
  const [curvePercentage, setCurvePercentage] = useState<number>(5);

  const selectedClassroom: Classroom | undefined = classrooms.find(c => c.id === selectedClassroomId);

  const filteredSubmissions = selectedClassroomId === 'all' 
    ? submissions 
    : submissions.filter(s => s.classroomId === selectedClassroomId);

  const handleExportCSV = () => {
    const headers = 'ID,Student Name,School,Classroom,Exercise,Submission Type,OCR Confidence,Score,Max Score,Status\n';
    const rows = filteredSubmissions.map(s => {
      const cls = classrooms.find(c => c.id === s.classroomId);
      return `"${s.id}","${s.studentName}","${s.studentSchool}","${cls?.name || 'Classroom'}","${s.exerciseTitle}","${s.submissionType}","${s.ocrConfidence || 'N/A'}%","${s.score}","${s.maxScore}","${s.status}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PaperCode_Grades_${selectedClassroomId}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 py-2 max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER & BATCH ACTIONS BAR */}
      <div className="p-6 sm:p-8 bg-paper-card border-2 border-ink rounded-bento shadow-solid-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold mb-1">
            <span>Teacher Evaluation Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Batch Gradebook & Student Answers
          </h1>
          <p className="text-xs sm:text-sm text-graphite font-medium">
            Select a classroom below to inspect student submissions. Review handwritten photos or typed code, grade answers, and export marks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Curve Control */}
          <div className="flex items-center space-x-2 bg-paper-muted border-2 border-ink/30 rounded-full px-3.5 py-1.5 text-xs">
            <span className="font-extrabold text-ink">Curve:</span>
            <input
              type="number"
              value={curvePercentage}
              onChange={(e) => setCurvePercentage(Number(e.target.value))}
              className="w-12 text-center bg-white border-2 border-ink/40 rounded-lg px-1 font-mono font-extrabold text-ink"
            />
            <span className="font-bold text-ink">%</span>
            <button
              onClick={() => applyBatchCurve('asg-1', curvePercentage)}
              className="bg-stamp text-white px-3 py-1 rounded-full font-extrabold hover:bg-stamp-dark text-xs transition-all shadow-solid-xs btn-bounce"
            >
              Apply Curve
            </button>
          </div>

          <PillButton
            variant="secondary"
            size="md"
            onClick={handleExportCSV}
            className="btn-bounce"
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </PillButton>
        </div>
      </div>

      {/* 2. CLASSROOM SELECTOR TILES (SHOW CLASSROOMS CLEARLY) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-extrabold uppercase text-graphite tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-stamp" />
            <span>Select Classroom to Inspect Answers ({classrooms.length} Active Classes)</span>
          </span>
          {selectedClassroomId !== 'all' && (
            <button
              onClick={() => setSelectedClassroomId('all')}
              className="text-xs font-extrabold text-stamp underline hover:text-stamp-dark"
            >
              View All Classrooms Combined
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Option A: All Classrooms Pill */}
          <div
            onClick={() => setSelectedClassroomId('all')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all btn-bounce flex flex-col justify-between space-y-3 ${selectedClassroomId === 'all' ? 'bg-highlighter border-ink shadow-solid-md' : 'bg-paper-card border-ink/30 hover:border-ink shadow-solid-xs'}`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-paper-light border border-ink/30 rounded-full font-mono text-[10px] font-extrabold text-ink">
                All Classes Combined
              </span>
              <span className="font-mono text-xs font-extrabold text-ink">
                {submissions.length} Answers
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-ink">All Enrolled Classrooms</h3>
              <p className="text-xs text-graphite font-medium mt-0.5">
                Overview across all {classrooms.length} batches and {classrooms.reduce((acc, c) => acc + c.roster.length, 0)} students.
              </p>
            </div>

            <div className="pt-2 border-t border-ink/20 flex items-center justify-between text-xs font-extrabold text-ink">
              <span>{classrooms.length} Classrooms Active</span>
              <span>{selectedClassroomId === 'all' ? '● Active View' : 'Click to Filter ➔'}</span>
            </div>
          </div>

          {/* Option B: Individual Classrooms */}
          {classrooms.map((cls) => {
            const clsSubmissions = submissions.filter(s => s.classroomId === cls.id);
            const isSelected = selectedClassroomId === cls.id;
            const assignedCourses = courses.filter(c => (cls.courseIds || []).includes(c.id));

            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClassroomId(cls.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all btn-bounce flex flex-col justify-between space-y-3 ${isSelected ? 'bg-highlighter border-ink shadow-solid-md' : 'bg-paper-card border-ink/30 hover:border-ink shadow-solid-xs'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-paper-light border border-ink/30 rounded-full font-mono text-[10px] font-extrabold text-ink">
                    {cls.gradeLevel} • Code: {cls.joinCode}
                  </span>
                  <span className="font-mono text-xs font-extrabold text-stamp">
                    {clsSubmissions.length} Submissions
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-ink">{cls.name}</h3>
                  <p className="text-xs text-graphite font-medium mt-0.5">
                    {assignedCourses.map(c => c.title).join(', ') || cls.subject}
                  </p>
                </div>

                <div className="pt-2 border-t border-ink/20 flex items-center justify-between text-xs font-extrabold text-ink">
                  <span>{cls.roster.length} Students in Roster</span>
                  <span>{isSelected ? '● Active Filter' : 'Inspect Answers ➔'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SUBMISSIONS TABLE (TYPE-AWARE BUTTONS: REVIEW PHOTO vs REVIEW CODE) */}
      <div className="border-2 border-ink bg-paper-card rounded-bento overflow-hidden shadow-solid-md space-y-0">
        
        {/* Table Top Info Header */}
        <div className="p-4 bg-paper-muted border-b-2 border-ink flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-stamp" />
            <strong className="text-xs font-extrabold text-ink font-mono uppercase">
              {selectedClassroom ? `Submissions for ${selectedClassroom.name}` : 'All Student Submissions'} ({filteredSubmissions.length})
            </strong>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono font-bold text-graphite">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-ink inline-block"></span>
              <span>Photo: {filteredSubmissions.filter(s => s.submissionType === 'photo').length}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-ink inline-block"></span>
              <span>Typed Code: {filteredSubmissions.filter(s => s.submissionType === 'typed').length}</span>
            </span>
          </div>
        </div>

        {/* Submissions List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-paper-light border-b-2 border-ink font-mono text-graphite uppercase text-[11px] font-extrabold">
                <th className="p-4">Student & School</th>
                <th className="p-4">Classroom</th>
                <th className="p-4">Exercise Task</th>
                <th className="p-4">Submission Mode</th>
                <th className="p-4">OCR / IDE</th>
                <th className="p-4">Judge0 Status</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink/15">
              {filteredSubmissions.map((sub) => {
                const cls = classrooms.find(c => c.id === sub.classroomId);

                return (
                  <tr key={sub.id} className="hover:bg-paper-muted/50 transition-colors">
                    
                    {/* Student */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={sub.studentAvatar} alt={sub.studentName} className="w-8 h-8 rounded-full border-2 border-ink object-cover" />
                        <div>
                          <strong className="text-sm font-extrabold text-ink block">{sub.studentName}</strong>
                          <span className="text-[11px] text-graphite font-bold">{sub.studentSchool}</span>
                        </div>
                      </div>
                    </td>

                    {/* Classroom */}
                    <td className="p-4 font-mono font-bold text-ink">
                      <span className="px-2.5 py-1 bg-paper-muted border border-ink/20 rounded-xl">
                        {cls?.name || 'Class 9-A ICT'}
                      </span>
                    </td>

                    {/* Exercise */}
                    <td className="p-4 font-extrabold text-ink">
                      {sub.exerciseTitle}
                    </td>

                    {/* Type: Photo vs Typed */}
                    <td className="p-4">
                      {sub.submissionType === 'photo' ? (
                        <span className="px-3 py-1 rounded-full font-mono text-[10px] font-extrabold bg-amber-100 text-amber-950 border-2 border-amber-500 inline-flex items-center gap-1.5 shadow-solid-xs">
                          <Camera className="w-3.5 h-3.5 text-amber-700" />
                          <span>Handwritten Photo</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full font-mono text-[10px] font-extrabold bg-blue-100 text-blue-950 border-2 border-blue-500 inline-flex items-center gap-1.5 shadow-solid-xs">
                          <Terminal className="w-3.5 h-3.5 text-blue-700" />
                          <span>Typed Code</span>
                        </span>
                      )}
                    </td>

                    {/* OCR Conf / IDE */}
                    <td className="p-4 font-mono font-extrabold text-graphite">
                      {sub.submissionType === 'photo' ? (
                        <span className="text-stamp font-extrabold">{sub.ocrConfidence || 98}% OCR</span>
                      ) : (
                        <span className="text-blue-700 font-bold">Mobile IDE</span>
                      )}
                    </td>

                    {/* Judge0 Status */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-extrabold bg-green-100 text-green-950 border-2 border-green-700">
                        {sub.executionResult.status.description}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="p-4">
                      <div className="flex items-center space-x-1 font-mono font-extrabold text-sm text-ink">
                        <span>{sub.score}</span>
                        <span className="text-graphite font-normal text-xs">/ {sub.maxScore}</span>
                      </div>
                    </td>

                    {/* Action Button: Review Photo vs Review Code */}
                    <td className="p-4 text-right">
                      {sub.submissionType === 'photo' ? (
                        <button
                          type="button"
                          onClick={() => setActiveSubmissionForReview(sub)}
                          className="inline-flex items-center space-x-1.5 bg-highlighter hover:bg-highlighter-hover text-ink px-3.5 py-1.5 rounded-full font-extrabold text-xs transition-all border-2 border-ink shadow-solid-xs btn-bounce"
                        >
                          <Camera className="w-3.5 h-3.5 text-ink" />
                          <span>Review Photo</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveSubmissionForReview(sub)}
                          className="inline-flex items-center space-x-1.5 bg-white hover:bg-paper-muted text-ink px-3.5 py-1.5 rounded-full font-extrabold text-xs transition-all border-2 border-ink shadow-solid-xs btn-bounce"
                        >
                          <Terminal className="w-3.5 h-3.5 text-blue-700" />
                          <span>Review Code</span>
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="p-12 text-center text-graphite font-medium">
            No submissions found for the selected classroom.
          </div>
        )}
      </div>

      {/* 4. SIDE BY SIDE SUBMISSION REVIEW MODAL */}
      <SubmissionReviewModal
        submission={activeSubmissionForReview}
        onClose={() => setActiveSubmissionForReview(null)}
        onSaveGrade={updateSubmissionGrade}
      />

    </div>
  );
};
