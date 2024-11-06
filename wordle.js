const React = require('react');
const { useState, useEffect } = require('react');

const { AlertCircle } = require('lucide-react');

const { Alert, AlertDescription } = require('@/components/ui/alert');

const WORD_LIST = ['REACT', 'CODES', 'LOGIC', 'GAMMA', 'DELTA', 'ALPHA', 'BREAK', 'STACK', 'QUEUE'];
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const WordleGame = () => {
  const [gameState, setGameState] = useState({
    guesses: Array(MAX_ATTEMPTS).fill(''),
    currentAttempt: 0,
    targetWord: '',
    gameOver: false,
    won: false,
    message: ''
  });

  const [currentInput, setCurrentInput] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setGameState(prev => ({ ...prev, targetWord: randomWord }));
  }, []);

  const checkGuess = (guess) => {
    const target = gameState.targetWord.split('');
    const result = Array(WORD_LENGTH).fill('bg-gray-500');
    
    guess.split('').forEach((letter, i) => {
      if (letter === target[i]) {
        result[i] = 'bg-green-500';
        target[i] = null;
      }
    });
    guess.split('').forEach((letter, i) => {
      if (result[i] !== 'bg-green-500' && target.includes(letter)) {
        result[i] = 'bg-yellow-500';
        target[target.indexOf(letter)] = null;
      }
    });
    
    return result;
  };

  const handleKeyPress = (key) => {
    if (gameState.gameOver) return;

    if (key === 'ENTER') {
      if (currentInput.length !== WORD_LENGTH) {
        setShake(true);
        setGameState(prev => ({ ...prev, message: 'Not enough letters' }));
        setTimeout(() => setShake(false), 500);
        return;
      }

      if (!WORD_LIST.includes(currentInput)) {
        setShake(true);
        setGameState(prev => ({ ...prev, message: 'Not in word list' }));
        setTimeout(() => setShake(false), 500);
        return;
      }

      const newGuesses = [...gameState.guesses];
      newGuesses[gameState.currentAttempt] = currentInput;

      const won = currentInput === gameState.targetWord;
      const gameOver = won || gameState.currentAttempt === MAX_ATTEMPTS - 1;

      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentAttempt: prev.currentAttempt + 1,
        gameOver,
        won,
        message: won ? 'You won!' : gameOver ? `The word was ${gameState.targetWord}` : ''
      }));
      setCurrentInput('');
    } else if (key === 'BACKSPACE') {
      setCurrentInput(prev => prev.slice(0, -1));
    } else if (currentInput.length < WORD_LENGTH) {
      setCurrentInput(prev => prev + key);
    }
  };

  const renderBoard = () => {
    return Array(MAX_ATTEMPTS).fill(null).map((_, rowIndex) => {
      const isCurrentRow = rowIndex === gameState.currentAttempt;
      const guess = gameState.guesses[rowIndex] || '';
      const letters = isCurrentRow ? currentInput.padEnd(WORD_LENGTH, ' ') : guess.padEnd(WORD_LENGTH, ' ');
      const colors = guess ? checkGuess(guess) : Array(WORD_LENGTH).fill('bg-gray-200');

      return (
        <div 
          key={rowIndex}
          className={`flex gap-2 mb-2 ${isCurrentRow && shake ? 'animate-shake' : ''}`}
        >
          {letters.split('').map((letter, i) => (
            <div
              key={i}
              className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold 
                ${colors[i]} ${letter !== ' ' ? 'border-gray-400' : 'border-gray-200'}`}
            >
              {letter !== ' ' ? letter : ''}
            </div>
          ))}
        </div>
      );
    });
  };

  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    return rows.map((row, i) => (
      <div key={i} className="flex justify-center gap-1 mb-1">
        {row.map(key => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className={`px-2 py-4 rounded font-bold bg-gray-300 hover:bg-gray-400
              ${key === 'ENTER' || key === 'BACKSPACE' ? 'px-4' : 'min-w-[40px]'}`}
          >
            {key === 'BACKSPACE' ? '←' : key}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Wordle Clone</h1>
      <div className="mb-8">{renderBoard()}</div>
      <div className="mb-4">{renderKeyboard()}</div>
      {gameState.message && (
        <Alert variant="default" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{gameState.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WordleGame;
