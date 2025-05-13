import React from 'react';
import { motion } from 'framer-motion';
import { Question, QuestionOption, UserType } from './QuestionTypes';
import { useQuestionnaireLogic } from './QuestionnaireLogic';
import styles from '../../styles/Questionnaire.module.css';

interface QuestionnaireUIProps {
  type: UserType;
  onComplete: (answers: Record<string, QuestionOption[]>) => void;
}

const QuestionnaireUI: React.FC<QuestionnaireUIProps> = ({ type, onComplete }) => {
  const {
    currentQuestion,
    showAllQuestions,
    answers,
    dragValues,
    completed,
    error,
    questions,
    handleAnswer,
    handleCheckbox,
    togglePreviewAll,
    handleDragChange,
    handleSubmit,
    handleNextQuestion,
    setError,
    isDragQuestionComplete
  } = useQuestionnaireLogic(type);

  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case 'radio':
        return (
          <div className={styles['radio-options']}>
            {question.options.map(option => (
              <label key={option.value} style={{ 
                display: 'block', 
                margin: '0.8rem 0',
                padding: '0.8rem',
                backgroundColor: answers[question.id]?.some(a => a.value === option.value) ? '#F5F5DC' : 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="radio" 
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id]?.some(a => a.value === option.value) || false}
                    onChange={() => handleAnswer(question.id, option)}
                    style={{ 
                      marginRight: '1rem',
                      width: '20px',
                      height: '20px'
                    }}
                  />
                  <span>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className={styles['checkbox-options']}>
            {question.options.map(option => (
              <label key={option.value} style={{ 
                display: 'block', 
                margin: '0.8rem 0',
                padding: '0.8rem',
                backgroundColor: answers[question.id]?.some(a => a.value === option.value) ? '#F5F5DC' : 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id]?.some(a => a.value === option.value) || false}
                    onChange={() => handleCheckbox(question.id, option)}
                    style={{ 
                      marginRight: '1rem',
                      width: '20px',
                      height: '20px'
                    }}
                  />
                  <span>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        );
      
      case 'slider':
        return (
          <div className={styles['slider-container']} style={{ padding: '1rem 0' }}>
            <input 
              type="range"
              min="0"
              max="100"
              value={dragValues[question.id] || 50}
              onChange={(e) => handleDragChange(
                question.id,
                question.id, 
                parseInt(e.target.value)
              )}
              style={{ width: '100%' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '0.5rem' 
            }}>
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        );
      
      case 'drag':
        return (
          <div className={styles['drag-container']} style={{ padding: '1rem 0' }}>
            {question.options.map((option: QuestionOption) => (
              <div key={option.value} style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span>{option.label}</span>
                  <span>{dragValues[option.value] || 0}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={dragValues[option.value] || 0}
                  onChange={(e) => handleDragChange(
                    question.id, 
                    option.value, 
                    parseInt(e.target.value)
                  )}
                  style={{ width: '100%' }}
                />
              </div>
            ))}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '1rem',
              padding: '0.5rem',
              backgroundColor: isDragQuestionComplete(question.id) ? '#E6F7E6' : '#FFF8E1',
              borderRadius: '4px'
            }}>
              <span>Total:</span>
              <span>
                {question.options.reduce((sum: number, opt: QuestionOption) => sum + (dragValues[opt.value] || 0), 0)}%
                {isDragQuestionComplete(question.id) 
                  ? ' ✓' 
                  : ' (aim for ~100%)'}
              </span>
            </div>
          </div>
        );
      
      default:
        return <div>Unsupported question type</div>;
    }
  };

  const handleFinalSubmit = () => {
    if (handleSubmit()) {
      onComplete(answers);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem'
      }}
    >
      <div className={styles.questionnaire}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <button 
              onClick={togglePreviewAll}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#F5E9DC',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minWidth: '100px'
              }}
            >
              {showAllQuestions ? 'Single Question' : 'Preview All'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

