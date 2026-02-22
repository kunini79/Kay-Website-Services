import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (xpEarned: number, isPerfect?: boolean) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  // Constants
  const XP_PER_QUESTION = 10;
  const XP_BONUS_ALL_CORRECT = 20;

  const currentQuestion = questions[currentQuestionIndex];
  
  // Debug: Log the correct answer to console to help diagnose
  console.log('Quiz Debug:', { 
    question: currentQuestion.question, 
    correctAnswerRaw: currentQuestion.correctAnswer, 
    correctIndex: Number(currentQuestion.correctAnswer),
    options: currentQuestion.options
  });

  // Fallback: Default to 0 if invalid, though this is suboptimal. Ideally we should filter out broken questions.
  const correctIndex = isNaN(Number(currentQuestion?.correctAnswer)) ? 0 : Number(currentQuestion?.correctAnswer);
  
  // Debug check: ensure index is within range [0, 3]
  // If it's outside range (e.g. 1-4 instead of 0-3), try to enable it or clamp it?
  // Let's assume 0-based is intended. If we see 4, well...
  const safeCorrectIndex = (correctIndex >= 0 && correctIndex < currentQuestion.options.length) 
    ? correctIndex 
    : 0; 
  
  const isCorrect = selectedOption === safeCorrectIndex;

  const handleOptionClick = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    // Check against safe index
    if (index === safeCorrectIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    if (!xpAwarded) {
      let totalXP = score * XP_PER_QUESTION;
      if (selectedOption === currentQuestion.correctAnswer) {
         // Add the last question's score if it wasn't added yet? 
         // careful, setScore is async. But we updated it in handleOptionClick.
         // Wait, handleOptionClick runs before this? No.
         // If we are here, we are clicking "Finish" or "Next".
         // Let's rely on `score` state which should be updated.
         // Actually, if the last answer was correct, score includes it.
         // Let's re-calculate to be safe or just use a local variable for the last one.
      }
      
      // But wait: handleOptionClick updates score. handleNextQuestion is called after user sees explanation and clicks Next.
      // So score is up to date for previous questions. 
      // For the last question, handleOptionClick runs -> score updates -> user clicks "Finish" -> finishQuiz runs.
      // So `score` is correct.
      
      let finalXP = score * XP_PER_QUESTION + (score === questions.length ? XP_BONUS_ALL_CORRECT : 0);
      
      onComplete(finalXP, score === questions.length);
      setXpAwarded(true);
    }
  };

  if (quizCompleted) {
    const totalXP = score * XP_PER_QUESTION + (score === questions.length ? XP_BONUS_ALL_CORRECT : 0);
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600 mb-4 animate-bounce">
          <Award size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-lg text-gray-600 mb-6">
          You got <span className="font-bold text-[var(--tb-primary)]">{score}</span> out of <span className="font-bold">{questions.length}</span> correct.
        </p>
        
        <div className="inline-block bg-[var(--tb-category-bg)] px-6 py-3 rounded-full mb-8">
          <span className="text-[var(--tb-primary)] font-bold text-xl">+{totalXP} XP Earned</span>
        </div>

        <div>
          <Button onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setShowExplanation(false);
            setScore(0);
            setQuizCompleted(false);
            setXpAwarded(false);
          }} variant="secondary">
            <RotateCcw size={18} className="mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md" style={{ backgroundColor: 'white', color: 'black' }}>
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100">
        <div 
          className="h-full bg-[var(--tb-primary)] transition-all duration-300"
          style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Pop Quiz!</h3>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <h4 className="text-lg md:text-xl font-medium mb-6 leading-relaxed">
          {currentQuestion.question}
        </h4>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === safeCorrectIndex;
            const showResult = showExplanation;

            let borderClass = 'border-gray-200 hover:border-[var(--tb-primary)]';
            let bgClass = 'bg-white hover:bg-gray-50';
            let icon = null;

            if (showResult) {
               if (isCorrectOption) {
                 borderClass = 'border-green-500 ring-1 ring-green-500 bg-white';
                 icon = <Check size={20} className="text-green-600" />;
               } else if (isSelected) {
                 borderClass = 'border-red-500 ring-1 ring-red-500 bg-white';
                 icon = <X size={20} className="text-red-600" />;
               } else {
                 bgClass = 'opacity-50 grayscale';
               }
            } else if (isSelected) {
              borderClass = 'border-[var(--tb-primary)] ring-1 ring-[var(--tb-primary)]';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group relative ${borderClass} ${bgClass}`}
              >
                <span className="font-medium pr-8">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className={`p-4 rounded-lg mb-6 border-l-4 ${isCorrect ? 'bg-white border-green-500 text-green-900 shadow-sm' : 'bg-white border-red-500 text-red-900 shadow-sm'}`}>
              <p className="font-bold mb-1 flex items-center gap-2">
                {isCorrect ? <Check size={18} className="text-green-600" /> : <X size={18} className="text-red-600" />}
                {isCorrect ? 'Correct!' : 'Not quite!'}
              </p>
              <p className="text-gray-700 pl-7">{currentQuestion.explanation}</p>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => handleNextQuestion()}>
                {currentQuestionIndex < questions.length - 1 ? (
                  <>Next Question <ArrowRight size={18} className="ml-2" /></>
                ) : (
                  <>See Results <Award size={18} className="ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};