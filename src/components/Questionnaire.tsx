import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionOption {
  label: string;
  value: string;
  image?: string;
  score?: number;
  type?: 'drag-segment' | 'time-block';
}

interface Question {
  id: string;
  text: string;
  type: 'radio' | 'slider' | 'drag' | 'checkbox';
  options: QuestionOption[];
  clinicalMapping?: string;
}

// 母亲问卷完整问题定义（含所有选项和临床映射）
const motherQuestions: Question[] = [
  {
    id: 'emotional-mapping',
    text: "When your baby first grasped your finger, which sunlight scenario best reflects how you hoped to feel?",
    type: 'radio',
    clinicalMapping: 'EPDS Q1 (Joyfulness)',
    options: [
      { 
        label: "🌻 Golden Sunflower Field (Vivid, Energetic)", 
        value: "sunflower", 
        score: 3 
      },
      { 
        label: "🌫️ Misty Dawn Glow (Soft, Calm)", 
        value: "misty", 
        score: 2 
      },
      { 
        label: "💡 Warm Nightlight Halo (Cozy, Quiet)", 
        value: "nightlight", 
        score: 1 
      }
    ]
  },
  {
    id: 'time-allocation',
    text: "Drag to divide the 24-hour felt clock into three segments (past 7 days):",
    type: 'drag',
    clinicalMapping: 'PHQ-9 Q4 (Energy Drain)',
    options: [
      { label: "💤 Sleep", value: "sleep", type: 'drag-segment' },
      { label: "👶 Infant Care", value: "care", type: 'drag-segment' },
      { label: "🌸 Me Time", value: "me", type: 'drag-segment' }
    ]
  },
  {
    id: 'support-system',
    text: "Which felt nest best represents your support network in the past week?",
    type: 'radio',
    clinicalMapping: 'EPDS Q8 (Social Support)',
    options: [
      { 
        label: "👨👩👧👦 Family Embrace (Immediate family support)", 
        value: "family", 
        score: 0 
      },
      { 
        label: "🤝 Partner Haven (Spouse/partner support)", 
        value: "partner", 
        score: 0 
      },
      { 
        label: "🌱 Community Garden (Friends/community support)", 
        value: "community", 
        score: 1 
      }
    ]
  },
  {
    id: 'mood-intensity',
    text: "Slide to show today's emotional fluctuations (0% = calm, 100% = intense):",
    type: 'slider',
    clinicalMapping: 'HAMD Mood Dimension (Reference Only)',
    options: [] 
  },
  {
    id: 'body-awareness',
    text: "Which area needs comfort most due to recent discomfort?",
    type: 'radio',
    clinicalMapping: 'PHQ-9 Somatic Symptoms',
    options: [
      { 
        label: "🦴 Soothing Back (Aches/pains)", 
        value: "back", 
        score: 1 
      },
      { 
        label: "🌀 Gentle Head Massage (Headaches/fatigue)", 
        value: "head", 
        score: 1 
      },
      { 
        label: "😴 Full-body Cocoon (Overall exhaustion)", 
        value: "full-body", 
        score: 2 
      }
    ]
  },
  {
    id: 'future-vision',
    text: "Select felt stickers for your 3-month goals (multiple choices allowed):",
    type: 'checkbox',
    clinicalMapping: 'Hope Scale (Goal Orientation)',
    options: [
      { 
        label: "👗 Dress (Resume personal style)", 
        value: "dress", 
        score: 1 
      },
      { 
        label: "🏖️ Beach (Short family trip)", 
        value: "beach", 
        score: 1 
      },
      { 
        label: "📚 Book (Read daily)", 
        value: "book", 
        score: 1 
      },
      { 
        label: "🎨 Palette (New Hobby)", 
        value: "palette", 
        score: 1 
      }
    ]
  }
];

// 伴侣问卷完整问题定义
const partnerQuestions: Question[] = [
  {
    id: 'stress-visualization',
    text: "Your recent stress feels most like which weather?",
    type: 'radio',
    clinicalMapping: 'PC-PTSD Stress Severity Index',
    options: [
      { 
        label: "🌦️ Drizzling Clouds (Manageable stress)", 
        value: "drizzle", 
        score: 1 
      },
      { 
        label: "⛈️ Gathering Storm (Overwhelming stress)", 
        value: "storm", 
        score: 3 
      },
      { 
        label: "🌞 Clear Sky (Little stress)", 
        value: "clear", 
        score: 2 
      }
    ]
  },
  {
    id: 'support-role',
    text: "What felt tool best describes your support style?",
    type: 'radio',
    clinicalMapping: 'EPDS Partner Support Subscale',
    options: [
      { 
        label: "🧰 Steady Ladder (Practical help: diapering, night shifts)", 
        value: "ladder", 
        score: 2 
      },
      { 
        label: "🫂 Comfort Pillow (Emotional support: listening, validation)", 
        value: "pillow", 
        score: 3 
      },
      { 
        label: "📱 Smart Assistant (Flexible help: on-demand tasks)", 
        value: "assistant", 
        score: 1 
      }
    ]
  },
  {
    id: 'time-commitment',
    text: "Drag blocks to allocate daily support time (morning/noon/evening):",
    type: 'drag',
    clinicalMapping: 'Parenting Participation Scale',
    options: [
      { label: "🕗 Morning Help (6–9 AM)", value: "morning", type: 'time-block' },
      { label: "🕛 Noon Check-in (12–3 PM)", value: "noon", type: 'time-block' },
      { label: "🕣 Evening Care (6–12 PM)", value: "evening", type: 'time-block' }
    ]
  },
  {
    id: 'communication-frequency',
    text: "How often do you check in with your partner about their feelings?",
    type: 'radio',
    clinicalMapping: 'Communication Frequency Scale',
    options: [
      { label: "Daily", value: "daily", score: 3 },
      { label: "Weekly", value: "weekly", score: 2 },
      { label: "Rarely", value: "rarely", score: 1 }
    ]
  },
  {
    id: 'self-care',
    text: "Select activities you've done for yourself in the past week:",
    type: 'checkbox',
    clinicalMapping: 'Self-Care Inventory',
    options: [
      { label: "Exercise", value: "exercise" },
      { label: "Socializing", value: "social" },
      { label: "Hobbies", value: "hobbies" },
      { label: "Alone time", value: "alone" }
    ]
  },
  {
    id: 'confidence-level',
    text: "Rate your confidence in parenting (0-100%):",
    type: 'slider',
    clinicalMapping: 'Parenting Confidence Scale',
    options: []
  }
];

interface QuestionnaireProps {
  type: 'mother' | 'partner';
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ type }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, QuestionOption[]>>({});
  const [dragValues, setDragValues] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  const questions = type === 'mother' ? motherQuestions : partnerQuestions;

  const handleAnswer = (questionId: string, answer: QuestionOption) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      // 对于单选题，替换之前的答案
      if (questions.find(q => q.id === questionId)?.type === 'radio') {
        return {
          ...prev,
          [questionId]: [answer]
        };
      }
      // 对于其他类型，添加到现有答案
      return {
        ...prev,
        [questionId]: [...current, answer]
      };
    });

    // 自动进入下一题（单选/滑动条场景）
    if (questions[currentQuestion].type === 'radio' || questions[currentQuestion].type === 'slider') {
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(cq => cq + 1);
        }, 1500); // 增加延迟到1.5秒，让用户有足够时间看到选择效果
      }
    }
  };

  const handleCheckbox = (questionId: string, option: QuestionOption) => {
    setAnswers((prev: Record<string, QuestionOption[]>) => {
      const current = prev[questionId] || [];
      const exists = current.some((a: QuestionOption) => a.value === option.value);
      return {
        ...prev,
        [questionId]: exists 
          ? current.filter((a: QuestionOption) => a.value !== option.value)
          : [...current, option]
      };
    });
  };

  const handleDragChange = (segment: string, value: number) => {
    setDragValues(prev => {
      // 找出当前选项所属的问题
      let currentQuestion = null;
      for (const q of questions) {
        if (q.type === 'drag' && q.options.some(opt => opt.value === segment)) {
          currentQuestion = q;
          break;
        }
      }
      
      if (!currentQuestion) return { ...prev, [segment]: value };
      
      // 获取同一问题的所有选项
      const relatedSegments = currentQuestion.options.map(opt => opt.value);
      
      // 计算新的总和
      const newValues = { ...prev, [segment]: value };
      const total = relatedSegments.reduce((sum, seg) => sum + (newValues[seg] || 0), 0);
      
      // 如果总和超过100%，按比例调整其他值
      if (total > 100) {
        const excess = total - 100;
        const otherSegments = relatedSegments.filter(seg => seg !== segment);
        const otherTotal = otherSegments.reduce((sum, seg) => sum + (prev[seg] || 0), 0);
        
        if (otherTotal > 0) {
          otherSegments.forEach(seg => {
            const currentVal = prev[seg] || 0;
            const reduction = Math.min(currentVal, (currentVal / otherTotal) * excess);
            newValues[seg] = Math.max(0, Math.round(currentVal - reduction));
          });
        } else {
          // 如果其他值都是0，则限制当前值为100
          newValues[segment] = 100;
        }
      }
      
      return newValues;
    });
  };

  // 添加一个新函数，用于检查拖拽题是否完成
  const isDragQuestionComplete = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || question.type !== 'drag') return false;
    
    // 检查是否所有选项都有值
    const optionValues = question.options.map(opt => dragValues[opt.value] || 0);
    const total = optionValues.reduce((sum, val) => sum + val, 0);
    
    // 如果总和接近100%，认为完成了
    return total >= 95;
  };

  const handleSubmit = () => {
    console.log('Answers:', answers);
    console.log('Drag Values:', dragValues);
    setCompleted(true);
    // 这里可以添加API调用或其他提交逻辑
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(cq => cq + 1);
    }
  };

  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case 'radio':
        return (
          <div className="radio-options">
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
          <div className="checkbox-options">
            {question.options.map(option => (
              <label 
                key={option.value} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  margin: '1rem 0',
                  padding: '0.75rem',
                  backgroundColor: answers[question.id]?.some(a => a.value === option.value) 
                    ? '#F5F5DC' 
                    : 'transparent',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={answers[question.id]?.some(a => a.value === option.value) || false}
                  onChange={() => handleCheckbox(question.id, option)}
                  style={{
                    marginRight: '1rem',
                    width: '20px',
                    height: '20px'
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'slider':
        return (
          <div className="slider-container" style={{ width: '100%', padding: '1rem 0' }}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="1"
              value={dragValues[question.id] !== undefined ? dragValues[question.id] : 50}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setDragValues(prev => ({
                  ...prev,
                  [question.id]: value
                }));
              }}
              style={{ 
                width: '100%',
                height: '8px',
                appearance: 'none',
                background: 'linear-gradient(to right, #E0E0E0, #2E8B57)',
                outline: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem' }}>0% (Calm)</span>
              <span style={{ fontSize: '0.8rem' }}>100% (Intense)</span>
            </div>
            <div style={{ 
              textAlign: 'center', 
              margin: '1rem 0', 
              fontSize: '1.2rem', 
              fontWeight: 'bold' 
            }}>
              <span>{dragValues[question.id] !== undefined ? dragValues[question.id] : 50}%</span>
            </div>
            <button
              onClick={() => handleAnswer(question.id, { 
                label: (dragValues[question.id] !== undefined ? dragValues[question.id] : 50).toString(), 
                value: (dragValues[question.id] !== undefined ? dragValues[question.id] : 50).toString() 
              })}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: type === 'mother' ? '#E67300' : '#2E8B57',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginTop: '1rem',
                width: '100%',
                fontWeight: 'bold'
              }}
            >
              Confirm
            </button>
          </div>
        );
      
      case 'drag':
        // 计算当前问题的所有选项总和
        const dragTotal = question.options.reduce(
          (sum, opt) => sum + (dragValues[opt.value] || 0), 
          0
        );
        
        return (
          <div className="drag-container" style={{ width: '100%' }}>
            {question.options.map(option => (
              <div key={option.value} className="drag-segment" style={{ marginBottom: '1rem' }}>
                <label style={{ marginBottom: '0.5rem', display: 'block' }}>{option.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="1"
                    value={dragValues[option.value] || 0}
                    onChange={(e) => handleDragChange(option.value, parseInt(e.target.value))}
                    style={{ 
                      flex: 1,
                      height: '8px',
                      appearance: 'none',
                      background: 'linear-gradient(to right, #E0E0E0, #2E8B57)',
                      outline: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    marginLeft: '1rem', 
                    minWidth: '40px', 
                    fontWeight: 'bold' 
                  }}>
                    {dragValues[option.value] || 0}%
                  </span>
                </div>
              </div>
            ))}
            <div style={{ 
              marginTop: '1rem', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem',
              backgroundColor: dragTotal > 100 ? '#FFEBEE' : dragTotal === 100 ? '#E8F5E9' : '#FFF8E1',
              borderRadius: '0.5rem'
            }}>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'bold',
                color: dragTotal > 100 ? '#D32F2F' : dragTotal === 100 ? '#2E7D32' : '#F57C00'
              }}>
                Total: {dragTotal}%
              </span>
              <span style={{ 
                fontSize: '0.8rem',
                color: dragTotal > 100 ? '#D32F2F' : dragTotal === 100 ? '#2E7D32' : '#F57C00'
              }}>
                {dragTotal > 100 ? 'Please reduce to 100%' : 
                 dragTotal < 100 ? 'Aim for 100%' : 
                 'Perfect!'}
              </span>
            </div>
            
            {/* 添加确认按钮 */}
            <button
              onClick={() => {
                // 创建一个包含所有拖拽值的答案对象
                const dragAnswers = question.options.map(opt => ({
                  label: opt.label,
                  value: opt.value,
                  score: dragValues[opt.value] || 0
                }));
                
                // 为每个选项设置答案
                dragAnswers.forEach(answer => {
                  handleAnswer(question.id, answer);
                });
                
                // 自动进入下一题
                if (currentQuestion < questions.length - 1) {
                  setTimeout(() => {
                    setCurrentQuestion(cq => cq + 1);
                  }, 500);
                }
              }}
              disabled={dragTotal > 100}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: dragTotal > 100 ? '#CCCCCC' : (type === 'mother' ? '#E67300' : '#2E8B57'),
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: dragTotal > 100 ? 'not-allowed' : 'pointer',
                width: '100%',
                fontWeight: 'bold'
              }}
            >
              Confirm
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 245, 235, 0.9)',
          zIndex: 1000,
          padding: '2rem',
          boxSizing: 'border-box',
          overflow: 'auto'
        }}
      >
        <h2>Thank you for completing the questionnaire!</h2>
        <p>Your responses have been recorded.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 245, 235, 0.9)',
        zIndex: 1000,
        padding: '2rem',
        boxSizing: 'border-box',
        overflow: 'auto'
      }}
    >
      <div style={{ 
        maxWidth: '800px', 
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* 添加返回按钮 */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', width: '100%', justifyContent: 'space-between' }}>
          <div>
            {currentQuestion > 0 && (
              <button 
                onClick={() => setCurrentQuestion(cq => cq - 1)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#F5E9DC',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap', // 防止文本换行
                  minWidth: '100px' // 确保按钮有足够宽度
                }}
              >
                Previous
              </button>
            )}
          </div>
          <div>
            <button 
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#F5E9DC',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap', // 防止文本换行
                minWidth: '150px' // 确保按钮有足够宽度
              }}
            >
              {showAllQuestions ? 'Single Question Mode' : 'Preview All'}
            </button>
          </div>
        </div>
      
        <h2 style={{ 
          fontSize: '1.75rem',
          marginBottom: '1.5rem',
          color: type === 'mother' ? '#E67300' : '#2E8B57'
        }}>
          {type === 'mother' ? 'Maternal Wellness Assessment' : 'Partner Support Evaluation'}
        </h2>

        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#F5E9DC',
            borderRadius: '4px'
          }}>
            <div style={{ 
              width: `${(currentQuestion / (questions.length - 1)) * 100}%`, 
              height: '100%', 
              backgroundColor: type === 'mother' ? '#E67300' : '#2E8B57',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {showAllQuestions ? (
          // 显示所有问题
          <div style={{ 
            width: '100%', 
            maxHeight: '70vh', 
            overflowY: 'auto', 
            paddingRight: '1rem',
            marginBottom: '2rem'
          }}>
            {questions.map((question, index) => (
              <div key={question.id} style={{ 
                marginBottom: '2rem', 
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>{question.text}</h3>
                {renderQuestionContent(question)}
              </div>
            ))}
            <div style={{ height: '2rem' }}></div> {/* 添加底部空间 */}
          </div>
        ) : (
          // 只显示当前问题
          <div style={{ width: '100%' }}>
            <motion.div 
              key={questions[currentQuestion].id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ 
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ marginBottom: '1.5rem' }}>{questions[currentQuestion].text}</h3>
              {renderQuestionContent(questions[currentQuestion])}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Questionnaire;










