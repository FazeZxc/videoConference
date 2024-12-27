/* eslint-disable react/prop-types */
const ChatMessage = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <span className="text-sm text-gray-500">{message.sender.username}</span>
      <div className={`mt-1 px-4 py-2 rounded-lg ${
        isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100'
      }`}>
        {message.content}
      </div>
      <span className="text-xs text-gray-400 mt-1">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
};

export default ChatMessage;