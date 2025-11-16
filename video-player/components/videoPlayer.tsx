"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const videoURL =
  "https://www.youtube.com/embed/VgDgWzBL7s4?enablejsapi=1&rel=0&modestbranding=1";

export default function VideoPlayer() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!iframeRef.current) return;
    const player = iframeRef.current.contentWindow;

    player?.postMessage(
      JSON.stringify({
        event: "command",
        func: isPlaying ? "pauseVideo" : "playVideo",
      }),
      "*"
    );

    setIsPlaying(!isPlaying);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: "setVolume",
        args: [newVolume],
      }),
      "*"
    );
  };

  const toggleMute = () => {
    if (!iframeRef.current) return;

    const player = iframeRef.current.contentWindow;

    if (!isMuted) {
      player?.postMessage(
        JSON.stringify({
          event: "command",
          func: "mute",
        }),
        "*"
      );
      setVolume(0);
      setIsMuted(true);
    } else {
      player?.postMessage(
        JSON.stringify({
          event: "command",
          func: "unMute",
        }),
        "*"
      );
      setVolume(100);
      setIsMuted(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-black to-neutral-900 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-400 text-center drop-shadow">
        jhoan Player
      </h1>

      <div className="w-full max-w-3xl bg-neutral-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-neutral-700">

        <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-green-500 shadow-xl">
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            src={videoURL}
            title="YouTube Player"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

        <div className="mt-6 flex flex-col gap-6">

          <button
            onClick={togglePlay}
            className="flex items-center justify-center gap-3 w-full py-3 text-lg font-semibold rounded-xl bg-green-500 hover:bg-green-600 text-black transition-all shadow-lg active:scale-95"
          >
            {isPlaying ? <Pause size={26} /> : <Play size={26} />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <div className="flex items-center gap-4 w-full">
            <button
              onClick={toggleMute}
              className="p-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 transition shadow"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolume}
              className="w-full accent-green-400 cursor-pointer"
            />

            <span className="w-14 text-center font-semibold text-green-300">
              {volume}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
