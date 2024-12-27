/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router";
import VideoGrid from "../components/video/VideoGrid";
import ChatWindow from "../components/chat/ChatWindow";
import Controls from "../components/Controls";
import MeetingInfo from "../components/MeetingInfo";
import { useSetRecoilState } from "recoil";
import { meetingIdAtom } from "../store/Index";
import {
  initializeSocket,
  socketListener,
  socketSender,
} from "../config/socket";
import { AuthContext } from "../context/AuthContext";
import SimplePeer from "simple-peer";

const Meeting = () => {
  const { id: meetingId } = useParams();
  const setMeetingId = useSetRecoilState(meetingIdAtom);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const localVideoRef = useRef(null);
  const [peers, setPeers] = useState({});
  const localStreamRef = useRef(null);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOFF, setIsVideoOFF] = useState(false);
  const currentUser = {
    roomId: meetingId,
    userId: user?._id,
    userName: user?.username,
  };

  useEffect(() => {
    setMeetingId(meetingId);
  }, [meetingId]);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        console.log(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsStreamReady(true);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    getUserMedia();
  }, []);
  useEffect(() => {
    initializeSocket(meetingId);

    socketSender("join-room", currentUser);

    socketListener("participants-update", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });
    socketListener("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socketListener("offer", (offer, from) => {
      handleOffer(offer, from);
    });

    socketListener("answer", (answer, from) => {
      handleAnswer(answer, from);
    });

    socketListener("ice-candidate", (candidate, from) => {
      handleNewICECandidate(candidate, from);
    });
  }, []);

  const handleOffer = (offer, from) => {
    const peer = createPeer(from, false);
    peer.signal(offer);
  };

  const handleAnswer = (answer, from) => {
    peers[from].signal(answer);
  };

  const handleNewICECandidate = (candidate, from) => {
    peers[from].signal(candidate);
  };

  const createPeer = (userId, initiator) => {
    console.log(initiator);
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream: localStreamRef.current,
    });

    peer.on("signal", (signalData) => {
      if (initiator) {
        socketSender("offer", signalData, userId);
      } else {
        socketSender("answer", signalData, userId);
      }
    });

    peer.on("stream", (stream) => {
      addRemoteVideo(userId, stream);
    });

    peer.on("ice-candidate", (candidate) => {
      socketSender("ice-candidate", candidate, userId);
    });

    setPeers((prevPeers) => ({
      ...prevPeers,
      [userId]: peer,
    }));

    return peer;
  };

  const addRemoteVideo = (userId, stream) => {
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.id = userId;
    videoElement.muted = false;
    document.getElementById("video-grid").appendChild(videoElement);
  };

  const handleSendMessage = (newMessage) => {
    if (!newMessage.trim()) return;
    const message = {
      content: newMessage,
      sender: {
        id: user?.id,
        username: user?.username,
      },
      timestamp: new Date().toISOString(),
    };
    socketSender("message", {
      roomId: meetingId,
      message,
      userId: user.id,
      username: user.username,
    });
  };
  console.log(user);
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Section with Meeting Info and Video Grid */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <MeetingInfo meetingId={meetingId} />
          <div className="flex-1 overflow-y-auto">
            {isStreamReady ? (
              <VideoGrid
                userName={user?.username}
                localStreamRef={localStreamRef}
                participants={participants}
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p>Loading video...</p>
              </div>
            )}
          </div>
        </div>

        {isChatOpen && (
          <div className="w-80 bg-white border-l">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={user?.id}
            />
          </div>
        )}
      </div>

      <Controls
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        currentUser={currentUser}
        localStreamRef={localStreamRef}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isVideoOFF={isVideoOFF}
        setIsVideoOFF={setIsVideoOFF}
      />
    </div>
  );
};

export default Meeting;
