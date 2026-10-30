import React, { useState, useEffect, useCallback } from 'react';
import backgroundImage from '../assets/lotr-bg.jpeg';

interface Quote {
  _id: string;
  dialog: string;
  movie: string;
  character: string;
  id: string;
}

interface Character {
  _id: string;
  name: string;
  race?: string;
  realm?: string;
  birth?: string;
  gender?: string;
}

interface Movie {
  _id: string;
  name: string;
}

const WhoSaidIt: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [options, setOptions] = useState<Character[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [correctCharacter, setCorrectCharacter] = useState<Character | null>(null);

  const TOTAL_QUESTIONS = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quotesRes, charactersRes, moviesRes] = await Promise.all([
        fetch('https://the-one-api.dev/v2/quote'),
        fetch('https://the-one-api.dev/v2/character'),
        fetch('https://the-one-api.dev/v2/movie')
      ]);

      const quotesData = await quotesRes.json();
      const charactersData = await charactersRes.json();
      const moviesData = await moviesRes.json();

      // Filter quotes that have a character
      const validQuotes = quotesData.docs.filter((q: Quote) => q.character && q.dialog);
      
      setQuotes(validQuotes);
      setCharacters(charactersData.docs);
      setMovies(moviesData.docs);
      
      if (validQuotes.length > 0 && charactersData.docs.length > 0) {
        loadNewQuestion(validQuotes, charactersData.docs, moviesData.docs, 0);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const loadNewQuestion = (
    quotesPool: Quote[],
    charactersPool: Character[],
    moviesPool: Movie[],
    questionNum: number
  ) => {
    if (questionNum >= TOTAL_QUESTIONS) {
      setGameOver(true);
      return;
    }

    // Pick a random quote
    const randomQuote = quotesPool[Math.floor(Math.random() * quotesPool.length)];
    setCurrentQuote(randomQuote);

    // Find the correct character
    const correct = charactersPool.find(c => c._id === randomQuote.character);
    if (!correct) return;

    setCorrectCharacter(correct);

    // Get 3 random wrong characters
    const wrongCharacters = charactersPool
      .filter(c => c._id !== randomQuote.character && c.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Combine and shuffle
    const allOptions = [correct, ...wrongCharacters].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuestionNumber(questionNum + 1);
  };

  const handleAnswer = (characterId: string) => {
    if (selectedAnswer) return; // Already answered

    setSelectedAnswer(characterId);
    const correct = characterId === currentQuote?.character;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    loadNewQuestion(quotes, characters, movies, questionNumber);
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setQuestionNumber(0);
    setGameOver(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    loadNewQuestion(quotes, characters, movies, 0);
  };

  const getMovieName = (movieId: string) => {
    const movie = movies.find(m => m._id === movieId);
    return movie ? movie.name : 'Unknown Movie';
  };

  const getPerformanceMessage = () => {
    const percentage = (score / TOTAL_QUESTIONS) * 100;
    if (percentage === 100) return "Perfect! You are a true scholar of Middle-earth!";
    if (percentage >= 80) return "Excellent! Your knowledge is vast!";
    if (percentage >= 60) return "Good work! You know your lore!";
    if (percentage >= 40) return "Not bad! Keep studying the tales!";
    return "Keep watching! There's much to learn!";
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#d4af37',
        fontSize: '24px',
        fontFamily: 'Georgia, serif'
      }}>
        Loading the tales of Middle-earth...
      </div>
    );
  }

  if (gameOver) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          background: 'rgba(20, 20, 20, 0.95)',
          border: '3px solid #d4af37',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)'
        }}>
          <h1 style={{
            color: '#d4af37',
            fontSize: '36px',
            marginBottom: '20px',
            fontFamily: 'Georgia, serif',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}>
            Game Complete!
          </h1>
          
          <div style={{
            fontSize: '72px',
            color: '#d4af37',
            margin: '30px 0',
            fontWeight: 'bold',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)'
          }}>
            {score}/{TOTAL_QUESTIONS}
          </div>
          
          <p style={{
            color: '#f0e6d2',
            fontSize: '20px',
            marginBottom: '30px',
            fontFamily: 'Georgia, serif',
            lineHeight: '1.6'
          }}>
            {getPerformanceMessage()}
          </p>
          
          <button
            onClick={handleRestart}
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #aa8a2e 100%)',
              color: '#1a1a1a',
              border: 'none',
              padding: '15px 40px',
              fontSize: '18px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            color: '#d4af37',
            fontSize: '42px',
            marginBottom: '10px',
            fontFamily: 'Georgia, serif',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)'
          }}>
            Who Said It?
          </h1>
          <p style={{
            color: '#f0e6d2',
            fontSize: '18px',
            fontFamily: 'Georgia, serif',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'
          }}>
            Test your knowledge of Middle-earth
          </p>
        </div>

        {/* Score Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'rgba(20, 20, 20, 0.95)',
            border: '2px solid #d4af37',
            borderRadius: '8px',
            padding: '15px 25px',
            flex: '1',
            minWidth: '150px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
          }}>
            <div style={{
              color: '#d4af37',
              fontSize: '14px',
              marginBottom: '5px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Score
            </div>
            <div style={{
              color: '#f0e6d2',
              fontSize: '28px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              {score}/{TOTAL_QUESTIONS}
            </div>
          </div>

          <div style={{
            background: 'rgba(20, 20, 20, 0.95)',
            border: '2px solid #d4af37',
            borderRadius: '8px',
            padding: '15px 25px',
            flex: '1',
            minWidth: '150px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
          }}>
            <div style={{
              color: '#d4af37',
              fontSize: '14px',
              marginBottom: '5px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Question
            </div>
            <div style={{
              color: '#f0e6d2',
              fontSize: '28px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              {questionNumber}/{TOTAL_QUESTIONS}
            </div>
          </div>

          <div style={{
            background: 'rgba(20, 20, 20, 0.95)',
            border: '2px solid #d4af37',
            borderRadius: '8px',
            padding: '15px 25px',
            flex: '1',
            minWidth: '150px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
          }}>
            <div style={{
              color: '#d4af37',
              fontSize: '14px',
              marginBottom: '5px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Streak
            </div>
            <div style={{
              color: '#f0e6d2',
              fontSize: '28px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              {streak} 🔥
            </div>
          </div>
        </div>

        {/* Quote Card */}
        {currentQuote && (
          <div style={{
            background: 'rgba(20, 20, 20, 0.95)',
            border: '3px solid #d4af37',
            borderRadius: '12px',
            padding: '40px',
            marginBottom: '30px',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              fontSize: '60px',
              color: '#d4af37',
              opacity: 0.3,
              fontFamily: 'Georgia, serif',
              lineHeight: '1'
            }}>
              "
            </div>
            
            <p style={{
              color: '#f0e6d2',
              fontSize: '24px',
              lineHeight: '1.6',
              marginBottom: '20px',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              textAlign: 'center',
              paddingLeft: '20px',
              paddingRight: '20px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
            }}>
              {currentQuote.dialog}
            </p>
            
            <div style={{
              textAlign: 'center',
              color: '#d4af37',
              fontSize: '14px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              From: {getMovieName(currentQuote.movie)}
            </div>
          </div>
        )}

        {/* Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {options.map((character) => {
            const isSelected = selectedAnswer === character._id;
            const isCorrectAnswer = character._id === currentQuote?.character;
            const showResult = selectedAnswer !== null;
            
            let backgroundColor = 'rgba(20, 20, 20, 0.95)';
            let borderColor = '#d4af37';
            let textColor = '#f0e6d2';
            
            if (showResult) {
              if (isCorrectAnswer) {
                backgroundColor = 'rgba(34, 139, 34, 0.3)';
                borderColor = '#4ade80';
                textColor = '#4ade80';
              } else if (isSelected) {
                backgroundColor = 'rgba(139, 0, 0, 0.3)';
                borderColor = '#ef4444';
                textColor = '#ef4444';
              }
            }

            return (
              <button
                key={character._id}
                onClick={() => handleAnswer(character._id)}
                disabled={selectedAnswer !== null}
                style={{
                  background: backgroundColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '8px',
                  padding: '20px',
                  color: textColor,
                  fontSize: '18px',
                  fontFamily: 'Georgia, serif',
                  cursor: selectedAnswer ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  boxShadow: isSelected ? `0 4px 16px ${borderColor}66` : '0 2px 8px rgba(212, 175, 55, 0.2)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                }}
                onMouseEnter={(e) => {
                  if (!selectedAnswer) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
                    e.currentTarget.style.borderColor = '#f0e6d2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedAnswer) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.2)';
                    e.currentTarget.style.borderColor = '#d4af37';
                  }
                }}
              >
                {character.name}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {selectedAnswer && correctCharacter && (
          <div style={{
            background: 'rgba(20, 20, 20, 0.95)',
            border: `3px solid ${isCorrect ? '#4ade80' : '#ef4444'}`,
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: `0 8px 32px ${isCorrect ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            <h3 style={{
              color: isCorrect ? '#4ade80' : '#ef4444',
              fontSize: '28px',
              marginBottom: '15px',
              fontFamily: 'Georgia, serif',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </h3>
            
            <p style={{
              color: '#f0e6d2',
              fontSize: '18px',
              marginBottom: '15px',
              fontFamily: 'Georgia, serif',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
            }}>
              {isCorrect 
                ? `Well done! This was indeed spoken by ${correctCharacter.name}.`
                : `The correct answer was ${correctCharacter.name}.`
              }
            </p>

            <div style={{
              color: '#d4af37',
              fontSize: '16px',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.8'
            }}>
              {correctCharacter.race && <div><strong>Race:</strong> {correctCharacter.race}</div>}
              {correctCharacter.realm && <div><strong>Realm:</strong> {correctCharacter.realm}</div>}
              {correctCharacter.birth && <div><strong>Birth:</strong> {correctCharacter.birth}</div>}
              {correctCharacter.gender && <div><strong>Gender:</strong> {correctCharacter.gender}</div>}
            </div>
          </div>
        )}

        {/* Next Button */}
        {selectedAnswer && questionNumber < TOTAL_QUESTIONS && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #aa8a2e 100%)',
                color: '#1a1a1a',
                border: 'none',
                padding: '15px 50px',
                fontSize: '18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
              }}
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhoSaidIt;
