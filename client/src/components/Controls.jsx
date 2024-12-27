/* eslint-disable react/prop-types */
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
import { socketSender } from "../config/socket";
import { useNavigate } from "react-router";

const Controls = ({
  isChatOpen,
  onToggleChat,
  currentUser,
  localStreamRef,
  isMuted,
  setIsMuted,
  isVideoOFF,
  setIsVideoOFF,
}) => {
  const navigate = useNavigate();

  // Toggle Microphone
  const toggleMic = async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
      socketSender("toggle-mic", {
        roomId: currentUser.roomId,
        userId: currentUser.userId,
        micStatus: !isMuted,
      });
    }
  };

  // Toggle Camera
  const toggleCamera = async () => {
    console.log(localStreamRef.current);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOFF((prev) => !prev);
    socketSender("toggle-camera", {
      roomId: currentUser.roomId,
      userId: currentUser.userId,
      cameraStatus: !isVideoOFF,
    });
  };

  // Start Screen Share
  // const handleScreenShare = async () => {
  //   try {
  //     const screenStream = await navigator.mediaDevices.getDisplayMedia({
  //       video: true,
  //       audio: false,
  //     });
  //     const screenTrack = screenStream.getVideoTracks()[0];

  //     if (screenTrack) {
  //       // Replace the video track in the local stream
  //       const videoTrack = localStreamRef.current?.getVideoTracks()[0];
  //       if (videoTrack) {
  //         const sender = currentUser.peerConnection
  //           ?.getSenders()
  //           .find((s) => s.track === videoTrack);

  //         if (sender) {
  //           sender.replaceTrack(screenTrack); // Replace video track with screen share
  //           screenTrack.onended = () => {
  //             // Revert to the camera when screen share ends
  //             sender.replaceTrack(videoTrack);
  //           };
  //         }
  //       }
  //       socketSender("start-screen-share", { roomId: currentUser.roomId });
  //     }
  //   } catch (error) {
  //     console.error("Failed to start screen sharing:", error);
  //   }
  // };

  // Leave Meeting
  const handleLeaveMeeting = () => {
    // Stop all tracks in the local stream
    if (localStreamRef) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    // Notify the server
    socketSender("leave-room", currentUser);
    navigate("/"); // Navigate back to the home page
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={toggleMic}
            className="p-3 rounded-full hover:bg-gray-100"
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={toggleCamera}
            className="p-3 rounded-full hover:bg-gray-100"
          >
            {isVideoOFF ? (
              <VideoOff className="w-6 h-6" />
            ) : (
              <Video className="w-6 h-6" />
            )}
          </button>

          <button
            // onClick={handleScreenShare}
            className="p-3 rounded-full hover:bg-gray-100"
          >
            <Monitor className="w-6 h-6" />
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onToggleChat}
            className="p-3 rounded-full hover:bg-gray-100"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          <button className="p-3 rounded-full hover:bg-gray-100">
            <Users className="w-6 h-6" />
          </button>

          <button
            onClick={handleLeaveMeeting}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
