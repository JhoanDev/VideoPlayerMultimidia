"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Menu } from "lucide-react";

const videoList = [
  { title: "Rock Lee vs Gaara", src: "/videos/Rock_lee_Gaara_1min.mp4" },
  { title: "Minato Hero", src: "/videos/Minato_Hero_1min.mp4" },
  { title: "Madara Centuries", src: "/videos/Madara_Centuries_1min.mp4" }
];

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentVideo = videoList[currentIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = () => setCurrentTime(video.currentTime);
    const load = () => setDuration(video.duration);
    const end = () => handleNext();

    video.addEventListener("timeupdate", update);
    video.addEventListener("loadedmetadata", load);
    video.addEventListener("ended", end);

    return () => {
      video.removeEventListener("timeupdate", update);
      video.removeEventListener("loadedmetadata", load);
      video.removeEventListener("ended", end);
    };
  }, [currentIndex]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!isNaN(v.duration)) setDuration(v.duration);
  }, [currentVideo]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    isPlaying ? v.pause() : v.play();
    setIsPlaying(!isPlaying);
  };

  const format = (t: number) =>
    isNaN(t)
      ? "0:00"
      : `${Math.floor(t / 60)}:${Math.floor(t % 60)
          .toString()
          .padStart(2, "0")}`;

  const changeTime = (e: any) => {
    const v = videoRef.current;
    if (!v) return;
    const value = Number(e.target.value);
    v.currentTime = value;
    setCurrentTime(value);
  };

  const changeVolume = (e: any) => {
    const value = Number(e.target.value);
    setVolume(value);
    setIsMuted(value === 0);
    if (videoRef.current) videoRef.current.volume = value;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skip = (sec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += sec;
  };

  const handleNext = () => {
    const next = currentIndex < videoList.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(next);
    setIsPlaying(true);
    setTimeout(() => videoRef.current?.play(), 200);
  };

  const handlePrev = () => {
    const prev = currentIndex > 0 ? currentIndex - 1 : videoList.length - 1;
    setCurrentIndex(prev);
    setIsPlaying(true);
    setTimeout(() => videoRef.current?.play(), 200);
  };

  const selectVideo = (i: number) => {
    setCurrentIndex(i);
    setIsPlaying(true);
    setMenuOpen(false);
    setTimeout(() => videoRef.current?.play(), 200);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col md:flex-row">

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-3 bg-purple-800 w-full flex items-center gap-2"
      >
        <Menu /> Abrir lista
      </button>

      <div
        className={`md:w-64 bg-[#120019] border-r border-purple-700 p-4 space-y-3 overflow-y-auto
        ${menuOpen ? "block" : "hidden"} md:block`}
      >
        <h2 className="text-xl font-bold text-purple-400">Lista de Vídeos</h2>

        {videoList.map((v, i) => (
          <button
            key={i}
            onClick={() => selectVideo(i)}
            className={`w-full text-left p-3 rounded-lg transition ${
              i === currentIndex
                ? "bg-purple-700 text-white"
                : "bg-[#1a001f] text-purple-300 hover:bg-purple-900"
            }`}
          >
            {v.title}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6">
        <h1 className="text-3xl font-bold mb-4 text-purple-400 text-center">
          Jhoan Player
        </h1>

        <div className="w-full max-w-4xl bg-[#1a001f] p-4 rounded-xl shadow-xl">

          <video
            ref={videoRef}
            src={currentVideo.src}
            className="w-full aspect-video object-cover rounded-xl mb-3"
            controls={false}
          />

          <div className="flex justify-between text-sm mb-1">
            <span>{format(currentTime)}</span>
            <span>{format(duration)}</span>
          </div>

          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={changeTime}
            className="w-full md:h-3 md:bg-gray-700 md:rounded-full"
            style={{
              "--value-percent": `${(currentTime / duration) * 100}%`
            } as React.CSSProperties}
          />

          <div className="grid grid-cols-5 gap-2 md:flex md:items-center md:justify-between">
            <button className="p-3 bg-purple-800 rounded-xl" onClick={handlePrev}>
              <SkipBack />
            </button>

            <button className="p-3 bg-purple-800 rounded-xl" onClick={() => skip(-10)}>
              -10s
            </button>

            <button className="p-3 bg-purple-500 text-black font-bold rounded-xl" onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <button className="p-3 bg-purple-800 rounded-xl" onClick={() => skip(10)}>
              +10s
            </button>

            <button className="p-3 bg-purple-800 rounded-xl" onClick={handleNext}>
              <SkipForward />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button onClick={toggleMute} className="p-2 bg-purple-800 rounded-xl">
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={changeVolume}
              className="w-full md:h-3 md:bg-gray-700 md:rounded-full"
              style={{
                "--value-percent": `${volume * 100}%`
              } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
