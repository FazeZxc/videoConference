/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';

const VideoPlayer = ({ stream, muted = false, userName }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="rounded-md"
      />
      {userName && (
        <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded-md">
          <span className="text-white text-sm">{userName}</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;