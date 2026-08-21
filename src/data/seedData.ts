import { User, Course, Roadmap, Classroom, Submission, InstitutionalAccount } from '../types';

export const CURRENT_STUDENT: User = {
  id: 'usr-std-001',
  name: 'Tanvir Hossain',
  email: 'tanvir@collegiate.edu.bd',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  school: 'Chittagong Collegiate School',
  division: 'Chittagong',
  xp: 2850,
  streak: 14,
  completedLessons: ['les-py-01', 'les-py-02', 'les-py-03'],
  enrolledClassroomIds: ['cls-ctg-902'],
  enrolledRoadmapIds: ['rdm-ict-ssc', 'rdm-bdoi-camp']
};

export const CURRENT_TEACHER: User = {
  id: 'usr-tch-001',
  name: 'Engr. Nusrat Jahan',
  email: 'nusrat.jahan@cuet.ac.bd',
  role: 'teacher',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  school: 'CUET EdTech Lab & ICT Mentor',
  division: 'Chittagong',
  xp: 12400,
  streak: 42,
  completedLessons: [],
  enrolledClassroomIds: ['cls-ctg-902', 'cls-raoz-404'],
  enrolledRoadmapIds: ['rdm-ict-ssc']
};

export const CURRENT_MODERATOR: User = {
  id: 'usr-mod-001',
  name: 'Tamim Al-Fahim',
  email: 'tamim.alfahim@papercode.org',
  role: 'moderator',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  school: 'National ICT Curriculum Board',
  division: 'Dhaka',
  xp: 18500,
  streak: 65,
  completedLessons: [],
  enrolledClassroomIds: [],
  enrolledRoadmapIds: ['rdm-ict-ssc', 'rdm-bdoi-camp'],
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
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    school: 'BdOI Senior Academic Committee',
    division: 'Dhaka',
    xp: 22100,
    streak: 88,
    completedLessons: [],
    enrolledClassroomIds: [],
    enrolledRoadmapIds: ['rdm-bdoi-camp'],
    permissions: ['edit_roadmaps', 'create_courses', 'manage_lessons'],
    joinedAt: '2026-02-10'
  }
];

export const CURRENT_ADMIN: User = {
  id: 'usr-adm-001',
  name: 'Dr. Rafiqul Islam',
  email: 'rafiqul.islam@cuet.ac.bd',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
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

export const SEED_COURSES: Course[] = [
  {
    id: 'crs-py-basics',
    title: 'Python 3 Foundations for ICT',
    subtitle: 'Variables, loops, arrays & basic logic for national exams',
    description: 'A comprehensive curriculum starting from paper flowcharts to variables, conditional if-else statements, for loops, and list manipulation. Aligned with Class 9-10 ICT guidelines.',
    category: 'NCTB Curriculum',
    level: 'Beginner (Class 9-10)',
    estimatedHours: 12,
    publishedBy: 'admin',
    authorName: 'Dr. Rafiqul Islam & Nusrat Jahan',
    colorAccent: 'highlighter',
    modules: [
      {
        id: 'mod-py-01',
        title: 'Module 1: Variables, Input & Math in PaperCode',
        description: 'Learn to write clean, scanner-friendly code on ruled notebook paper.',
        category: 'Foundations',
        isPublished: true,
        lessons: [
          {
            id: 'les-py-01',
            title: 'Lesson 1.1: Hello Bangladesh & Printing Text',
            subtitle: 'Print formatted output and avoid quotation errors in handwriting',
            durationMinutes: 15,
            xpReward: 100,
            conceptNotes: [
              'In Python, print() is used to display text or numbers on the screen.',
              'Use straight single or double quotes when handwriting code.',
              'Keep parentheses clearly curved on ruled paper so the OCR camera detects them effortlessly.'
            ],
            codeSnippet: '# Write your first program\nname = "Bangladesh"\nprint("Joy Bangla! Welcome to " + name)',
            mcq: {
              id: 'mcq-01',
              question: 'Which of the following will correctly output "PaperCode 2026"?',
              options: [
                { id: 'opt-a', text: 'print("PaperCode 2026")' },
                { id: 'opt-b', text: 'echo "PaperCode 2026"' },
                { id: 'opt-c', text: 'System.out.println("PaperCode 2026")' },
                { id: 'opt-d', text: 'display(PaperCode 2026)' }
              ],
              correctOptionId: 'opt-a',
              explanation: 'In Python 3, print() is a built-in function that takes string literals inside parentheses and quotation marks.'
            },
            exercise: {
              id: 'ex-01',
              title: 'Print National Pride Message',
              prompt: 'Write a Python program that prints the exact phrase "Hello from PaperCode Bangladesh!".',
              language: 'python',
              languageId: 71,
              starterCode: '# Write code below on your ruled khata or in the box\n',
              solutionSnippet: 'print("Hello from PaperCode Bangladesh!")',
              testCases: [
                {
                  id: 'tc-01-1',
                  input: '',
                  expectedOutput: 'Hello from PaperCode Bangladesh!\n',
                  description: 'Exact match test case'
                }
              ],
              rubric: [
                { id: 'rb-1', title: 'Correct Function Usage', maxPoints: 5, description: 'Used print() correctly' },
                { id: 'rb-2', title: 'Exact String Content', maxPoints: 5, description: 'Matching quotation and casing' }
              ]
            }
          },
          {
            id: 'les-py-02',
            title: 'Lesson 1.2: Variables, Integers & Float Calculations',
            subtitle: 'Storing data and performing arithmetic operations',
            durationMinutes: 20,
            xpReward: 150,
            conceptNotes: [
              'Variables store values: a = 10, b = 25.',
              'Addition (+), subtraction (-), multiplication (*), and float division (/).',
              'Keep 4 spaces (or one indent tab) clear when writing code blocks.'
            ],
            codeSnippet: 'a = 15\nb = 30\nsum_result = a + b\nprint("Total sum:", sum_result)',
            mcq: {
              id: 'mcq-02',
              question: 'What is the output of print(7 // 2) in Python?',
              options: [
                { id: 'opt-2a', text: '3.5' },
                { id: 'opt-2b', text: '3' },
                { id: 'opt-2c', text: '4' },
                { id: 'opt-2d', text: '1' }
              ],
              correctOptionId: 'opt-2b',
              explanation: '// represents floor division in Python, discarding remainder.'
            },
            exercise: {
              id: 'ex-02',
              title: 'Calculate Rectangle Area',
              prompt: 'Declare length = 12 and width = 8. Calculate area and print the result.',
              language: 'python',
              languageId: 71,
              starterCode: 'length = 12\nwidth = 8\n# Calculate area and print\n',
              solutionSnippet: 'length = 12\nwidth = 8\narea = length * width\nprint(area)',
              testCases: [
                {
                  id: 'tc-02-1',
                  input: '',
                  expectedOutput: '96\n',
                  description: 'Calculated area output'
                }
              ],
              rubric: [
                { id: 'rb-21', title: 'Variable Declaration', maxPoints: 5, description: 'Correct variable initialization' },
                { id: 'rb-22', title: 'Multiplication', maxPoints: 5, description: 'length * width calculation' }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-py-02',
        title: 'Module 2: Conditionals & For Loop Iterations',
        description: 'Branching logic and repetitive loops for real-world algorithms.',
        category: 'Control Flow',
        isPublished: true,
        lessons: [
          {
            id: 'les-py-03',
            title: 'Lesson 2.1: Even/Odd Numbers & Divisibility',
            subtitle: 'Using the modulo operator (%) and if-else branches',
            durationMinutes: 25,
            xpReward: 200,
            conceptNotes: [
              'The modulo operator % returns remainder: 10 % 2 == 0.',
              'Indentation indicates code blocks inside if and else statements.'
            ],
            codeSnippet: 'num = 14\nif num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
            mcq: {
              id: 'mcq-03',
              question: 'Which symbol is used for equality comparison in Python?',
              options: [
                { id: 'opt-3a', text: '=' },
                { id: 'opt-3b', text: '==' },
                { id: 'opt-3c', text: ':=' },
                { id: 'opt-3d', text: '===' }
              ],
              correctOptionId: 'opt-3b',
              explanation: '== is the comparison operator, while = is assignment.'
            },
            exercise: {
              id: 'ex-03',
              title: 'Check Positive or Negative',
              prompt: 'Given n = -5, check if it is greater than 0. If yes, print "Positive", else print "Negative".',
              language: 'python',
              languageId: 71,
              starterCode: 'n = -5\n# Write if-else condition\n',
              solutionSnippet: 'n = -5\nif n > 0:\n    print("Positive")\nelse:\n    print("Negative")',
              testCases: [
                {
                  id: 'tc-03-1',
                  input: '',
                  expectedOutput: 'Negative\n',
                  description: 'Negative branch evaluation'
                }
              ],
              rubric: [
                { id: 'rb-31', title: 'If Statement', maxPoints: 5, description: 'Correct condition checking' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'crs-c-hsc',
    title: 'HSC ICT Chapter 5: C Programming Board Prep',
    subtitle: 'NCTB Higher Secondary standard syllabus for C language',
    description: 'Master standard C programming required for the Higher Secondary Certificate exam: data types, printf/scanf, loops, nested conditions, and 1D arrays.',
    category: 'Board Exam Prep',
    level: 'Intermediate (Class 11-12)',
    estimatedHours: 18,
    publishedBy: 'teacher',
    authorName: 'Engr. Nusrat Jahan',
    colorAccent: 'stamp',
    modules: [
      {
        id: 'mod-c-01',
        title: 'Module 1: C Syntax & Structure',
        description: 'Header files, main function, and variable types.',
        category: 'Basics',
        isPublished: true,
        lessons: [
          {
            id: 'les-c-01',
            title: 'Lesson 1.1: Basic Structure of C Programs',
            subtitle: '#include <stdio.h>, main function, and return 0',
            durationMinutes: 20,
            xpReward: 120,
            conceptNotes: [
              'Every C program begins execution in the main() function.',
              'Semi-colons (;) must terminate every statement.',
              'Include stdio.h for standard input and output functions.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("HSC ICT Exam Prep\\n");\n    return 0;\n}',
            mcq: {
              id: 'mcq-c1',
              question: 'Which header file is required to use printf() in C?',
              options: [
                { id: 'c-opt1', text: '<math.h>' },
                { id: 'c-opt2', text: '<stdio.h>' },
                { id: 'c-opt3', text: '<conio.h>' },
                { id: 'c-opt4', text: '<string.h>' }
              ],
              correctOptionId: 'c-opt2',
              explanation: 'stdio.h stands for Standard Input Output header file.'
            },
            exercise: {
              id: 'ex-c-01',
              title: 'First C Output',
              prompt: 'Write a valid C program that prints "Welcome to HSC ICT 2026" followed by a newline.',
              language: 'c',
              languageId: 50,
              starterCode: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}',
              solutionSnippet: '#include <stdio.h>\n\nint main() {\n    printf("Welcome to HSC ICT 2026\\n");\n    return 0;\n}',
              testCases: [
                {
                  id: 'tc-c01',
                  input: '',
                  expectedOutput: 'Welcome to HSC ICT 2026\n',
                  description: 'C Compilation match'
                }
              ],
              rubric: [
                { id: 'rb-c1', title: 'Header file', maxPoints: 5, description: 'Included stdio.h' },
                { id: 'rb-c2', title: 'printf syntax', maxPoints: 5, description: 'Proper format and semicolon' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'crs-cpp-olympiad',
    title: 'C++ Competitive Programming (BdOI Prep)',
    subtitle: 'Fast I/O, vectors, sorting & binary search for Olympiad beginners',
    description: 'Prepare for Bangladesh Olympiad in Informatics (BdOI) preliminary rounds with algorithmic challenges on paper and mobile.',
    category: 'Olympiad Training',
    level: 'Advanced (School/College)',
    estimatedHours: 25,
    publishedBy: 'admin',
    authorName: 'Dr. Rafiqul Islam & BdOI Alumni',
    colorAccent: 'highlighter',
    modules: [
      {
        id: 'mod-cpp-01',
        title: 'Module 1: STL Vectors & Sorting',
        description: 'Standard Template Library essentials for competitive programmers.',
        category: 'Algorithms',
        isPublished: true,
        lessons: [
          {
            id: 'les-cpp-01',
            title: 'Lesson 1.1: Dynamic Arrays with std::vector',
            subtitle: 'Vector push_back, size, and range-based iteration',
            durationMinutes: 30,
            xpReward: 250,
            conceptNotes: [
              'std::vector is a dynamic contiguous array.',
              'sort(v.begin(), v.end()) runs in O(N log N) time.'
            ],
            codeSnippet: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 2, 8, 1};\n    sort(v.begin(), v.end());\n    for (int x : v) cout << x << " ";\n    return 0;\n}',
            mcq: {
              id: 'mcq-cpp1',
              question: 'What is the time complexity of std::sort in C++ STL?',
              options: [
                { id: 'cpp-opt1', text: 'O(N^2)' },
                { id: 'cpp-opt2', text: 'O(N log N)' },
                { id: 'cpp-opt3', text: 'O(N)' },
                { id: 'cpp-opt4', text: 'O(log N)' }
              ],
              correctOptionId: 'cpp-opt2',
              explanation: 'std::sort uses Introsort, guaranteeing O(N log N) worst-case time complexity.'
            },
            exercise: {
              id: 'ex-cpp-01',
              title: 'Sort 3 Integers',
              prompt: 'Given vector {9, 3, 7}, sort it ascending and print elements separated by spaces.',
              language: 'cpp',
              languageId: 54,
              starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {9, 3, 7};\n    // Sort and print\n    return 0;\n}',
              solutionSnippet: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {9, 3, 7};\n    sort(v.begin(), v.end());\n    for (int x : v) cout << x << " ";\n    return 0;\n}',
              testCases: [
                {
                  id: 'tc-cpp01',
                  input: '',
                  expectedOutput: '3 7 9 ',
                  description: 'Sorted sequence match'
                }
              ],
              rubric: [
                { id: 'rb-cpp1', title: 'std::sort usage', maxPoints: 10, description: 'Applied STL sort correctly' }
              ]
            }
          }
        ]
      }
    ]
  }
];

export const SEED_ROADMAPS: Roadmap[] = [
  {
    id: 'rdm-ict-ssc',
    title: 'Class 9-10 ICT National Curriculum Mastery',
    description: 'Full roadmap aligned with NCTB syllabus covering Python, Flowcharts, Number Systems, and Algorithm design.',
    badge: '🏆 National SSC ICT Certification',
    targetAudience: 'Secondary School Students (Bangladesh)',
    courses: [SEED_COURSES[0]],
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
    courses: [SEED_COURSES[0], SEED_COURSES[2]],
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
    courses: [SEED_COURSES[1]],
    isPublic: true,
    totalXp: 4800,
    enrolledCount: 5240
  }
];

export const SEED_CLASSROOMS: Classroom[] = [
  {
    id: 'cls-ctg-902',
    name: 'Class 9-A ICT (2026 Batch)',
    gradeLevel: 'Class 9',
    subject: 'ICT Practical & Python',
    teacherId: 'usr-tch-001',
    teacherName: 'Engr. Nusrat Jahan',
    joinCode: 'CUET-902',
    archived: false,
    courseIds: ['crs-py-basics', 'crs-cpp-olympiad'],
    roster: [
      {
        studentId: 'usr-std-001',
        name: 'Tanvir Hossain',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        division: 'Chittagong',
        completedAssignmentsCount: 4,
        averageScore: 94.5,
        lastActive: '10 mins ago'
      },
      {
        studentId: 'usr-std-002',
        name: 'Amina Akter',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
        division: 'Chittagong',
        completedAssignmentsCount: 3,
        averageScore: 88.0,
        lastActive: '2 hours ago'
      },
      {
        studentId: 'usr-std-003',
        name: 'Rahim Uddin',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        division: 'Chittagong',
        completedAssignmentsCount: 4,
        averageScore: 91.0,
        lastActive: '1 day ago'
      }
    ],
    assignments: [
      {
        id: 'asg-01',
        title: 'Homework 1: Variables & Input Operations',
        courseTitle: 'Python 3 Foundations for ICT',
        moduleTitle: 'Module 1: Variables, Input & Math in PaperCode',
        assignedDate: '2026-08-15',
        dueDate: '2026-08-25',
        totalSubmissions: 4,
        totalStudents: 6,
        status: 'grading_needed',
        description: 'Handwrite the variable calculations on your paper notebook, scan page with PaperCode camera, and submit.',
        maxScore: 10
      },
      {
        id: 'asg-02',
        title: 'Homework 2: For Loop Series on Khata',
        courseTitle: 'Python 3 Foundations for ICT',
        moduleTitle: 'Module 2: Conditionals & For Loop Iterations',
        assignedDate: '2026-08-18',
        dueDate: '2026-08-28',
        totalSubmissions: 2,
        totalStudents: 6,
        status: 'active',
        description: 'Solve arithmetic series 1+2+...+N in Python using either handwritten paper or in-browser mobile IDE.',
        maxScore: 10
      }
    ]
  },
  {
    id: 'cls-raoz-404',
    name: 'Class 10 SSC ICT Group - Raozan Pilot',
    gradeLevel: 'Class 10 (SSC Batch)',
    subject: 'ICT Practical Lab',
    teacherId: 'usr-tch-001',
    teacherName: 'Engr. Nusrat Jahan',
    joinCode: 'RAOZ-404',
    archived: false,
    courseIds: ['crs-py-basics'],
    roster: [
      {
        studentId: 'usr-std-004',
        name: 'Sadia Sultana',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        division: 'Chittagong',
        completedAssignmentsCount: 2,
        averageScore: 96.0,
        lastActive: '3 hours ago'
      }
    ],
    assignments: [
      {
        id: 'asg-03',
        title: 'Midterm Lab Exercise: If-Else Leap Year',
        courseTitle: 'Python 3 Foundations for ICT',
        moduleTitle: 'Module 2: Conditionals & For Loop Iterations',
        assignedDate: '2026-08-10',
        dueDate: '2026-08-20',
        totalSubmissions: 1,
        totalStudents: 1,
        status: 'completed',
        description: 'Verify if a year is leap year using modulo conditions.',
        maxScore: 10
      }
    ]
  }
];

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-01',
    assignmentId: 'asg-01',
    classroomId: 'cls-ctg-902',
    exerciseId: 'ex-01',
    exerciseTitle: 'Print National Pride Message',
    studentId: 'usr-std-001',
    studentName: 'Tanvir Hossain',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    studentSchool: 'Chittagong Collegiate School',
    submittedAt: '2026-08-20 14:32',
    submissionType: 'photo',
    ocrConfidence: 98.4,
    handwrittenImageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80',
    code: '# Hand-written on ruled paper\nname = "Bangladesh"\nprint("Joy Bangla! Welcome to " + name)',
    language: 'python',
    executionResult: {
      stdout: 'Joy Bangla! Welcome to Bangladesh\n',
      stderr: null,
      compile_output: null,
      message: null,
      status: { id: 3, description: 'Accepted' },
      time: '0.028',
      memory: 3200,
      exit_code: 0
    },
    testCaseResults: [
      { testCaseId: 'tc-01-1', passed: true, input: '', expected: 'Hello from PaperCode Bangladesh!', actual: 'Hello from PaperCode Bangladesh!' }
    ],
    score: 9.5,
    maxScore: 10,
    feedback: 'Clean handwriting! OCR scanned with 98.4% confidence score. Indentation and single quotes recognized accurately.',
    status: 'graded',
    gradedBy: 'Engr. Nusrat Jahan',
    gradedAt: '2026-08-20 16:00'
  },
  {
    id: 'sub-02',
    assignmentId: 'asg-01',
    classroomId: 'cls-ctg-902',
    exerciseId: 'ex-01',
    exerciseTitle: 'Print National Pride Message',
    studentId: 'usr-std-002',
    studentName: 'Amina Akter',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    studentSchool: 'Chittagong Collegiate School',
    submittedAt: '2026-08-20 15:10',
    submissionType: 'typed',
    code: 'name = "Bangladesh"\nprint("Joy Bangla! Welcome to", name)',
    language: 'python',
    executionResult: {
      stdout: 'Joy Bangla! Welcome to Bangladesh\n',
      stderr: null,
      compile_output: null,
      message: null,
      status: { id: 3, description: 'Accepted' },
      time: '0.021',
      memory: 3150,
      exit_code: 0
    },
    testCaseResults: [
      { testCaseId: 'tc-01-1', passed: true, input: '', expected: 'Hello from PaperCode Bangladesh!', actual: 'Hello from PaperCode Bangladesh!' }
    ],
    score: 8.5,
    maxScore: 10,
    feedback: 'Code compiled successfully on Judge0 sandbox via Mobile Code IDE. Minor spacing difference in comma output.',
    status: 'auto_graded'
  },
  {
    id: 'sub-03',
    assignmentId: 'asg-01',
    classroomId: 'cls-ctg-902',
    exerciseId: 'ex-02',
    exerciseTitle: 'Calculate Rectangle Area',
    studentId: 'usr-std-003',
    studentName: 'Rahim Uddin',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    studentSchool: 'Chittagong Collegiate School',
    submittedAt: '2026-08-20 16:45',
    submissionType: 'photo',
    ocrConfidence: 94.2,
    handwrittenImageUrl: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&auto=format&fit=crop&q=80',
    code: 'length = 12\nwidth = 8\narea = length * width\nprint(area)',
    language: 'python',
    executionResult: {
      stdout: '96\n',
      stderr: null,
      compile_output: null,
      message: null,
      status: { id: 3, description: 'Accepted' },
      time: '0.024',
      memory: 3120,
      exit_code: 0
    },
    testCaseResults: [
      { testCaseId: 'tc-02-1', passed: true, input: '', expected: '96', actual: '96' }
    ],
    score: 10,
    maxScore: 10,
    feedback: 'Perfect solution and flawless handwriting transcription.',
    status: 'graded',
    gradedBy: 'Engr. Nusrat Jahan',
    gradedAt: '2026-08-20 17:15'
  }
];

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
