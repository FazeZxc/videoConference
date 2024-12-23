import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useWebRTC } from "../hooks/useWebRTC";
import VideoGrid from "../components/video/VideoGrid";
import ChatWindow from "../components/chat/ChatWindow";
import Controls from "../components/Controls";
import MeetingInfo from "../components/MeetingInfo";
import { useSetRecoilState } from "recoil";
import { meetingIdAtom } from "../store/Index";

const Meeting = () => {
  const { id: meetingId } = useParams();
  const setMeetingId = useSetRecoilState(meetingIdAtom);
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setMeetingId(meetingId);
  }, [meetingId, setMeetingId]);

  const { localStream, participants } = useWebRTC(
    meetingId,
    user?._id,
    user?.username
  );
  console.log(user);

  const handleSendMessage = (content) => {
    setMessages(content)
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <MeetingInfo meetingId={meetingId} />
          <div className="flex-1 overflow-y-auto">
            <VideoGrid
              localStream={localStream}
              participants={participants}
              userName={user?.username}
            />
          </div>
        </div>

        {isChatOpen && (
          <div className="w-80 bg-white border-l">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={user?._id}
            />
          </div>
        )}
      </div>
      <Controls
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
};

export default Meeting;
