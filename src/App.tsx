import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Github, Twitter, ExternalLink } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen bg-[var(--bg-dark)] text-[var(--text-primary)] font-sans flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 bg-black/20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[var(--accent-neon)] rounded shadow-[0_0_10px_rgba(0,255,157,0.4)]" />
          <h1 className="text-lg font-extrabold tracking-[2px] uppercase text-[var(--accent-neon)]">SynthSnake v1.0</h1>
        </div>
        <div className="text-[0.65rem] px-2 py-1 rounded bg-[var(--accent-neon)]/10 text-[var(--accent-neon)] border border-[var(--accent-neon)]/20 font-bold uppercase tracking-wider">
          System Online
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-[280px_1fr_240px] overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-[var(--panel-bg)] border-r border-[var(--border)] p-6 flex flex-col gap-8 overflow-y-auto">
          <div>
            <h3 className="text-[0.7rem] uppercase tracking-[2px] text-[var(--text-secondary)] mb-4 font-bold">Library</h3>
            {/* We'll pass a prop to MusicPlayer to render just the list here if needed, 
                but for now let's keep the player in the footer and maybe a mini-list here */}
            <div className="space-y-3 opacity-80">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--accent-neon)]/5 border-l-2 border-[var(--accent-neon)]">
                <div className="w-10 h-10 rounded bg-gradient-to-br from-cyan-400 to-emerald-400" />
                <div>
                  <div className="text-[0.85rem] font-semibold">Neon Drift</div>
                  <div className="text-[0.75rem] text-[var(--text-secondary)]">AI Ensemble</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded bg-gradient-to-br from-rose-500 to-purple-600" />
                <div>
                  <div className="text-[0.85rem] font-semibold">Midnight Pulse</div>
                  <div className="text-[0.75rem] text-[var(--text-secondary)]">SynthBot 9</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[0.7rem] uppercase tracking-[2px] text-[var(--text-secondary)] mb-4 font-bold">Game Controls</h3>
            <div className="text-[0.75rem] text-[var(--text-secondary)] leading-relaxed font-mono">
              W A S D — MOVE<br />
              SPACE — RESTART<br />
              ESC — PAUSE
            </div>
          </div>
        </aside>

        {/* Game Arena */}
        <section className="relative bg-[radial-gradient(circle_at_center,#15151a_0%,#08080a_100%)] flex flex-col items-center justify-center p-8 overflow-hidden">
          <SnakeGame />
        </section>

        {/* Right Panel */}
        <aside className="bg-[var(--panel-bg)] border-l border-[var(--border)] p-6 flex flex-col gap-8 overflow-y-auto">
          <div className="text-center">
            <h3 className="text-[0.7rem] uppercase tracking-[2px] text-[var(--text-secondary)] mb-2 font-bold">Session History</h3>
            <div className="flex flex-col gap-3 font-mono text-[0.8rem]">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">24.05.2024</span>
                <span className="text-[var(--accent-neon)] font-bold">940</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">23.05.2024</span>
                <span className="text-[var(--accent-neon)] font-bold">820</span>
              </div>
              <div className="flex justify-between opacity-40">
                <span className="text-[var(--text-secondary)]">22.05.2024</span>
                <span>610</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Playback Bar */}
      <footer className="h-[100px] border-t border-[var(--border)] bg-[var(--panel-bg)] px-8 flex items-center gap-12 shrink-0">
        <MusicPlayer />
      </footer>
    </div>
  );
}

