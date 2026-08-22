const fs = require('fs');
const path = require('path');

const distDir = path.resolve(process.cwd(), 'dist');
const indexFile = path.join(distDir, 'index.html');

if (fs.existsSync(indexFile)) {
  const indexContent = fs.readFileSync(indexFile, 'utf-8');

  const routes = [
    'student/dashboard',
    'student/classrooms',
    'student/roadmaps',
    'student/lesson',
    'student/courses',
    'teacher/courses',
    'teacher/analytics',
    'teacher/grading',
    'teacher/builder',
    'admin/vitals',
    'admin/users',
    'admin/curriculum',
    'admin/telemetry',
    'moderator/roadmaps',
    'moderator/reviews',
    'profile',
    'playground',
    'courses',
    'blogs',
    'pricing',
    'roadmap'
  ];

  for (const r of routes) {
    const targetDir = path.join(distDir, r);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), indexContent, 'utf-8');
  }

  // 404.html for static CDNs that use 404.html as client-side fallback
  fs.writeFileSync(path.join(distDir, '404.html'), indexContent, 'utf-8');

  console.log('[SPA Build] Successfully generated static route fallbacks and 404.html in dist/');
}
