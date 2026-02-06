import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { LESSONS } from './data/lessons';
import type { Lesson } from './data/lessons';
import { useTypingLogic } from './hooks/useTypingLogic';
import VirtualKeyboard from './components/VirtualKeyboard';
import './index.css';

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(LESSONS[0]);
  const [isStarted, setIsStarted] = useState(false);
  const { userInput, stats, reset } = useTypingLogic(currentLesson.text, isStarted);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsStarted(false);
    reset();
  };

  const handleStart = () => {
    setIsStarted(true);
    reset();
  };

  const renderText = () => {
    return currentLesson.text.split('').map((char, index) => {
      let className = 'char';
      if (index < userInput.length) {
        className += userInput[index] === char ? ' correct' : ' incorrect';
      } else if (index === userInput.length) {
        className += ' current';
      }
      return (
        <span key={index} className={className}>
          {char === ' ' && index === userInput.length ? ' ' : char}
        </span>
      );
    });
  };

  const nextChar = currentLesson.text[userInput.length] || '';

  return (
    <Container className="typing-container">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">TypeMaster</h2>
          <p className="text-muted">Master the 10-finger technique</p>
        </Col>
        <Col xs="auto">
          <Badge bg="info" className="me-2">{currentLesson.mode.toUpperCase()}</Badge>
          <Button variant="outline-primary" size="sm" onClick={reset}>Reset</Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <div className="d-grid gap-2">
            <h6 className="text-uppercase text-muted small fw-bold">Lessons</h6>
            {LESSONS.map(lesson => (
              <Button
                key={lesson.id}
                variant={currentLesson.id === lesson.id ? 'primary' : 'light'}
                className="text-start"
                onClick={() => handleLessonSelect(lesson)}
              >
                {lesson.title}
              </Button>
            ))}
          </div>
        </Col>
        <Col md={9}>
          <Card className="border-0 bg-light mb-4 shadow-sm">
            <Card.Body className="p-4 text-center">
              {!isStarted && !stats.endTime ? (
                <div className="py-5">
                  <h4>Ready to practice?</h4>
                  <p className="text-muted">Focus on "{currentLesson.title}"</p>
                  <Button variant="primary" size="lg" onClick={handleStart}>Start Typing</Button>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <Badge bg="success" className="px-3 py-2">LIVE - Start Typing</Badge>
                  </div>
                  <div className="char-display mb-4">
                    {renderText()}
                  </div>
                  <Row className="text-center">
                    <Col>
                      <div className="h4 mb-0">{stats.wpm}</div>
                      <div className="small text-muted text-uppercase fw-bold">WPM</div>
                    </Col>
                    <Col>
                      <div className="h4 mb-0">{stats.accuracy}%</div>
                      <div className="small text-muted text-uppercase fw-bold">Accuracy</div>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>

          {stats.endTime ? (
            <div className="text-center p-4 bg-success bg-opacity-10 rounded shadow-sm">
              <h3 className="text-success">Level Complete!</h3>
              <p className="lead">You achieved <strong>{stats.wpm} WPM</strong> with <strong>{stats.accuracy}%</strong> accuracy.</p>
              <Button variant="success" className="me-2" onClick={handleStart}>Try Again</Button>
              <Button variant="outline-success" onClick={() => {
                const nextIdx = LESSONS.findIndex(l => l.id === currentLesson.id) + 1;
                if (nextIdx < LESSONS.length) handleLessonSelect(LESSONS[nextIdx]);
              }}>Next Lesson</Button>
            </div>
          ) : isStarted && (
            <VirtualKeyboard nextChar={nextChar} />
          )}
        </Col>
      </Row>

      <footer className="mt-5 pt-4 border-top text-center text-muted small">
        <p>Tip: Keep your fingers on the home row (ASDF JKL;) and use all 10 fingers!</p>
      </footer>
    </Container>
  );
};

export default App;