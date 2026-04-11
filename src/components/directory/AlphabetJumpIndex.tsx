import React, { useCallback, useRef, useState } from 'react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

interface AlphabetJumpIndexProps {
  /** Letters that have at least one business */
  activeLetters: Set<string>;
  onJumpToLetter: (letter: string) => void;
}

const AlphabetJumpIndex: React.FC<AlphabetJumpIndexProps> = ({ activeLetters, onJumpToLetter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getLetterFromY = useCallback((clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const index = Math.floor((y / rect.height) * ALPHABET.length);
    if (index >= 0 && index < ALPHABET.length) {
      return ALPHABET[index];
    }
    return null;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const letter = getLetterFromY(e.touches[0].clientY);
    if (letter && activeLetters.has(letter)) {
      setActiveLetter(letter);
      onJumpToLetter(letter);
    }
  }, [getLetterFromY, activeLetters, onJumpToLetter]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const letter = getLetterFromY(e.touches[0].clientY);
    if (letter && letter !== activeLetter && activeLetters.has(letter)) {
      setActiveLetter(letter);
      onJumpToLetter(letter);
    }
  }, [getLetterFromY, activeLetter, activeLetters, onJumpToLetter]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setActiveLetter(null), 600);
  }, []);

  return (
    <>
      {/* Floating letter indicator */}
      {isDragging && activeLetter && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-mansagold text-slate-900 font-bold text-5xl w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl shadow-mansagold/40">
            {activeLetter}
          </div>
        </div>
      )}

      {/* Alphabet strip */}
      <div
        ref={containerRef}
        className="fixed right-0.5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center py-1 select-none touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-full py-1 px-0.5 border border-mansagold/20">
          {ALPHABET.map((letter) => {
            const isActive = activeLetters.has(letter);
            const isCurrent = letter === activeLetter;
            return (
              <button
                key={letter}
                onClick={() => {
                  if (isActive) {
                    setActiveLetter(letter);
                    onJumpToLetter(letter);
                    setTimeout(() => setActiveLetter(null), 600);
                  }
                }}
                className={`block w-5 text-center text-[10px] leading-[14px] font-semibold transition-all duration-150 rounded-full
                  ${isCurrent ? 'bg-mansagold text-slate-900 scale-150 -translate-x-2' : ''}
                  ${isActive && !isCurrent ? 'text-mansagold' : ''}
                  ${!isActive ? 'text-gray-600' : ''}
                `}
                aria-label={`Jump to ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AlphabetJumpIndex;
