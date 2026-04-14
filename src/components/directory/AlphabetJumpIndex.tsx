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

  const triggerLetter = useCallback((letter: string | null) => {
    if (!letter || !activeLetters.has(letter)) return;
    setActiveLetter((current) => {
      if (current !== letter) {
        onJumpToLetter(letter);
      }
      return letter;
    });
  }, [activeLetters, onJumpToLetter]);

  const getLetterFromPoint = useCallback((clientX: number, clientY: number) => {
    const hit = document.elementFromPoint(clientX, clientY)?.closest<HTMLButtonElement>('button[data-letter]');
    return hit?.dataset.letter ?? null;
  }, []);

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
    const touch = e.touches[0];
    const letter = getLetterFromPoint(touch.clientX, touch.clientY) ?? getLetterFromY(touch.clientY);
    triggerLetter(letter);
  }, [getLetterFromPoint, getLetterFromY, triggerLetter]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const letter = getLetterFromPoint(touch.clientX, touch.clientY) ?? getLetterFromY(touch.clientY);
    triggerLetter(letter);
  }, [getLetterFromPoint, getLetterFromY, triggerLetter]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setActiveLetter(null), 600);
  }, []);

  const handleTouchCancel = useCallback(() => {
    setIsDragging(false);
    setActiveLetter(null);
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
        onTouchCancel={handleTouchCancel}
      >
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-full py-1 px-0.5 border border-mansagold/30">
          {ALPHABET.map((letter) => {
            const isActive = activeLetters.has(letter);
            const isCurrent = letter === activeLetter;
            return (
              <button
                key={letter}
                type="button"
                data-letter={letter}
                onClick={() => {
                  if (isActive) {
                    setActiveLetter(letter);
                    onJumpToLetter(letter);
                    setTimeout(() => setActiveLetter(null), 600);
                  }
                }}
                className={`block w-6 text-center text-[10px] leading-[15px] font-bold transition-all duration-150 rounded-full
                  ${isCurrent ? 'bg-mansagold text-slate-900 scale-150 -translate-x-2' : ''}
                  ${isActive && !isCurrent ? 'text-mansagold' : ''}
                  ${!isActive ? 'text-gray-600/40' : ''}
                `}
                disabled={!isActive}
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
