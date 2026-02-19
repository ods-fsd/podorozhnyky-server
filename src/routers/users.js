import { Router } from 'express';
import { getCurrentUserController } from '../controllers/users.js';


usersRouter.get(
  '/me',
  authenticate,      
  parsePagination,   
  ctrlWrapper(getCurrentUserController), 
);
export default usersRouter;