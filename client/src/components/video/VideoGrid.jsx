/* eslint-disable react/prop-types */
import VideoPlayer from "./VideoPlayer";

const VideoGrid = ({ userName, localStreamRef, participants }) => {
  const totalParticipants =
    participants.length + (localStreamRef?.current ? 1 : 0);

  const gridCols =
    totalParticipants <= 1
      ? "grid-cols-1"
      : totalParticipants <= 4
      ? "grid-cols-2"
      : "grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-4 p-4`} aria-label="Video Grid">
      {totalParticipants}
      {localStreamRef?.current && (
        <VideoPlayer
          stream={localStreamRef.current}
          muted
          userName={`${userName} (You)`}
        />
      )}

      {participants.map(
        (participant) =>
          participant.stream && (
            <VideoPlayer
              key={participant.userId}
              stream={participant.stream}
              userName={participant.userName}
            />
          )
      )}
    </div>
  );
};

export default VideoGrid;
