import { User, Course, Roadmap, Classroom, Submission, InstitutionalAccount, BlogPost } from '../types';

export const GUEST_USER: User = {
  id: 'usr-guest',
  name: 'Guest Learner',
  email: '',
  role: 'student',
  avatar: '',
  school: 'Independent Learner',
  division: 'Chittagong',
  xp: 0,
  streak: 0,
  completedLessons: [],
  enrolledClassroomIds: [],
  enrolledRoadmapIds: []
};

export const CURRENT_STUDENT: User = {
  id: 'usr-std-001',
  name: 'Tanvir Hossain',
  email: 'tanvir@collegiate.edu.bd',
  role: 'student',
  avatar: '',
  school: 'Chittagong Collegiate School',
  division: 'Chittagong',
  xp: 2850,
  streak: 14,
  completedLessons: [],
  enrolledClassroomIds: [],
  enrolledRoadmapIds: []
};

export const CURRENT_TEACHER: User = {
  id: 'usr-tch-001',
  name: 'Engr. Nusrat Jahan',
  email: 'nusrat.jahan@cuet.ac.bd',
  role: 'teacher',
  avatar: '',
  school: 'CUET EdTech Lab & ICT Mentor',
  division: 'Chittagong',
  xp: 12400,
  streak: 42,
  completedLessons: [],
  enrolledClassroomIds: [],
  enrolledRoadmapIds: []
};

export const CURRENT_MODERATOR: User = {
  id: 'usr-mod-001',
  name: 'Tamim Al-Fahim',
  email: 'tamim.alfahim@papercode.org',
  role: 'moderator',
  avatar: '',
  school: 'National ICT Curriculum Board',
  division: 'Dhaka',
  xp: 18500,
  streak: 65,
  completedLessons: [],
  enrolledClassroomIds: [],
  enrolledRoadmapIds: [],
  permissions: ['edit_roadmaps', 'create_courses', 'manage_lessons'],
  joinedAt: '2026-01-15'
};

export const SEED_MODERATORS: User[] = [
  CURRENT_MODERATOR,
  {
    id: 'usr-mod-002',
    name: 'Dr. Sumaiya Parveen',
    email: 'sumaiya.parveen@buet.ac.bd',
    role: 'moderator',
    avatar: '',
    school: 'BdOI Senior Academic Committee',
    division: 'Dhaka',
    xp: 22100,
    streak: 89,
    completedLessons: [],
    enrolledClassroomIds: [],
    enrolledRoadmapIds: [],
    permissions: ['all_access'],
    joinedAt: '2026-02-01'
  }
];

export const CURRENT_ADMIN: User = {
  id: 'usr-adm-001',
  name: 'Dr. Rafiqul Islam',
  email: 'rafiqul.islam@cuet.ac.bd',
  role: 'admin',
  avatar: '',
  school: 'Chittagong University of Engineering and Technology (CUET)',
  division: 'Chittagong',
  xp: 35000,
  streak: 120,
  completedLessons: [],
  enrolledClassroomIds: [],
  enrolledRoadmapIds: [],
  permissions: ['all_access', 'manage_moderators', 'edit_roadmaps', 'create_courses', 'manage_lessons']
};

export const SEED_USERS: User[] = [
  CURRENT_STUDENT,
  CURRENT_TEACHER,
  CURRENT_MODERATOR,
  SEED_MODERATORS[1],
  CURRENT_ADMIN
];

// Pure dynamic loading from Neon PostgreSQL DB
export const SEED_COURSES: Course[] = [];

export const SEED_ROADMAPS: Roadmap[] = [
  {
    id: 'rdm-ict-ssc',
    title: 'Class 9-10 ICT National Curriculum Mastery',
    description: 'Full roadmap aligned with NCTB syllabus covering Python, Flowcharts, Number Systems, and Algorithm design.',
    badge: '🏆 National SSC ICT Certification',
    targetAudience: 'Secondary School Students (Bangladesh)',
    courses: [],
    isPublic: true,
    totalXp: 3500,
    enrolledCount: 8420
  },
  {
    id: 'rdm-bdoi-camp',
    title: 'National Olympiad in Informatics (BdOI) Prep Camp',
    description: 'Olympiad-focused track from paper syntax to C++ STL data structures and dynamic programming.',
    badge: '🏅 BdOI Finalist Honor',
    targetAudience: 'Aspiring Olympiad Competitors & Enthusiasts',
    courses: [],
    isPublic: true,
    totalXp: 7200,
    enrolledCount: 3180
  },
  {
    id: 'rdm-hsc-ict',
    title: 'HSC ICT Board Examination Top Scorer Track',
    description: 'Master C programming, HTML, database queries, and number conversions with 100% board accuracy.',
    badge: '⭐ HSC ICT Distinction',
    targetAudience: 'Higher Secondary Students (Class 11 & 12)',
    courses: [],
    isPublic: true,
    totalXp: 4800,
    enrolledCount: 5240
  }
];

export const SEED_CLASSROOMS: Classroom[] = [];

export const SEED_SUBMISSIONS: Submission[] = [];

export const SEED_INSTITUTIONAL_ACCOUNTS: InstitutionalAccount[] = [
  {
    id: 'inst-brac-01',
    name: 'BRAC Education Programme (100 Village Schools)',
    type: 'NGO',
    district: 'Sylhet (Sunamganj Haor)',
    totalStudents: 3400,
    activeLicenses: 3400,
    contactPerson: 'Kazi Farhan (Programme Head)',
    status: 'Active'
  },
  {
    id: 'inst-unesco-02',
    name: 'UNESCO Digital Divide Literacy Initiative',
    type: 'NGO',
    district: 'Kurigram & Nilphamari',
    totalStudents: 2850,
    activeLicenses: 2850,
    contactPerson: 'Dr. Shahriar Alam (Field Coordinator)',
    status: 'Active'
  },
  {
    id: 'inst-gov-03',
    name: 'a2i Smart Bangladesh Digital Khata Pilot',
    type: 'Government Pilot',
    district: 'Chittagong Hill Tracts',
    totalStudents: 4100,
    activeLicenses: 4100,
    contactPerson: 'Mehnaz Chowdhury (Deputy Director)',
    status: 'Active'
  }
];

export const SEED_BLOGS: BlogPost[] = [];
