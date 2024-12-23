import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
const backendURL = import.meta.env.VITE_BACKEND_URL;

export const useWebRTC = (roomId, userId, userName) => {
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const socketRef = useRef();
  const peersRef = useRef({});

  useEffect(() => {
    socketRef.current = io(backendURL, {
      withCredentials: true,  
    });

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        
        socketRef.current?.emit('join-room', { roomId, userId, userName });
      } catch (error) {
        console.error('Error getting media devices:', error);
      }
    };

    init();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      socketRef.current?.disconnect();
      Object.values(peersRef.current).forEach(peer => peer.close());
    };
  }, [roomId, userId, userName]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on('user-connected', async ({ userId, userName }) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      peersRef.current[userId] = peerConnection;

      localStream?.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      socketRef.current?.emit('offer', {
        target: userId,
        caller: userId,
        sdp: peerConnection.localDescription,
      });
    });

    socketRef.current.on('offer', async ({ sdp, caller }) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      peersRef.current[caller] = peerConnection;

      peerConnection.ontrack = (event) => {
        setParticipants(prev => {
          const participant = prev.find(p => p.userId === caller);
          if (participant) {
            return prev.map(p => 
              p.userId === caller ? { ...p, stream: event.streams[0] } : p
            );
          }
          return [...prev, { userId: caller, userName: '', stream: event.streams[0] }];
        });
      };

      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socketRef.current?.emit('answer', {
        target: caller,
        caller: userId,
        sdp: peerConnection.localDescription,
      });
    });

    socketRef.current.on('answer', async ({ sdp, caller }) => {
      const peerConnection = peersRef.current[caller];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    socketRef.current.on('ice-candidate', async ({ candidate, caller }) => {
      const peerConnection = peersRef.current[caller];
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketRef.current.on('user-disconnected', (userId) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
      
      setParticipants(prev => prev.filter(p => p.userId !== userId));
    });

    return () => {
      socketRef.current?.off('user-connected');
      socketRef.current?.off('offer');
      socketRef.current?.off('answer');
      socketRef.current?.off('ice-candidate');
      socketRef.current?.off('user-disconnected');
    };
  }, [localStream, roomId, userId]);

  return { localStream, participants };
};
