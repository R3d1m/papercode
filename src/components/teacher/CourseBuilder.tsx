import React, { useState } from 'react';
import { apiClient } from '../../services/apiClient';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { HtmlWriter } from './HtmlWriter';
import { Course, Module, Lesson, LessonBlock, TheoryBlock, McqBlock, ExerciseBlock } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  Code2, 
  CheckCircle2, 
  Save, 
  Trash2, 
  ChevronRight, 
  ArrowLeft, 
  FolderPlus, 
  FileText, 
  FilePlus, 
  Edit3,
  Copy,
  ArrowUp,
  ArrowDown,
  CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CourseBuilder: React.FC = () => {
  const { courses, addCourse, deleteCourse, addModuleToCourse, deleteModule, updateLesson, deleteLesson, currentUser } = useApp();

  const myCourses = currentUser.role === 'admin' ? courses : courses.filter(c => c.authorId === currentUser.id);
  const otherCourses = currentUser.role === 'admin' ? [] : courses.filter(c => c.authorId && c.authorId !== currentUser.id);

  // Navigation hierarchy state:
  const [step, setStep] = useState<'courses_list' | 'course_detail' | 'create_course' | 'create_module' | 'create_lesson' | 'preview_lesson'>('courses_list');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(myCourses[0]?.id || courses[0]?.id || '');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [previewingLesson, setPreviewingLesson] = useState<Lesson | null>(null);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [isSubmittingModule, setIsSubmittingModule] = useState(false);
  const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

  // Course Form
  const [newCourseTitle, setNewCourseTitle] = useState<string>('');
  const [newCourseSubtitle, setNewCourseSubtitle] = useState<string>('');
  const [newCourseDesc, setNewCourseDesc] = useState<string>('');
  const [newCourseCategory, setNewCourseCategory] = useState<string>('Python');
  const [newCourseLevel, setNewCourseLevel] = useState<string>('Beginner');

  // Module Form
  const [newModuleTitle, setNewModuleTitle] = useState<string>('');
  const [newModuleDesc, setNewModuleDesc] = useState<string>('');
  const [newModuleCategory, setNewModuleCategory] = useState<string>('Core Programming');

  // Lesson Form
  const [newLessonTitle, setNewLessonTitle] = useState<string>('Lesson 3.1: String Superpowers & Secret Ciphers');
  const [newLessonSubtitle, setNewLessonSubtitle] = useState<string>('String indexing, slicing, and building secret encoders');
  const [newLessonDuration, setNewLessonDuration] = useState<number>(20);
  const [newLessonXp, setNewLessonXp] = useState<number>(200);

  // Lesson Blocks State
  const [lessonBlocks, setLessonBlocks] = useState<LessonBlock[]>([
    {
      id: 'blk-th-1',
      type: 'theory',
      title: 'Part 1: Introduction to String Indexes',
      htmlContent: `<h3>String Indexing in Python</h3>\n<p>Every character in a word has a numeric position called an <strong>index</strong> starting from 0.</p>\n<div class="my-3 p-3 bg-paper-light border border-ink/20 rounded-xl font-mono text-xs text-ink">\n  <strong>word = "DHAKA"</strong><br/>\n  word[0] ➔ 'D'<br/>\n  word[1] ➔ 'H'<br/>\n  word[2] ➔ 'A'\n</div>`
    },
    {
      id: 'blk-mcq-1',
      type: 'mcq',
      question: 'Which of the following are valid ways to access letters in Python? (Select all that apply)',
      options: [
        { id: 'opt-1', text: 'word[0] (Returns the first character)' },
        { id: 'opt-2', text: 'word[-1] (Returns the last character from the right)' },
        { id: 'opt-3', text: 'word[0:3] (Returns a sliced substring)' },
        { id: 'opt-4', text: 'word{0} (Using curly braces)' }
      ],
      correctOptionIds: ['opt-1', 'opt-2', 'opt-3'],
      explanation: 'Python supports 0-based positive indexing, negative indexing (from the end), and slicing [start:stop]. Curly braces {} are for sets/dictionaries.'
    },
    {
      id: 'blk-ex-1',
      type: 'exercise',
      title: 'Exercise: Reverse the Secret Code',
      prompt: 'Write a Python program that creates a variable code = "PAPERCODE" and prints the word reversed using string slicing code[::-1].',
      language: 'python',
      languageId: 71,
      starterCode: '# Reverse the secret code:\ncode = "PAPERCODE"\n# Print reversed string:\n',
      solutionSnippet: 'code = "PAPERCODE"\nprint(code[::-1])',
      testCases: [
        { id: 'tc-1', input: '', expectedOutput: 'EDOCREPAP', description: 'Validate reversed word' }
      ],
      rubric: [
        { id: 'rb-1', title: 'Slicing Syntax', maxPoints: 5, description: 'Correct [::-1] usage' },
        { id: 'rb-2', title: 'Output Match', maxPoints: 5, description: 'Matches EDOCREPAP' }
      ]
    }
  ]);

  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const selectedModule = selectedCourse?.modules?.find(m => m.id === selectedModuleId);

  // START EDITING AN EXISTING PUBLISHED LESSON
  const handleStartEditLesson = (moduleId: string, lesson: Lesson) => {
    setSelectedModuleId(moduleId);
    setEditingLessonId(lesson.id);
    setNewLessonTitle(lesson.title);
    setNewLessonSubtitle(lesson.subtitle);
    setNewLessonDuration(lesson.durationMinutes);
    setNewLessonXp(lesson.xpReward);

    if (lesson.blocks && lesson.blocks.length > 0) {
      // Normalize MCQ blocks to ensure correctOptionIds exists
      const normalizedBlocks = lesson.blocks.map(b => {
        if (b.type === 'mcq') {
          const mcq = b as McqBlock;
          return {
            ...mcq,
            correctOptionIds: mcq.correctOptionIds || (mcq.correctOptionId ? [mcq.correctOptionId] : [mcq.options[0]?.id])
          };
        }
        return b;
      });
      setLessonBlocks(normalizedBlocks);
    } else {
      setLessonBlocks([
        {
          id: 'blk-th-' + Date.now(),
          type: 'theory',
          title: 'Lesson Theory Notes',
          htmlContent: `<h3>${lesson.title}</h3><p>${lesson.subtitle}</p><ul>${lesson.conceptNotes.map(n => `<li>${n}</li>`).join('')}</ul><pre class="bg-black text-green-400 p-3 rounded-xl font-mono text-xs"><code>${lesson.codeSnippet}</code></pre>`
        },
        {
          id: lesson.mcq.id,
          type: 'mcq',
          question: lesson.mcq.question,
          options: lesson.mcq.options,
          correctOptionIds: lesson.mcq.correctOptionIds || [lesson.mcq.correctOptionId],
          explanation: lesson.mcq.explanation
        },
        {
          id: lesson.exercise.id,
          type: 'exercise',
          title: lesson.exercise.title,
          prompt: lesson.exercise.prompt,
          language: lesson.exercise.language,
          languageId: lesson.exercise.languageId,
          starterCode: lesson.exercise.starterCode,
          solutionSnippet: lesson.exercise.solutionSnippet,
          testCases: lesson.exercise.testCases,
          rubric: lesson.exercise.rubric
        }
      ]);
    }

    setStep('create_lesson');
  };

  const handleStartNewLesson = (moduleId?: string) => {
    setEditingLessonId(null);
    if (moduleId) setSelectedModuleId(moduleId);
    setNewLessonTitle('New Lesson Title');
    setNewLessonSubtitle('Lesson subtitle and instructions');
    setNewLessonDuration(15);
    setNewLessonXp(150);
    setLessonBlocks([
      {
        id: 'blk-th-' + Date.now(),
        type: 'theory',
        title: 'Part 1: Concept & Syntax',
        htmlContent: '<h3>Concept Overview</h3><p>Explain the rules here...</p>'
      },
      {
        id: 'blk-mcq-' + Date.now(),
        type: 'mcq',
        question: 'Checkpoint Question',
        options: [
          { id: 'opt-1', text: 'Option A' },
          { id: 'opt-2', text: 'Option B' },
          { id: 'opt-3', text: 'Option C' }
        ],
        correctOptionIds: ['opt-1'],
        explanation: 'Explanation for students.'
      }
    ]);
    setStep('create_lesson');
  };

  // Block Manipulation Handlers
  const addTheoryBlock = () => {
    const newBlock: TheoryBlock = {
      id: 'blk-th-' + Date.now(),
      type: 'theory',
      title: `Part ${lessonBlocks.length + 1}: Theory Notes`,
      htmlContent: '<h3>New Concept Title</h3><p>Explain the concept rules here for students...</p>'
    };
    setLessonBlocks([...lessonBlocks, newBlock]);
  };

  const addMcqBlock = () => {
    const newBlock: McqBlock = {
      id: 'blk-mcq-' + Date.now(),
      type: 'mcq',
      question: 'New Checkpoint Question (Multiple answers can be selected):',
      options: [
        { id: 'opt-' + Date.now() + '-1', text: 'Option A' },
        { id: 'opt-' + Date.now() + '-2', text: 'Option B' },
        { id: 'opt-' + Date.now() + '-3', text: 'Option C' }
      ],
      correctOptionIds: ['opt-' + Date.now() + '-1'],
      explanation: 'Explanation for students.'
    };
    setLessonBlocks([...lessonBlocks, newBlock]);
  };

  // MCQ Options Handlers (Variable count & Multi-Select)
  const addOptionToMcq = (blockIndex: number) => {
    const updated = [...lessonBlocks];
    const mcq = updated[blockIndex] as McqBlock;
    const newOptId = 'opt-' + Date.now() + '-' + (mcq.options.length + 1);
    mcq.options.push({ id: newOptId, text: `Option ${String.fromCharCode(65 + mcq.options.length)}` });
    setLessonBlocks(updated);
  };

  const removeOptionFromMcq = (blockIndex: number, optionId: string) => {
    const updated = [...lessonBlocks];
    const mcq = updated[blockIndex] as McqBlock;
    if (mcq.options.length <= 2) return; // Keep minimum 2 options
    mcq.options = mcq.options.filter(o => o.id !== optionId);
    mcq.correctOptionIds = mcq.correctOptionIds.filter(id => id !== optionId);
    if (mcq.correctOptionIds.length === 0 && mcq.options.length > 0) {
      mcq.correctOptionIds = [mcq.options[0].id];
    }
    setLessonBlocks(updated);
  };

  const toggleCorrectOption = (blockIndex: number, optionId: string) => {
    const updated = [...lessonBlocks];
    const mcq = updated[blockIndex] as McqBlock;
    const current = mcq.correctOptionIds || [];
    
    if (current.includes(optionId)) {
      if (current.length > 1) {
        mcq.correctOptionIds = current.filter(id => id !== optionId);
      }
    } else {
      mcq.correctOptionIds = [...current, optionId];
    }
    setLessonBlocks(updated);
  };

  const addExerciseBlock = () => {
    const newBlock: ExerciseBlock = {
      id: 'blk-ex-' + Date.now(),
      type: 'exercise',
      title: 'Exercise: Coding Challenge',
      prompt: 'Write a Python program to solve this task...',
      language: 'python',
      languageId: 71,
      starterCode: '# Write code here:\n',
      solutionSnippet: 'print("Passed")',
      testCases: [{ id: 'tc-1', input: '', expectedOutput: 'Passed', description: 'Test Case' }],
      rubric: [{ id: 'rb-1', title: 'Logic', maxPoints: 10, description: 'Passes test' }]
    };
    setLessonBlocks([...lessonBlocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    if (lessonBlocks.length <= 1) return;
    setLessonBlocks(lessonBlocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessonBlocks.length) return;
    const updated = [...lessonBlocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setLessonBlocks(updated);
  };

  
  
  const handleDeleteModuleConfirm = (courseId: string, moduleId: string, moduleTitle: string) => {
    if (window.confirm(`Are you sure you want to delete module "${moduleTitle}" and all its lessons? This action cannot be undone.`)) {
      deleteModule(courseId, moduleId);
    }
  };

  const handleDeleteLessonConfirm = (courseId: string, moduleId: string, lessonId: string, lessonTitle?: string) => {
    if (window.confirm(`Are you sure you want to delete lesson ${lessonTitle ? `"${lessonTitle}"` : ''}? This action cannot be undone.`)) {
      deleteLesson(courseId, moduleId, lessonId);
    }
  };

  const handleDeleteCourseConfirm = (courseId: string, courseTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone and will delete all modules.`)) {
      deleteCourse(courseId);
      apiClient.deleteCourse(courseId).catch(() => {});
      if (selectedCourseId === courseId) {
        setSelectedCourseId(courses.find(c => c.id !== courseId)?.id || '');
        setStep('courses_list');
      }
    }
  };

  // Course / Module creation handlers
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || isSubmittingCourse) return;

    setIsSubmittingCourse(true);
    const newCourseObj: Course = {
      id: 'crs-' + Date.now(),
      title: newCourseTitle.trim(),
      subtitle: newCourseSubtitle.trim() || 'Course created by Teacher',
      description: newCourseDesc.trim() || 'Teacher authored course curriculum.',
      category: newCourseCategory,
      level: newCourseLevel,
      estimatedHours: 10,
      publishedBy: currentUser.role === 'admin' ? 'admin' : 'teacher',
      authorId: currentUser.id,
      authorName: currentUser.name || 'Verified Educator',
      colorAccent: '#E6F94E',
      isPublished: true,
      modules: []
    };

    addCourse(newCourseObj);
    apiClient.createCourse(newCourseObj).catch(() => {});
    setNewCourseTitle('');
    setNewCourseSubtitle('');
    setNewCourseDesc('');
    setSelectedCourseId(newCourseObj.id);
    setStep('course_detail');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setIsSubmittingCourse(false), 1000);
  };

  const handleCreateModule = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newModuleTitle.trim() || isSubmittingModule) return;

    const targetCourse = courses.find(c => c.id === selectedCourseId) || selectedCourse;
    if (!targetCourse) return;

    setIsSubmittingModule(true);
    const newModuleObj: Module = {
      id: 'mod-' + Date.now(),
      title: newModuleTitle.trim(),
      description: newModuleDesc.trim() || 'Module units & practice exercises.',
      category: newModuleCategory,
      isPublished: true,
      lessons: []
    };

    addModuleToCourse(targetCourse.id, newModuleObj);
    apiClient.createModule(targetCourse.id, newModuleObj).catch(() => {});
    setNewModuleTitle('');
    setNewModuleDesc('');
    setStep('course_detail');
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setIsSubmittingModule(false), 1000);
  };

  const handleSaveOrUpdateLesson = () => {
    if (!newLessonTitle.trim() || lessonBlocks.length === 0 || isSubmittingLesson) return;
    setIsSubmittingLesson(true);

    const firstMcq = (lessonBlocks.find(b => b.type === 'mcq') as McqBlock) || {
      id: 'mcq-1',
      question: 'Quiz question',
      options: [{ id: 'opt-1', text: 'Option A' }],
      correctOptionIds: ['opt-1'],
      correctOptionId: 'opt-1',
      explanation: 'Correct'
    };

    const firstExercise = (lessonBlocks.find(b => b.type === 'exercise') as ExerciseBlock) || {
      id: 'ex-1',
      title: 'Coding Challenge',
      prompt: 'Write code',
      language: 'python',
      languageId: 71,
      starterCode: '# write\n',
      solutionSnippet: 'print("done")',
      testCases: [{ id: 'tc-1', input: '', expectedOutput: 'done' }],
      rubric: [{ id: 'rb-1', title: 'Syntax', maxPoints: 10, description: 'Valid' }]
    };

    const targetModuleId = selectedModuleId || selectedCourse.modules?.[0]?.id;

    if (editingLessonId && targetModuleId) {
      const updatedLessonObj: Lesson = {
        id: editingLessonId,
        title: newLessonTitle,
        subtitle: newLessonSubtitle,
        durationMinutes: newLessonDuration,
        xpReward: newLessonXp,
        conceptNotes: ['Updated lesson concept rules.'],
        codeSnippet: '# Code updated\n',
        mcq: {
          ...firstMcq,
          correctOptionId: firstMcq.correctOptionIds?.[0] || 'opt-1'
        },
        exercise: firstExercise,
        blocks: lessonBlocks
      };

      updateLesson(selectedCourse.id, targetModuleId, editingLessonId, updatedLessonObj);
    } else {
      const newLessonObj: Lesson = {
        id: 'les-' + Date.now(),
        title: newLessonTitle,
        subtitle: newLessonSubtitle || 'Teacher multi-block lesson unit',
        durationMinutes: newLessonDuration,
        xpReward: newLessonXp,
        conceptNotes: ['Read notes carefully before solving exercises.'],
        codeSnippet: '# Example\nprint("Active")',
        mcq: {
          ...firstMcq,
          correctOptionId: firstMcq.correctOptionIds?.[0] || 'opt-1'
        },
        exercise: firstExercise,
        blocks: lessonBlocks
      };

      if (targetModuleId) {
        updateLesson(selectedCourse.id, targetModuleId, newLessonObj.id, newLessonObj);
      } else {
        const defaultModId = 'mod-' + Date.now();
        const defaultMod: Module = {
          id: defaultModId,
          title: 'Module 1: General Lessons',
          description: 'Default module',
          category: 'Core',
          isPublished: true,
          lessons: [newLessonObj]
        };
        addModuleToCourse(selectedCourse.id, defaultMod);
        updateLesson(selectedCourse.id, defaultModId, newLessonObj.id, newLessonObj);
      }
    }

    setPublishSuccess(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      setPublishSuccess(false);
      setIsSubmittingLesson(false);
      setStep('course_detail');
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* LEVEL 1: COURSES CREATED BY TEACHER LIST */}
      {step === 'courses_list' && (
        <div className="space-y-8">
          
          <div className="p-8 bg-paper-card border-[2px] border-ink rounded-bento shadow-solid-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold mb-2">
                <span>Teacher Course Manager</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
                Courses You Created & Teach
              </h1>
              <p className="text-xs sm:text-sm text-graphite mt-1">
                Select any course to edit already published lessons or create new modules and lessons.
              </p>
            </div>

            <PillButton
              variant="stamp"
              size="md"
              onClick={() => setStep('create_course')}
              className="btn-bounce"
              icon={<Plus className="w-4 h-4" />}
            >
              + Add a New Course
            </PillButton>
          </div>

          {myCourses.length === 0 ? (
            <div className="p-10 sm:p-14 bg-paper-card border-2 border-ink rounded-2xl text-center space-y-4 shadow-solid-xs max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-stamp text-white border-2 border-ink flex items-center justify-center mx-auto shadow-solid-xs text-2xl">
                📚
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-ink">You haven&apos;t created any courses yet</h3>
                <p className="text-xs sm:text-sm text-graphite font-medium">
                  Create your custom curriculum course, organize it into modules, and author interactive handwritten exercises with automated grading.
                </p>
              </div>
              <div className="pt-2">
                <PillButton
                  variant="stamp"
                  size="md"
                  onClick={() => setStep('create_course')}
                  className="btn-bounce shadow-solid-xs"
                  icon={<Plus className="w-4 h-4" />}
                >
                  + Add Your First Course
                </PillButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {myCourses.map((course) => (
                <BentoCard
                  key={course.id}
                  variant="white"
                  className="space-y-5 p-8 border-2 border-ink shadow-solid-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-paper-muted border border-ink/30 rounded-full font-mono text-xs font-bold text-ink">
                        {course.category} • {course.level}
                      </span>
                      <span className="text-xs font-mono font-extrabold text-stamp">
                        {(course.modules || []).length} Modules
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-extrabold text-ink">{course.title}</h3>
                      <p className="text-xs sm:text-sm text-graphite mt-1 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-ink/15 text-xs text-graphite">
                      <strong className="text-ink block">Modules inside this course:</strong>
                      {(course.modules || []).map((m) => (
                        <div key={m.id} className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-stamp">•</span>
                          <span>{m.title} ({(m.lessons || []).length} lessons)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-ink/15 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeleteCourseConfirm(course.id, course.title)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
                      title="Delete this course"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>

                    <PillButton
                      variant="highlighter"
                      size="md"
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setStep('course_detail');
                      }}
                      className="btn-bounce"
                      icon={<ChevronRight className="w-4 h-4" />}
                    >
                      Manage & Edit Lessons ➔
                    </PillButton>
                  </div>
                </BentoCard>
              ))}
            </div>
          )}

          {/* SECTION 2: EXPLORE COURSES CREATED BY OTHER EDUCATORS */}
          {otherCourses.length > 0 && (
            <div className="space-y-6 pt-6 border-t-2 border-ink/10">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-paper-muted border border-ink/30 text-ink font-mono text-xs font-extrabold mb-1">
                  <span>Community Curriculum</span>
                </div>
                <h2 className="text-2xl font-extrabold text-ink">
                  Explore Courses Created by Other Educators
                </h2>
                <p className="text-xs sm:text-sm text-graphite mt-1">
                  Inspect module outlines and exercise challenges created by educators across Bangladesh. (Read-only)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherCourses.map((course) => (
                  <BentoCard
                    key={course.id}
                    variant="white"
                    className="space-y-5 p-8 border-2 border-ink shadow-solid-md flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-paper-muted border border-ink/30 rounded-full font-mono text-xs font-bold text-ink">
                          {course.category} • {course.level}
                        </span>
                        <span className="text-xs font-mono font-bold text-graphite">
                          By {course.authorName || 'Educator'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl font-extrabold text-ink">{course.title}</h3>
                        <p className="text-xs sm:text-sm text-graphite mt-1 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-ink/15 text-xs text-graphite">
                        <strong className="text-ink block">Modules inside this course ({(course.modules || []).length}):</strong>
                        {(course.modules || []).map((m) => (
                          <div key={m.id} className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-stamp">•</span>
                            <span>{m.title} ({(m.lessons || []).length} lessons)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-ink/15 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-graphite font-bold">🔒 Read-Only Preview</span>
                      <PillButton
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setStep('course_detail');
                        }}
                        className="btn-bounce"
                        icon={<ChevronRight className="w-4 h-4" />}
                      >
                        Inspect Modules & Lessons ➔
                      </PillButton>
                    </div>
                  </BentoCard>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* LEVEL 2: COURSE DETAIL & MODULES LIST */}
      {step === 'course_detail' && (() => {
        const isMyCourse = selectedCourse.authorId === currentUser.id || !selectedCourse.authorId || currentUser.role === 'admin';
        return (
        <div className="space-y-8">
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('courses_list')}
              className="flex items-center space-x-2 text-sm font-extrabold text-graphite hover:text-ink transition-colors btn-bounce"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to All Courses</span>
            </button>

            {isMyCourse ? (
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleDeleteCourseConfirm(selectedCourse.id, selectedCourse.title)}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-400 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                  title="Delete this entire course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Course</span>
                </button>

                <PillButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setStep('create_module')}
                  className="btn-bounce"
                  icon={<FolderPlus className="w-4 h-4" />}
                >
                  + Add New Module
                </PillButton>

                <PillButton
                  variant="stamp"
                  size="sm"
                  onClick={() => handleStartNewLesson(selectedCourse.modules?.[0]?.id)}
                  className="btn-bounce"
                  icon={<FilePlus className="w-4 h-4" />}
                >
                  + Add New Lesson
                </PillButton>
              </div>
            ) : (
              <span className="px-3 py-1.5 bg-paper-muted border-2 border-ink rounded-full text-xs font-mono font-extrabold text-ink shadow-solid-xs">
                🔒 Read-Only Inspection Mode
              </span>
            )}
          </div>

          {!isMyCourse && (
            <div className="p-4 bg-amber-50 border-2 border-ink rounded-2xl flex items-center justify-between text-xs text-ink font-bold shadow-solid-xs">
              <span>🔒 You are inspecting a course created by <strong>{selectedCourse.authorName || 'Other Educator'}</strong>. You can preview all modules, theory, and exercises in read-only mode.</span>
              <span className="px-2.5 py-1 bg-paper-card border border-ink rounded-lg font-mono text-[10px] font-extrabold">Read Only</span>
            </div>
          )}

          <div className="p-8 bg-paper-card border-[2px] border-ink rounded-bento shadow-solid-md space-y-2">
            <span className="px-3 py-1 bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold rounded-full">
              Course: {selectedCourse.category}
            </span>
            <h1 className="text-3xl font-extrabold text-ink">{selectedCourse.title}</h1>
            <p className="text-sm text-graphite">{selectedCourse.description}</p>
          </div>

          {/* Modules Accordion Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2">
              <Layers className="w-6 h-6 text-stamp" />
              <span>Modules & Published Lessons</span>
            </h2>

            {(selectedCourse.modules || []).map((mod, modIdx) => (
              <BentoCard key={mod.id} variant="white" className="p-6 sm:p-8 border-2 border-ink shadow-solid-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-extrabold text-stamp uppercase">Module {modIdx + 1}</span>
                    <h3 className="text-xl font-extrabold text-ink">{mod.title}</h3>
                    <p className="text-xs text-graphite">{mod.description}</p>
                  </div>

                  {isMyCourse ? (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteModuleConfirm(selectedCourse.id, mod.id, mod.title)}
                        className="px-2.5 py-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        title="Delete this module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Module</span>
                      </button>

                      <PillButton
                        variant="highlighter"
                        size="sm"
                        onClick={() => handleStartNewLesson(mod.id)}
                        className="btn-bounce"
                        icon={<Plus className="w-3.5 h-3.5" />}
                      >
                        + Add Lesson
                      </PillButton>
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-graphite font-bold">
                      {(mod.lessons || []).length} Lessons
                    </span>
                  )}
                </div>

                {/* Published Lessons list with EDIT buttons */}
                <div className="space-y-2 pt-2 border-t border-ink/15">
                  <span className="text-xs font-bold text-graphite block">
                    Published Lessons ({(mod.lessons || []).length}):
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(mod.lessons || []).map((les, lesIdx) => (
                      <div key={les.id} className="p-4 bg-paper-light border border-ink/20 rounded-2xl flex items-center justify-between text-xs space-x-3">
                        <div className="overflow-hidden space-y-0.5">
                          <strong className="text-ink block truncate font-extrabold">
                            {lesIdx + 1}. {les.title}
                          </strong>
                          <span className="text-[10px] text-graphite block">
                            {les.durationMinutes} mins • {les.xpReward} XP • {(les.blocks || []).length || 3} items
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          {isMyCourse ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEditLesson(mod.id, les)}
                                className="px-2.5 py-1.5 bg-highlighter hover:bg-highlighter-hover border border-ink rounded-lg font-bold text-[11px] text-ink flex items-center gap-1 shadow-solid-xs btn-bounce"
                                title="Edit this published lesson"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteLessonConfirm(selectedCourse.id, mod.id, les.id, les.title)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewingLesson(les);
                                setStep('preview_lesson');
                              }}
                              className="px-3 py-1.5 bg-paper-card hover:bg-paper-muted border border-ink rounded-lg font-bold text-[11px] text-ink flex items-center gap-1.5 shadow-solid-xs btn-bounce"
                              title="Inspect lesson contents in read-only mode"
                            >
                              <span>👁️ Inspect</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BentoCard>
            ))}

            {(selectedCourse.modules || []).length === 0 && (
              <div className="p-8 text-center bg-paper-muted border border-dashed border-ink/40 rounded-2xl space-y-3">
                <p className="text-sm font-bold text-ink">No modules in this course yet.</p>
                <PillButton variant="stamp" size="sm" onClick={() => setStep('create_module')}>
                  + Add First Module
                </PillButton>
              </div>
            )}
          </div>

        </div>
        );
      })()}

      {/* MODAL / FORM: CREATE NEW COURSE */}
      {step === 'create_course' && (
        <BentoCard variant="white" className="p-8 sm:p-10 border-2 border-ink shadow-solid-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-ink/15">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">+ Add a New Course</h2>
              <p className="text-xs text-graphite">Define course metadata for your school ICT curriculum.</p>
            </div>
            <button onClick={() => setStep('courses_list')} className="text-xs font-bold text-gray-500 hover:text-ink">
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
            <div>
              <label className="font-extrabold text-ink block mb-1">Course Title:</label>
              <input
                type="text"
                placeholder="e.g. HSC ICT Chapter 5: C Programming Masterclass"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                className="w-full p-3 bg-paper-light border border-ink/30 rounded-xl font-bold text-ink text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-extrabold text-ink block mb-1">Category / Language:</label>
                <select
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value)}
                  className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl font-bold"
                >
                  <option>Python</option>
                  <option>C++</option>
                  <option>HSC ICT</option>
                  <option>JavaScript</option>
                  <option>Algorithms</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-ink block mb-1">Target Difficulty Level:</label>
                <select
                  value={newCourseLevel}
                  onChange={(e) => setNewCourseLevel(e.target.value)}
                  className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl font-bold"
                >
                  <option>Beginner (Class 6-8)</option>
                  <option>Intermediate (Class 9-10)</option>
                  <option>HSC ICT (Class 11-12)</option>
                  <option>Olympiad (BdOI Prep)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-ink block mb-1">Course Description:</label>
              <textarea
                rows={3}
                placeholder="Describe what students will learn on notebook paper and mobile..."
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl font-medium"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <PillButton variant="secondary" size="md" onClick={() => setStep('courses_list')}>
                Cancel
              </PillButton>
              <PillButton type="submit" variant="stamp" size="md" disabled={isSubmittingCourse} className="btn-bounce">
                {isSubmittingCourse ? 'Creating Course...' : 'Create Course & Add Modules ➔'}
              </PillButton>
            </div>
          </form>
        </BentoCard>
      )}

      {/* MODAL / FORM: CREATE NEW MODULE */}
      {step === 'create_module' && (
        <BentoCard variant="white" className="p-8 sm:p-10 border-2 border-ink shadow-solid-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-ink/15">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">+ Add Module to &quot;{selectedCourse.title}&quot;</h2>
              <p className="text-xs text-graphite">Group related lessons and coding challenges together.</p>
            </div>
            <button onClick={() => setStep('course_detail')} className="text-xs font-bold text-gray-500 hover:text-ink">
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateModule} className="space-y-4 text-xs">
            <div>
              <label className="font-extrabold text-ink block mb-1">Module Name:</label>
              <input
                type="text"
                placeholder="e.g. Module 3: String Slicing & Secret Ciphers"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="w-full p-3 bg-paper-light border border-ink/30 rounded-xl font-bold text-ink text-sm"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-ink block mb-1">Module Description:</label>
              <textarea
                rows={2}
                placeholder="Brief summary of skills taught in this module..."
                value={newModuleDesc}
                onChange={(e) => setNewModuleDesc(e.target.value)}
                className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <PillButton variant="secondary" size="md" onClick={() => setStep('course_detail')}>
                Cancel
              </PillButton>
              <PillButton type="submit" variant="highlighter" size="md" disabled={isSubmittingModule} className="btn-bounce">
                {isSubmittingModule ? 'Saving Module...' : 'Save Module ➔'}
              </PillButton>
            </div>
          </form>
        </BentoCard>
      )}

      
      {/* LEVEL 3: READ-ONLY LESSON INSPECTION MODAL / VIEW */}
      {step === 'preview_lesson' && previewingLesson && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('course_detail')}
              className="flex items-center space-x-2 text-sm font-extrabold text-graphite hover:text-ink transition-colors btn-bounce"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Course Outline</span>
            </button>

            <span className="px-3 py-1 bg-yellow-100 border border-ink rounded-full text-xs font-mono font-extrabold text-ink shadow-solid-xs">
              🔒 Read-Only Inspection Mode
            </span>
          </div>

          <div className="p-8 bg-paper-card border-2 border-ink rounded-bento shadow-solid-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold rounded-full">
                Lesson Preview
              </span>
              <span className="text-xs font-mono font-bold text-graphite">
                ⏱ {previewingLesson.durationMinutes || 20} mins • 💎 {previewingLesson.xpReward || 100} XP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">{previewingLesson.title}</h1>
            <p className="text-xs sm:text-sm text-graphite font-medium">{previewingLesson.subtitle}</p>
          </div>

          {/* Theory Notes */}
          <BentoCard variant="white" className="p-6 sm:p-8 border-2 border-ink shadow-solid-sm space-y-4">
            <h3 className="text-lg font-extrabold text-ink flex items-center gap-2">
              <FileText className="w-5 h-5 text-stamp" />
              <span>Theory Content & Concepts</span>
            </h3>
            <div 
              className="prose prose-sm max-w-none text-ink text-xs sm:text-sm leading-relaxed p-4 bg-paper-light border border-ink/20 rounded-2xl"
              dangerouslySetInnerHTML={{ __html: previewingLesson.theoryHtml || previewingLesson.theoryContent || 'No theory content.' }}
            />
          </BentoCard>

          {/* MCQ Checkpoint */}
          {previewingLesson.mcq && previewingLesson.mcq.question && (
            <BentoCard variant="white" className="p-6 sm:p-8 border-2 border-ink shadow-solid-sm space-y-4">
              <h3 className="text-lg font-extrabold text-ink flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-stamp" />
                <span>Checkpoint Quiz</span>
              </h3>
              <div className="p-4 bg-paper-light border border-ink/20 rounded-2xl space-y-3 text-xs">
                <p className="font-extrabold text-ink text-sm">{previewingLesson.mcq.question}</p>
                <div className="space-y-2">
                  {(previewingLesson.mcq.options || []).map((opt: any) => {
                    const isCorrect = (previewingLesson.mcq.correctOptionIds || [previewingLesson.mcq.correctOptionId]).includes(opt.id);
                    return (
                      <div key={opt.id} className={'p-3 rounded-xl border flex items-center justify-between font-medium ' + (isCorrect ? 'bg-green-100 border-green-700 text-green-950 font-bold' : 'bg-white border-ink/20 text-ink')}>
                        <span>{opt.text}</span>
                        {isCorrect && <span className="text-[10px] font-mono font-extrabold uppercase text-green-800">✓ Correct Answer</span>}
                      </div>
                    );
                  })}
                </div>
                {previewingLesson.mcq.explanation && (
                  <p className="text-[11px] text-graphite italic pt-1 border-t border-ink/10">
                    💡 Explanation: {previewingLesson.mcq.explanation}
                  </p>
                )}
              </div>
            </BentoCard>
          )}

          {/* Exercise Details */}
          {previewingLesson.exercise && previewingLesson.exercise.title && (
            <BentoCard variant="white" className="p-6 sm:p-8 border-2 border-ink shadow-solid-sm space-y-4">
              <h3 className="text-lg font-extrabold text-ink flex items-center gap-2">
                <Code2 className="w-5 h-5 text-stamp" />
                <span>Coding Exercise: {previewingLesson.exercise.title}</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-paper-light border border-ink/20 rounded-2xl space-y-2">
                  <span className="font-mono text-[10px] uppercase font-extrabold text-stamp block">Challenge Prompt</span>
                  <p className="text-ink font-medium leading-relaxed">{previewingLesson.exercise.prompt}</p>
                </div>

                {previewingLesson.exercise.starterCode && (
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-graphite block">Starter Template:</span>
                    <pre className="p-3 bg-black text-green-400 font-mono text-xs rounded-xl overflow-x-auto">
                      <code>{previewingLesson.exercise.starterCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            </BentoCard>
          )}

          <div className="pt-2 flex justify-end">
            <PillButton
              variant="secondary"
              size="md"
              onClick={() => setStep('course_detail')}
              className="btn-bounce"
            >
              Back to Course Outline ➔
            </PillButton>
          </div>
        </div>
      )}

      {/* LEVEL 3 & 4: LESSON EDITOR / CREATOR */}
      {step === 'create_lesson' && (
        <div className="space-y-8">
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('course_detail')}
              className="flex items-center space-x-2 text-sm font-extrabold text-graphite hover:text-ink transition-colors btn-bounce"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Course Modules</span>
            </button>

            <PillButton
              variant="stamp"
              size="md"
              disabled={isSubmittingLesson}
              onClick={handleSaveOrUpdateLesson}
              className="btn-bounce"
              icon={<Save className="w-4 h-4" />}
            >
              {isSubmittingLesson ? 'Saving Lesson...' : (editingLessonId ? 'Update & Save Published Lesson 🚀' : 'Publish Multi-Item Lesson 🚀')}
            </PillButton>
          </div>

          {publishSuccess && (
            <div className="p-4 bg-green-100 border-2 border-green-600 rounded-2xl flex items-center space-x-3 text-green-900 font-extrabold text-sm shadow-solid-sm animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-green-700" />
              <span>
                {editingLessonId ? '✓ Published lesson updated successfully!' : '✓ Lesson published successfully!'}
              </span>
            </div>
          )}

          {/* Lesson Metadata Bar */}
          <BentoCard variant="white" className="p-6 sm:p-8 border-2 border-ink shadow-solid-sm space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 bg-highlighter border border-ink font-mono text-xs font-bold rounded-full">
                {editingLessonId ? 'Editing Published Lesson' : 'Creating New Lesson'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-extrabold text-ink block mb-1">Lesson Title:</label>
                <input
                  type="text"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl font-bold text-ink"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-ink block mb-1">Total XP Reward:</label>
                <input
                  type="number"
                  value={newLessonXp}
                  onChange={(e) => setNewLessonXp(Number(e.target.value))}
                  className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl font-mono font-bold text-center"
                />
              </div>
            </div>
          </BentoCard>

          {/* ADD MULTIPLE ITEMS / BLOCKS TOOLBAR */}
          <div className="p-6 bg-paper-card border-[2px] border-ink rounded-2xl shadow-solid-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-ink flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-stamp" />
                  <span>Lesson Items Sequence ({lessonBlocks.length} Items)</span>
                </h3>
                <p className="text-xs text-graphite">
                  Add unlimited Theory notes, MCQs (with variable options & multiple correct answers), and Coding Challenges!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={addTheoryBlock}
                  className="px-3 py-2 bg-highlighter hover:bg-highlighter-hover border-[1.5px] border-ink rounded-xl text-xs font-extrabold text-ink flex items-center gap-1.5 shadow-solid-sm btn-bounce"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Theory HTML</span>
                </button>

                <button
                  type="button"
                  onClick={addMcqBlock}
                  className="px-3 py-2 bg-paper-light hover:bg-paper-muted border-[1.5px] border-ink rounded-xl text-xs font-extrabold text-ink flex items-center gap-1.5 shadow-solid-sm btn-bounce"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Checkpoint MCQ</span>
                </button>

                <button
                  type="button"
                  onClick={addExerciseBlock}
                  className="px-3 py-2 bg-stamp hover:bg-stamp/90 text-white border-[1.5px] border-ink rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-solid-sm btn-bounce"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Coding Challenge</span>
                </button>
              </div>
            </div>
          </div>

          {/* SEQUENTIAL LIST OF ALL BLOCKS */}
          <div className="space-y-6">
            {lessonBlocks.map((block, idx) => (
              <BentoCard
                key={block.id}
                variant={block.type === 'mcq' ? 'kraft' : 'white'}
                className="p-6 sm:p-8 border-2 border-ink shadow-solid-md space-y-4 relative"
              >
                {/* Block Header & Reordering Controls */}
                <div className="flex items-center justify-between pb-3 border-b border-ink/15">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-ink text-white font-mono text-xs font-extrabold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-mono text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-ink bg-paper-card text-ink">
                        {block.type === 'theory' && '📖 Theory / HTML Content'}
                        {block.type === 'mcq' && '🎯 Checkpoint MCQ (Variable & Multi-Answer)'}
                        {block.type === 'exercise' && '✍️ Coding Challenge'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => moveBlock(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-lg border border-ink/30 hover:bg-paper-muted disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(idx, 'down')}
                      disabled={idx === lessonBlocks.length - 1}
                      className="p-1 rounded-lg border border-ink/30 hover:bg-paper-muted disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      disabled={lessonBlocks.length <= 1}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 ml-2"
                      title="Delete Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 1. THEORY BLOCK EDITOR */}
                {block.type === 'theory' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-extrabold text-ink block mb-1">Theory Section Title:</label>
                      <input
                        type="text"
                        value={(block as TheoryBlock).title || ''}
                        onChange={(e) => {
                          const updated = [...lessonBlocks];
                          (updated[idx] as TheoryBlock).title = e.target.value;
                          setLessonBlocks(updated);
                        }}
                        className="w-full p-2 bg-paper-light border border-ink/30 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <HtmlWriter
                      initialHtml={(block as TheoryBlock).htmlContent}
                      onChange={(newHtml) => {
                        const updated = [...lessonBlocks];
                        (updated[idx] as TheoryBlock).htmlContent = newHtml;
                        setLessonBlocks(updated);
                      }}
                    />
                  </div>
                )}

                {/* 2. MCQ BLOCK EDITOR WITH VARIABLE OPTIONS & MULTIPLE CORRECT ANSWERS */}
                {block.type === 'mcq' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-extrabold text-ink block mb-1">Question Prompt:</label>
                      <input
                        type="text"
                        value={(block as McqBlock).question}
                        onChange={(e) => {
                          const updated = [...lessonBlocks];
                          (updated[idx] as McqBlock).question = e.target.value;
                          setLessonBlocks(updated);
                        }}
                        className="w-full p-2.5 bg-white border border-ink/30 rounded-xl font-bold"
                      />
                    </div>

                    {/* Options list with variable count and checkbox multi-correct */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="font-extrabold text-ink block">
                          Options & Correct Answers ({((block as McqBlock).options || []).length} Options):
                        </label>
                        <span className="text-[10px] font-mono text-stamp font-bold">
                          ✓ Check all boxes that are correct answers
                        </span>
                      </div>

                      {((block as McqBlock).options || []).map((opt, optIdx) => {
                        const isCorrect = ((block as McqBlock).correctOptionIds || []).includes(opt.id);

                        return (
                          <div key={opt.id} className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-ink/20 shadow-solid-xs">
                            <label className="flex items-center space-x-1.5 cursor-pointer pl-1">
                              <input
                                type="checkbox"
                                checked={isCorrect}
                                onChange={() => toggleCorrectOption(idx, opt.id)}
                                className="w-4 h-4 accent-green-600 rounded cursor-pointer"
                              />
                              <span className="text-[10px] font-bold text-graphite">
                                {isCorrect ? '✓ Correct' : 'Option'}
                              </span>
                            </label>

                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const updated = [...lessonBlocks];
                                (updated[idx] as McqBlock).options[optIdx].text = e.target.value;
                                setLessonBlocks(updated);
                              }}
                              className="flex-1 p-1.5 bg-paper-light border border-ink/20 rounded-lg text-xs font-medium text-ink"
                            />

                            <button
                              type="button"
                              onClick={() => removeOptionFromMcq(idx, opt.id)}
                              disabled={(block as McqBlock).options.length <= 2}
                              className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-20"
                              title="Delete Option"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Add Option Button */}
                      <button
                        type="button"
                        onClick={() => addOptionToMcq(idx)}
                        className="px-3 py-1.5 bg-white hover:bg-paper-light border border-dashed border-ink/40 rounded-xl text-xs font-bold text-ink flex items-center gap-1.5 btn-bounce"
                      >
                        <Plus className="w-3.5 h-3.5 text-stamp" />
                        <span>+ Add Another Option</span>
                      </button>
                    </div>

                    <div>
                      <label className="font-extrabold text-ink block mb-1">Student Explanation:</label>
                      <input
                        type="text"
                        value={(block as McqBlock).explanation}
                        onChange={(e) => {
                          const updated = [...lessonBlocks];
                          (updated[idx] as McqBlock).explanation = e.target.value;
                          setLessonBlocks(updated);
                        }}
                        className="w-full p-2 bg-white border border-ink/30 rounded-xl text-xs text-graphite"
                      />
                    </div>
                  </div>
                )}

                {/* 3. EXERCISE BLOCK EDITOR */}
                {block.type === 'exercise' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-extrabold text-ink block mb-1">Challenge Title:</label>
                      <input
                        type="text"
                        value={(block as ExerciseBlock).title}
                        onChange={(e) => {
                          const updated = [...lessonBlocks];
                          (updated[idx] as ExerciseBlock).title = e.target.value;
                          setLessonBlocks(updated);
                        }}
                        className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-extrabold text-ink block mb-1">Problem Prompt for Students:</label>
                      <textarea
                        rows={2}
                        value={(block as ExerciseBlock).prompt}
                        onChange={(e) => {
                          const updated = [...lessonBlocks];
                          (updated[idx] as ExerciseBlock).prompt = e.target.value;
                          setLessonBlocks(updated);
                        }}
                        className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-ink block mb-1">Starter Code Template:</label>
                      <textarea
                        rows={3}
                        value={(block as ExerciseBlock).starterCode}
                        onChange={(e) => {
                          const updated = [...lessonBlocks];
                          (updated[idx] as ExerciseBlock).starterCode = e.target.value;
                          setLessonBlocks(updated);
                        }}
                        className="w-full p-2.5 bg-black text-green-300 font-mono rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-ink block mb-1 flex items-center justify-between">
                        <span>Expected Output (Judge0 Test):</span>
                        <span className="text-[10px] font-mono text-graphite font-semibold">Supports Multiple Lines</span>
                      </label>
                      <textarea
                        rows={3}
                        value={(block as ExerciseBlock).testCases[0]?.expectedOutput || ''}
                        onChange={(e) => {
                          const updated = [...lessonBlocks];
                          if (!(updated[idx] as ExerciseBlock).testCases) {
                            (updated[idx] as ExerciseBlock).testCases = [{ id: 'tc-1', input: '', expectedOutput: '' }];
                          }
                          (updated[idx] as ExerciseBlock).testCases[0].expectedOutput = e.target.value;
                          setLessonBlocks(updated);
                        }}
                        placeholder="Enter expected standard output (multiple lines supported)..."
                        className="w-full p-2.5 bg-paper-light border border-ink/30 rounded-xl font-mono text-xs font-bold leading-relaxed whitespace-pre resize-y focus:outline-none focus:border-ink"
                      />
                    </div>
                  </div>
                )}

              </BentoCard>
            ))}
          </div>

          {/* Bottom Toolbar & Save */}
          <div className="pt-6 border-t border-ink/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={addTheoryBlock}
                className="px-3 py-2 bg-highlighter border border-ink rounded-xl text-xs font-bold text-ink"
              >
                + Add Theory
              </button>
              <button
                type="button"
                onClick={addMcqBlock}
                className="px-3 py-2 bg-paper-light border border-ink rounded-xl text-xs font-bold text-ink"
              >
                + Add MCQ
              </button>
              <button
                type="button"
                onClick={addExerciseBlock}
                className="px-3 py-2 bg-stamp text-white border border-ink rounded-xl text-xs font-bold"
              >
                + Add Challenge
              </button>
            </div>

            <PillButton
              variant="stamp"
              size="lg"
              onClick={handleSaveOrUpdateLesson}
              className="btn-bounce"
              icon={<Save className="w-4 h-4" />}
            >
              {editingLessonId ? 'Update & Save Published Lesson 🚀' : 'Publish Multi-Item Lesson 🚀'}
            </PillButton>
          </div>

        </div>
      )}

    </div>
  );
};
