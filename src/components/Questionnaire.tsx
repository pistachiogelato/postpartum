import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Question {
  question: string;
  options: {
    label: string;
    value: string;
    score: number;
  }[];
}

interface QuestionnaireProps {
  type: 'mother' | 'partner';
}

const motherQuestions = [
  {
    question: "When your baby first grasps your finger, you wish the sunlight was more like:",
    options: [
      { label: "🌻 Golden Sunflower Field", value: "sunflower", score: 3 },
      { label: "🌫️ Morning Misty Haze", value: "misty", score: 2 },
      { label: "💡 Soft Night Lamp Glow", value: "nightlamp", score: 1 }
    ]
  },
  // Add other questions following similar structure
];

const partnerQuestions = [
  {
    question: "Recently, your stress feels more like:",
    options: [
      { label: "🌦️ Light Drizzle", value: "drizzle", score: 1 },
      { label: "⛈️ Thunderstorm", value: "thunderstorm", score: 3 },
      { label: "🌞 Clear Sky", value: "clearsky", score: 2 }
    ]
  },
  // Add other questions
];

const Questionnaire: React.FC<QuestionnaireProps> = ({ type }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Question['options'][0][][]>([]);

  const questions = type === 'mother' ? motherQuestions : partnerQuestions;

  const handleAnswer = (answer: Question['options'][0]) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = [answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate total score
      const totalScore = newAnswers.reduce((sum, answerArr) => {
        return sum + (answerArr?.[0]?.score || 0);
      }, 0);
      console.log('Questionnaire completed', { answers: newAnswers, totalScore });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: '#F5E6D3',
        padding: '2rem',
        borderRadius: '0.75rem'
      }}
    >
      <h2 style={{ 
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        color: type === 'mother' ? '#8B4513' : '#556B2F'
      }}>
        {type === 'mother' ? 'Mother\'s Questionnaire' : 'Partner\'s Questionnaire'}
      </h2>
      
      <motion.div
        key={currentQuestion}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          {questions[currentQuestion].question}
        </p>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onTap={() => handleAnswer(option)}
              style={{
                padding: '1rem',
                backgroundColor: '#FFB6B6',
                borderRadius: '0.5rem',
                textAlign: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Questionnaire;
