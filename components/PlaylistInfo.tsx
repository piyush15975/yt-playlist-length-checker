import React from 'react';
import { Clock, Video, Play } from 'lucide-react';

interface PlaylistInfoProps {
  title: string;
  totalVideos: number;
  totalDuration: string;
  totalSeconds: number;
}

const PlaylistInfo = ({ title, totalVideos, totalDuration, totalSeconds }: PlaylistInfoProps) => {
  // Calculate average duration
  const averageDuration = Math.round(totalSeconds / totalVideos);
  const averageMinutes = Math.floor(averageDuration / 60);
  const averageSeconds = averageDuration % 60;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const playbackSpeeds = [1.25, 1.5, 1.75, 2.0];

  return (
    <div className="space-y-6">
      {/* Playlist Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Analysis Complete</h2>
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-300 text-lg">{title}</p>
        </div>
      </div>

      {/* Essential Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Video className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Videos</p>
          <p className="text-2xl font-bold text-blue-400">{totalVideos.toLocaleString()}</p>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Duration</p>
          <p className="text-2xl font-bold text-purple-400">{totalDuration}</p>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Play className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Average Length</p>
          <p className="text-2xl font-bold text-green-400">
            {averageMinutes}m {averageSeconds}s
          </p>
        </div>
      </div>

      {/* Playback Speed Options */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Playback Speeds</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {playbackSpeeds.map((speed) => (
            <div
              key={speed}
              className="bg-gray-800/50 rounded-lg p-4 text-center hover:bg-gray-800/70 transition-colors"
            >
              <div className="text-lg font-bold text-cyan-400 mb-1">{speed}x</div>
              <div className="text-white font-medium">{formatDuration(totalSeconds / speed)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistInfo;