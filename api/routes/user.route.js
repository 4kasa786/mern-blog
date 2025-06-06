import express from 'express';
const router = express.Router();
import { getUsers, test, updateUser, getUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js'
import { signout } from '../controllers/user.controller.js';


router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signout)
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);


export default router;