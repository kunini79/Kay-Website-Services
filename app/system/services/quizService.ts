// EncartaKids Quiz Generation Service

import { Article } from '../types';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  articleTitle: string;
  questions: QuizQuestion[];
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

// Generate quiz questions from article using AI
export async function generateQuiz(article: Article): Promise<Quiz> {
  // Check if we have a Gemini API key
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    // Return sample questions if no API key
    return generateSampleQuiz(article);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on this educational article about "${article.title}", create 5 multiple-choice quiz questions suitable for children aged 8-14. 

Article Summary:
${article.intro}

${article.sections.map(s => `${s.subtitle}: ${s.content}`).join('\n\n')}

Fun Fact: ${article.funFact}

Please generate exactly 5 questions in this JSON format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

Make questions engaging, age-appropriate, and test understanding rather than just memorization. Mix easy, medium, and challenging questions.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        articleTitle: article.title,
        questions: parsed.questions,
        completed: false,
      };
    }
    
    throw new Error('Invalid quiz format');
  } catch (error) {
    console.error('Quiz generation error:', error);
    return generateSampleQuiz(article);
  }
}

// Generate sample quiz as fallback
function generateSampleQuiz(article: Article): Quiz {
  const questions: QuizQuestion[] = [
    {
      question: `What is the main topic of the article about "${article.title}"?`,
      options: [
        article.title,
        'Something completely different',
        'Unicorns and rainbows',
        'Time travel'
      ],
      correctAnswer: 0,
      explanation: `This article is all about ${article.title}!`
    },
    {
      question: 'Did you find the fun fact interesting?',
      options: [
        'Yes, very interesting!',
        'It was okay',
        'I want to learn more',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'All reactions to learning are valid! Keep being curious!'
    },
    {
      question: `Based on the article, what's a key thing you learned about ${article.title}?`,
      options: [
        'Many interesting facts',
        'Nothing at all',
        'How to fly',
        'Secret codes'
      ],
      correctAnswer: 0,
      explanation: 'Great job reading the article! There were many interesting facts to learn.'
    }
  ];

  return {
    articleTitle: article.title,
    questions,
    completed: false,
  };
}

// Save quiz result to localStorage
export function saveQuizResult(quiz: Quiz): void {
  if (typeof window === 'undefined') return;
  
  const quizzes = loadQuizHistory();
  const completedQuiz = {
    ...quiz,
    completed: true,
    completedAt: new Date(),
  };
  
  quizzes.push(completedQuiz);
  
  // Keep only last 50 quizzes
  if (quizzes.length > 50) {
    quizzes.splice(0, quizzes.length - 50);
  }
  
  localStorage.setItem('encartakids_quizzes', JSON.stringify(quizzes));
}

// Load quiz history
export function loadQuizHistory(): Quiz[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('encartakids_quizzes');
  if (stored) {
    const quizzes = JSON.parse(stored);
    return quizzes.map((q: Quiz) => ({
      ...q,
      completedAt: q.completedAt ? new Date(q.completedAt) : undefined,
    }));
  }
  return [];
}

// Get quiz statistics
export function getQuizStatistics() {
  const quizzes = loadQuizHistory();
  
  if (quizzes.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      perfectScores: 0,
      recentQuizzes: [],
    };
  }
  
  const totalScore = quizzes.reduce((sum, q) => sum + (q.score || 0), 0);
  const perfectScores = quizzes.filter(q => q.score === 100).length;
  const recentQuizzes = quizzes.slice(-5).reverse();
  
  return {
    totalQuizzes: quizzes.length,
    averageScore: Math.round(totalScore / quizzes.length),
    perfectScores,
    recentQuizzes,
  };
}
