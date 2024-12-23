import { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";

const Controls = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOFF, setIsVideoOFF] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              if (isMuted) setIsMuted(false);
              else setIsMuted(true);
            }}
            className="p-3 rounded-full hover:bg-gray-100"
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          <button onClick={() => {
              if (isVideoOFF) setIsVideoOFF(false);
              else setIsVideoOFF(true);
            }} className="p-3 rounded-full hover:bg-gray-100">
            {isVideoOFF? <VideoOff className="w-6 h-6" /> :<Video className="w-6 h-6" />}
          </button>
          <button className="p-3 rounded-full hover:bg-gray-100">
            <Monitor className="w-6 h-6" />
          </button>
        </div>

        <div className="flex space-x-4">
          <button className="p-3 rounded-full hover:bg-gray-100">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-full hover:bg-gray-100">
            <Users className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white">
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
