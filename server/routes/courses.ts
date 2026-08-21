import { Router, Request, Response } from 'express';
const router = Router();

let coursesDb = [
  {
    id: 'course-py-101',
    title: 'Python 3 Foundations for ICT',
    description: 'Master variables, arithmetic operations, conditionals, loops, and list structures on ruled paper.',
    language: 'python',
    level: 'Beginner',
    author: 'Engr. Nusrat Jahan (CUET)'
  }
];

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, courses: coursesDb });
});

export default router;
