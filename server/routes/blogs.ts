import { Router, Request, Response } from 'express';
const router = Router();

let blogsDb = [
  {
    id: 'blog-01',
    title: 'The Chalk & Paper Revolution: Why 90% of Bangladesh’s Future Coders Don’t Need Laptops to Start',
    subtitle: 'How handwriting syntax on paper khata bridges the digital divide.',
    category: 'Field Story',
    claps: 142
  }
];

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, blogs: blogsDb });
});

router.post('/:id/clap', (req: Request, res: Response) => {
  const b = blogsDb.find(x => x.id === req.params.id);
  if (b) {
    b.claps = (b.claps || 0) + 1;
    return res.json({ success: true, claps: b.claps });
  }
  return res.status(404).json({ success: false, message: 'Blog not found' });
});

export default router;
