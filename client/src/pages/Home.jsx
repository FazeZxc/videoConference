import { useState } from "react";
import { useNavigate } from "react-router";
import { Video, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [meetingId, setMeetingId] = useState("");
  const createMeeting = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/meetings/create", {
        withCredentials: true
      });

      const data = await response.data;
      navigate(`/meeting/${data.meetingId}`);
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const joinMeeting = () => {
    if (meetingId.trim()) {
      navigate(`/meeting/${meetingId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Video Conference
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">{user?.username}</span>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <LogOut className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Create Meeting Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg border">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Create a New Meeting
            </h2>
            <p className="text-gray-600 mb-6">
              Start a new meeting instantly and invite participants to join.
            </p>
            <button
              onClick={createMeeting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
            >
              <Video className="w-6 h-6" />
              <span>Start New Meeting</span>
            </button>
          </div>

          {/* Join Meeting Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg border">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Join an Existing Meeting
            </h2>
            <p className="text-gray-600 mb-6">
              Enter a meeting code to join an ongoing session.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                placeholder="Enter meeting code"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={joinMeeting}
                className="w-full py-3 px-5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
              >
                Join Meeting
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
