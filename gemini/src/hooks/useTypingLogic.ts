import { useState, useEffect, useCallback } from 'react';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  startTime: number | null;
  endTime: number | null;
}

export const useTypingLogic = (targetText: string, isActive: boolean) => {
  const [userInput, setUserInput] = useState('');
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    totalChars: 0,
    startTime: null,
    endTime: null,
  });

  const reset = useCallback(() => {
    setUserInput('');
    setStats({
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      totalChars: 0,
      startTime: null,
      endTime: null,
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || stats.endTime) return;

    const { key } = e;

    // Prevent scrolling with spacebar
    if (key === ' ') {
      e.preventDefault();
    }

    // Ignore non-character keys except Backspace and Space
    if (key.length > 1 && key !== 'Backspace') return;

    if (key === 'Backspace') {
      setUserInput(curr => curr.slice(0, -1));
      return;
    }

    setUserInput(curr => {
      if (curr.length >= targetText.length) return curr;
      
      const newChar = key;
      const newUserInput = curr + newChar;
      
      setStats(prev => {
        let newStartTime = prev.startTime;
        if (newStartTime === null) {
          newStartTime = Date.now();
        }

        const isCorrect = newChar === targetText[curr.length];
        const newCorrectChars = isCorrect ? prev.correctChars + 1 : prev.correctChars;
        const newTotalChars = prev.totalChars + 1;
        
        const accuracy = Math.round((newCorrectChars / newTotalChars) * 100);
        
        let endTime = prev.endTime;
        if (newUserInput.length === targetText.length) {
          endTime = Date.now();
        }

        return {
          ...prev,
          startTime: newStartTime,
          endTime,
          correctChars: newCorrectChars,
          totalChars: newTotalChars,
          accuracy
        };
      });

      return newUserInput;
    });
  }, [isActive, stats.endTime, targetText]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (stats.startTime && !stats.endTime) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - stats.startTime!) / 60000; // in minutes
        const wpm = Math.round((userInput.length / 5) / timeElapsed) || 0;
        setStats(prev => ({ ...prev, wpm }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stats.startTime, stats.endTime, userInput.length]);

  return { userInput, stats, reset };
};
