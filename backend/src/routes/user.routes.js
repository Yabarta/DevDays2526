import { Router} from 'express';
import { getUsers, getUser, addUser, updateUser, removeUser } from '../controllers/user.controller.js';
import { validateCreateUser } from '../middlewares/user.middleware.js';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);
userRouter.post('/users', validateCreateUser, addUser);
userRouter.put('/users/:id', updateUser);
userRouter.delete('/users/:id', removeUser);

export { userRouter };