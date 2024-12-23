import { Copy, Link } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { meetingIdAtom } from '../store/Index';

const MeetingInfo = () => {
  const meetingId = useRecoilValue(meetingIdAtom);

  return (
    <div className="p-4 bg-white border-b">
      <h1 className="text-xl font-semibold mb-4">Current Meeting</h1>
      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
        <Link className="w-5 h-5 text-gray-500" />
        <span className="flex-1 text-sm font-mono">{meetingId}</span>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Copy className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default MeetingInfo;