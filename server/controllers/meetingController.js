import Meeting from "../models/Meeting.js";
import { v4 as uuidv4 } from "uuid";

const createMeeting = async (req, res) => {
  const user = req.user;
  console.log(user);
  try {
    const meetingId = uuidv4();
    const meeting = await Meeting.create({
      meetingId,
      host: user.id,
      participants: [user.id],
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const user = req.user;
    const meeting = await Meeting.findOne({ meetingId, isActive: true });
    console.log(user);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found or inactive" });
    }
    console.log(user);
    if (!meeting.participants.includes(req.user.id)) {
      meeting.participants.push(req.user.id);
      await meeting.save();
    }

    res.json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const endMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findOne({ meetingId, host: req.user._id });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.isActive = false;
    meeting.endTime = Date.now();
    await meeting.save();

    res.json({ message: "Meeting ended successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createMeeting, joinMeeting, endMeeting };
