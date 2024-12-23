import { useState } from 'react';
import { Send } from 'lucide-react';

const Chat = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Meeting Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">John Doe</span>
          <div className="bg-gray-100 rounded-lg p-3 mt-1">
            Hello everyone!
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;