import { Router } from 'express';
import { getUserReposHandler } from '../controllers/github.controller.js';

const githubRouter = Router();

githubRouter.get('/github/users/:username/repos', getUserReposHandler);

export { githubRouter };
