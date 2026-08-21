import { Router, Request, Response } from 'express';
const router = Router();
let submissionsDb: any[] = [];

router.post('/', (req: Request, res: Response) => {
  const sub = { id: 'sub-' + Date.now(), ...req.body, submittedAt: new Date().toISOString() };
  submissionsDb.unshift(sub);
  res.status(201).json({ success: true, submission: sub });
});

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, submissions: submissionsDb });
});

export default router;
