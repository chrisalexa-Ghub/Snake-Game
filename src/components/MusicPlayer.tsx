import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

const TRACKS = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "AI Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon/400/400"
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "Synth Mind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber/400/400"
  },
  {
    id: 3,
    title: "Midnight Drive",
    artist: "Chill Bot",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/drive/400/400"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Autoplay blocked or error:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (value[0] / 100) * duration;
      setProgress(value[0]);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full flex items-center gap-12">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      {/* Now Playing */}
      <div className="flex items-center gap-4 w-[220px] shrink-0">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-neon)] shadow-[0_0_10px_rgba(0,212,255,0.3)] shrink-0 overflow-hidden">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="min-w-0">
          <div className="text-[0.85rem] font-bold text-white truncate">{currentTrack.title}</div>
          <div className="text-[0.75rem] text-[var(--text-secondary)] truncate">{currentTrack.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 shrink-0">
        <button onClick={prevTrack} className="text-white/60 hover:text-white transition-colors">
          <SkipBack className="w-5 h-5 fill-current" />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
        </button>

        <button onClick={nextTrack} className="text-white/60 hover:text-white transition-colors">
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="relative h-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const clickedProgress = (x / rect.width) * 100;
          handleSeek([clickedProgress]);
        }}>
          <div 
            className="absolute h-full bg-[var(--accent-blue)] shadow-[0_0_10px_rgba(0,212,255,0.5)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="flex justify-between font-mono text-[0.7rem] text-[var(--text-secondary)]">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : "0:00"}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="w-[120px] flex items-center gap-3 shrink-0">
        <Volume2 className="w-4 h-4 text-[var(--text-secondary)]" />
        <div className="relative flex-1 h-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const newVol = (x / rect.width) * 100;
          setVolume(newVol);
        }}>
          <div 
            className="absolute h-full bg-[var(--accent-blue)]" 
            style={{ width: `${volume}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
