import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion } from '../services/quizService';
import { CheckCircle, XCircle, Trophy, Sparkles } from 'lucide-react';

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    setAnswers([...answers, selectedAnswer]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score
      const newAnswers = [...answers, selectedAnswer!];
      const correct = newAnswers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length;
      const scorePercentage = Math.round((correct / quiz.questions.length) * 100);
      
      setIsComplete(true);
      onComplete(scorePercentage);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const calculateFinalScore = () => {
    const correct = answers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length;
    return Math.round((correct / quiz.questions.length) * 100);
  };

  if (isComplete) {
    const score = calculateFinalScore();
    const passed = score >= 60;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
          {/* Confetti effect for high scores */}
          {score >= 80 && (
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
                🎉
              </div>
            </div>
          )}

          <div className="text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              passed ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {passed ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <Sparkles className="w-12 h-12 text-orange-600" />
              )}
            </div>

            <h2 className="text-3xl font-black text-gray-800 mb-2">
              {score >= 90 ? 'Amazing!' : score >= 70 ? 'Great Job!' : score >= 50 ? 'Good Effort!' : 'Keep Learning!'}
            </h2>
            
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0066CC] to-[#FF6B35] mb-4">
              {score}%
            </div>

            <p className="text-gray-600 mb-6">
              You got {answers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length} out of {quiz.questions.length} questions correct!
            </p>

            {score >= 80 && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-6">
                <p className="text-yellow-800 font-semibold">🌟 You earned 50 points!</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0066CC] to-[#FF6B35] text-white rounded-full font-bold hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm text-gray-500 font-semibold">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </h3>
            <div className="flex gap-1 mt-2">
              {quiz.questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full ${
                    idx < currentQuestion ? 'bg-green-500' :
                    idx === currentQuestion ? 'bg-blue-500' :
                    'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correctAnswer;
              const showCorrectness = showExplanation;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 flex items-center justify-between ${
                    showCorrectness
                      ? isCorrect
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : isSelected
                        ? 'bg-red-50 border-red-500 text-red-800'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                      : isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-800'
                      : 'bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span>{option}</span>
                  {showCorrectness && (
                    isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : isSelected ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : null
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 animate-in slide-in-from-bottom-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Explanation:</h4>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!showExplanation ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`flex-1 px-6 py-4 rounded-full font-bold transition-all ${
                selectedAnswer === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#0066CC] to-[#FF6B35] text-white hover:shadow-lg'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#0066CC] to-[#FF6B35] text-white rounded-full font-bold hover:shadow-lg transition-all"
            >
              {isLastQuestion ? 'See Results' : 'Next Question'} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
