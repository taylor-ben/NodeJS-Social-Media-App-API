import { Router } from 'express';

const router = Router();

router.get('/test', (req, res) => res.json({msg: 'Posts Works'}));

export default router;