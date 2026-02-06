import React from 'react';

interface VirtualKeyboardProps {
  nextChar: string;
}

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' ']
];

const FINGER_MAP: Record<string, string> = {
  'q': 'pinky-l', 'a': 'pinky-l', 'z': 'pinky-l',
  'w': 'ring-l', 's': 'ring-l', 'x': 'ring-l',
  'e': 'middle-l', 'd': 'middle-l', 'c': 'middle-l',
  'r': 'index-l', 'f': 'index-l', 'v': 'index-l',
  't': 'index-l', 'g': 'index-l', 'b': 'index-l',
  'y': 'index-r', 'h': 'index-r', 'n': 'index-r',
  'u': 'index-r', 'j': 'index-r', 'm': 'index-r',
  'i': 'middle-r', 'k': 'middle-r', ',': 'middle-r',
  'o': 'ring-r', 'l': 'ring-r', '.': 'ring-r',
  'p': 'pinky-r', ';': 'pinky-r', '/': 'pinky-r',
  ' ': 'thumb'
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ nextChar }) => {
  const normalizedNextChar = nextChar.toLowerCase();

  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(key => {
            const isHighlight = 
              (key === ' ' && normalizedNextChar === ' ') || 
              (key === normalizedNextChar);
            
            const finger = FINGER_MAP[key] || '';
            
            return (
              <div 
                key={key} 
                className={`key ${key === ' ' ? 'space' : ''} ${isHighlight ? 'highlight ' + finger : ''}`}
              >
                {key === ' ' ? 'Space' : key.toUpperCase()}
              </div>
            );
          })}
        </div>
      ))}
      <div className="text-center mt-2 small text-muted">
        {normalizedNextChar && FINGER_MAP[normalizedNextChar] && (
          <span>Use your <strong>{FINGER_MAP[normalizedNextChar].replace('-', ' ')}</strong></span>
        )}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
