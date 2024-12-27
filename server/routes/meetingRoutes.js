import express from 'express';
import { createMeeting, joinMeeting, endMeeting } from '../controllers/meetingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/create', protect, createMeeting);
router.post('/join/:meetingId', protect ,joinMeeting);
router.post('/end/:meetingId', protect, endMeeting);

export default router;