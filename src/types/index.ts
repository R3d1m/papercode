export type Role = 'student' | 'teacher' | 'moderator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  school?: string;
  division?: string;
  xp: number;
  streak: number;
  completedLessons: string[];
  enrolledClassroomIds: string[];
  enrolledRoadmapIds: string[];
  permissions?: string[];
  addedBy?: string;
  joinedAt?: string;
}

export type LessonBlockType = 'theory' | 'mcq' | 'exercise';

export interface TheoryBlock {
  id: string;
  type: 'theory';
  title?: string;
  htmlContent: string;
}

export interface McqBlock {
  id: string;
  type: 'mcq';
  question: string;
  options: { id: string; text: string }[];
  correctOptionIds: string[];
  correctOptionId?: string;
  explanation: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  maxPoints: number;
  description: string;
}

export interface ExerciseBlock {
  id: string;
  type: 'exercise';
  title: string;
  prompt: string;
  language: string;
  languageId: number;
  starterCode: string;
  solutionSnippet: string;
  testCases: TestCase[];
  rubric: RubricCriterion[];
}

export type LessonBlock = TheoryBlock | McqBlock | ExerciseBlock;

export interface MCQ {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  correctOptionIds?: string[];
  explanation: string;
}

export interface Exercise {
  id: string;
  title: string;
  prompt: string;
  language: string;
  languageId: number;
  starterCode: string;
  solutionSnippet: string;
  testCases: TestCase[];
  rubric: RubricCriterion[];
}

export interface Judge0ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
  exit_code: number;
}

export interface Lesson {
  id: string;
  moduleId?: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  xpReward: number;
  conceptNotes: string[];
  codeSnippet: string;
  theoryContent?: string;
  theoryHtml?: string;
  mcq: MCQ;
  exercise: Exercise;
  blocks?: LessonBlock[];
  sortOrder?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  lessons: Lesson[];
  isPublished: boolean;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  level: string;
  estimatedHours?: number;
  publishedBy?: 'admin' | 'teacher' | 'moderator';
  authorId?: string;
  authorName: string;
  language?: string;
  isPublished?: boolean;
  modules: Module[];
  colorAccent?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  badge: string;
  targetAudience: string;
  courses: Course[];
  isPublic: boolean;
  totalXp: number;
  enrolledCount: number;
}

export interface ClassroomAssignment {
  id: string;
  title: string;
  moduleId?: string;
  moduleTitle?: string;
  courseTitle?: string;
  assignedDate: string;
  dueDate: string;
  totalSubmissions: number;
  totalStudents: number;
  status: 'active' | 'grading_needed' | 'completed';
  description?: string;
  maxScore?: number;
}

export interface Classroom {
  id: string;
  name: string;
  gradeLevel: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  joinCode: string;
  archived: boolean;
  roster: {
    studentId: string;
    name: string;
    email?: string;
    school?: string;
    avatar: string;
    division: string;
    completedAssignmentsCount: number;
    averageScore: number;
    lastActive: string;
  }[];
  assignments: ClassroomAssignment[];
  courseIds: string[];
}

export interface Submission {
  id: string;
  assignmentId?: string;
  classroomId?: string;
  exerciseId: string;
  exerciseTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentSchool: string;
  submittedAt: string;
  submissionType: 'photo' | 'typed';
  ocrConfidence?: number;
  handwrittenImageUrl?: string;
  code: string;
  language: string;
  executionResult: {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    status: {
      id: number;
      description: string;
    };
    time: string;
    memory: number;
    exit_code: number;
  };
  testCaseResults: {
    testCaseId: string;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
  }[];
  score: number;
  maxScore: number;
  feedback: string;
  teacherNotes?: string;
  status: 'submitted' | 'auto_graded' | 'graded';
  gradedBy?: string;
  gradedAt?: string;
}

export interface InstitutionalAccount {
  id: string;
  name: string;
  type: 'NGO' | 'Government Pilot' | 'School Network';
  district: string;
  totalStudents: number;
  activeLicenses: number;
  contactPerson: string;
  status: 'Active' | 'Pending Renewal';
}

export interface BlogComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  text: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  coverImage?: string;
  authorId?: string;
  authorEmail?: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
    affiliation?: string;
  };
  publishedAt: string;
  readTime: string;
  claps: number;
  reactions?: {
    applaud: number;
    heart: number;
    fire: number;
    idea: number;
  };
  comments?: BlogComment[];
  content: string[];
  tags: string[];
  isPublished?: boolean;
}

