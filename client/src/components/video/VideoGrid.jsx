/* eslint-disable react/prop-types */
import VideoPlayer from './VideoPlayer';
const VideoGrid = ({ localStream, participants, userName }) => {
  const totalParticipants = participants.length + (localStream ? 1 : 0);
  const gridCols = totalParticipants <= 1 ? 1 : totalParticipants <= 4 ? 2 : 3;
  console.log(totalParticipants);
  return (
    <div className={`grid grid-cols-${gridCols} gap-4 p-4`}>
      {localStream && (
        <VideoPlayer stream={localStream} muted userName={`${userName} (You)`} />
      )}
      {participants.map((participant) => (
        participant.stream && (
          <VideoPlayer
            key={participant.userId}
            stream={participant.stream}
            userName={participant.userName}
          />
        )
      ))}
    </div>
  );
};

export default VideoGrid;