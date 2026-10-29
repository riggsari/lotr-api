import React, { useState, useEffect } from 'react';
import '../styles/HeightMatchingGame.css';

interface Character {
  _id: string;
  name: string;
  height: string;
  race: string;
}

interface GameState {
  characters: Character[];
  shuffledHeights: string[];
  matches: Record<string, string>;
  score: number;
  totalQuestions: number;
  gameOver: boolean;
  loading: boolean;
  error: string | null;
}

const HeightMatchingGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    characters: [],
    shuffledHeights: [],
    matches: {},
    score: 0,
    totalQuestions: 0,
    gameOver: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchCharactersWithHeight();
  }, []);

  const fetchCharactersWithHeight = async () => {
    try {
      setGameState(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch characters from the API
      const response = await fetch('/v2/character?limit=1000');
      
      if (!response.ok) {
        throw new Error('Failed to fetch characters');
      }

      const data = await response.json();
      
      // Filter characters that have height data
      const charactersWithHeight = data.docs
        .filter((char: any) => char.height && char.height.trim())
        .slice(0, 10); // Use first 10 for the game

      if (charactersWithHeight.length < 4) {
        throw new Error('Not enough characters with height data');
      }

      const heights = charactersWithHeight.map((char: Character) => char.height);
      const shuffledHeights = [...heights].sort(() => Math.random() - 0.5);

      setGameState(prev => ({
        ...prev,
        characters: charactersWithHeight,
        shuffledHeights,
        totalQuestions: charactersWithHeight.length,
        loading: false,
      }));
    } catch (err) {
      setGameState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
      }));
    }
  };

  const handleMatch = (characterId: string, height: string) => {
    const character = gameState.characters.find(c => c._id === characterId);
    if (!character) return;

    const isCorrect = character.height === height;
    const newMatches = { ...gameState.matches, [characterId]: height };
    const newScore = isCorrect ? gameState.score + 1 : gameState.score;

    const allMatched = Object.keys(newMatches).length === gameState.totalQuestions;

    setGameState(prev => ({
      ...prev,
      matches: newMatches,
      score: newScore,
      gameOver: allMatched,
    }));
  };

  const resetGame = () => {
    fetchCharactersWithHeight();
    setGameState(prev => ({
      ...prev,
      matches: {},
      score: 0,
      gameOver: false,
    }));
  };

  if (gameState.loading) {
    return (
      <div className="height-game-container">
        <div className="loading">Loading characters...</div>
      </div>
    );
  }

  if (gameState.error) {
    return (
      <div className="height-game-container">
        <div className="error">
          <p>{gameState.error}</p>
          <button onClick={resetGame} className="btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="height-game-container">
      <header className="game-header">
        <h1>⚔️ Character Height Matching Game</h1>
        <p className="subtitle">Match each character to their height</p>
      </header>

      <div className="game-card">
        <div className="score-board">
          <div className="score-item">
            <span className="score-label">Score</span>
            <span className="score-value">
              {gameState.score} / {gameState.totalQuestions}
            </span>
          </div>
          <div className="score-item">
            <span className="score-label">Progress</span>
            <span className="score-value">
              {Object.keys(gameState.matches).length} / {gameState.totalQuestions}
            </span>
          </div>
        </div>

        {gameState.gameOver && (
          <div className="game-over-message">
            <h2>🎉 Game Complete!</h2>
            <p>You matched {gameState.score} out of {gameState.totalQuestions} characters correctly!</p>
            <button onClick={resetGame} className="btn-play-again">
              Play Again
            </button>
          </div>
        )}

        <div className="matching-grid">
          <div className="characters-column">
            <h3>Characters</h3>
            <div className="character-list">
              {gameState.characters.map(character => (
                <div
                  key={character._id}
                  className={`character-item ${
                    gameState.matches[character._id] ? 'matched' : ''
                  } ${
                    gameState.matches[character._id] === character.height
                      ? 'correct'
                      : gameState.matches[character._id]
                      ? 'incorrect'
                      : ''
                  }`}
                >
                  <div className="character-name">{character.name}</div>
                  <div className="character-race">({character.race})</div>
                  {gameState.matches[character._id] && (
                    <div className="match-status">
                      {gameState.matches[character._id] === character.height ? '✓' : '✗'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="heights-column">
            <h3>Heights</h3>
            <div className="height-list">
              {gameState.shuffledHeights.map((height, index) => {
                const matchedCharacterId = Object.keys(gameState.matches).find(
                  id => gameState.matches[id] === height
                );
                const isCorrectMatch = matchedCharacterId
                  ? gameState.characters.find(c => c._id === matchedCharacterId)?.height === height
                  : false;

                return (
                  <button
                    key={index}
                    className={`height-item ${matchedCharacterId ? 'used' : ''} ${
                      isCorrectMatch ? 'correct-match' : ''
                    }`}
                    disabled={matchedCharacterId !== undefined}
                    title={height}
                  >
                    {height}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="character-height-pairs">
          <h3>Make Your Matches</h3>
          <div className="pairs-list">
            {gameState.characters.map(character => (
              <div key={character._id} className="pair-row">
                <span className="pair-character">{character.name}</span>
                <div className="pair-heights">
                  {gameState.shuffledHeights.map((height, idx) => (
                    <button
                      key={idx}
                      className={`height-option ${
                        gameState.matches[character._id] === height ? 'selected' : ''
                      } ${
                        gameState.matches[character._id] === height &&
                        character.height === height
                          ? 'correct'
                          : gameState.matches[character._id] === height
                          ? 'incorrect'
                          : ''
                      }`}
                      onClick={() => handleMatch(character._id, height)}
                      disabled={
                        gameState.matches[character._id] !== undefined &&
                        gameState.matches[character._id] !== height
                      }
                    >
                      {height}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeightMatchingGame;
