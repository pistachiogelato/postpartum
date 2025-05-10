import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFamilyCode } from '../contexts/FamilyCodeContext';
import { useUser } from '../contexts/UserContext';
import styles from '../styles/Questionnaire.module.css';

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
  const [showFamilyCodeSetup, setShowFamilyCodeSetup] = useState(false);
  const [showFamilyCodeVerification, setShowFamilyCodeVerification] = useState(false);
  const [tempFamilyCode, setTempFamilyCode] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationPassword, setVerificationPassword] = useState('');
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  
    

    
    const { userType, setUserType } = useUser();
  
  const { 
    familyCode,
    setFamilyCode,
    generateFamilyCode,
    password: contextPassword, 
    setPassword: setContextPassword,
    securityQuestion: contextSecurityQuestion,
    setSecurityQuestion: setContextSecurityQuestion,
    securityAnswer: contextSecurityAnswer,
    setSecurityAnswer: setContextSecurityAnswer
  } = useFamilyCode();

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

  const togglePreviewAll = () => {
    setShowAllQuestions(prev => !prev);
    // 使用更可靠的滚动方法
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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
    
    if (type === 'mother') {
      // 母亲用户进入家庭码设置
      const code = generateFamilyCode();
      setTempFamilyCode(code);
      setShowFamilyCodeSetup(true);
      
      // 滚动到家庭码设置部分
      setTimeout(() => {
        const element = document.getElementById('family-code-setup');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // 伴侣用户进入家庭码验证
      setShowFamilyCodeVerification(true);
      
      // 滚动到家庭码验证部分
      setTimeout(() => {
        const element = document.getElementById('family-code-verification');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleFamilyCodeSetupSubmit = () => {
    if (!password) {
      setError('Please set a password');
      return;
    }
    if (!securityQuestion) {
      setError('Please set a security question');
      return;
    }
    if (!securityAnswer) {
      setError('Please provide an answer to your security question');
      return;
    }

    // 保存到上下文
    setFamilyCode(tempFamilyCode);
    setContextPassword(password);
    setContextSecurityQuestion(securityQuestion);
    setContextSecurityAnswer(securityAnswer);
    setCompleted(true);
    setShowFamilyCodeSetup(false);
    
    // 显示成功消息
    alert(`Your family code is: ${tempFamilyCode}\nPlease share this code with your partner.`);
  };

  const handleFamilyCodeVerification = () => {
    if (!verificationCode) {
      setError('Please enter the family code');
      return;
    }
    if (!verificationPassword) {
      setError('Please enter the password');
      return;
    }

    // 验证家庭码和密码
    if (verificationCode === familyCode && verificationPassword === contextPassword) {
      setCompleted(true);
      setShowFamilyCodeVerification(false);
      alert('Family code verified successfully!');
    } else {
      setError('Invalid family code or password');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(cq => cq + 1);
    }
  };

  // 修复登录表单提交问题
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!userType) {
      setError('Please select your role');
      return;
    }
    if (!familyCode) {
      setError('Family code is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    // 这里添加实际的登录验证逻辑
    console.log('Login attempt:', { userType, familyCode, password });
  };

  const handleLoginClick = useCallback(() => {
    if (!userType) {
      setError('请选择您的角色');
      return;
    }
    if (!familyCode) {
      setError('家庭码是必填项');
      return;
    }
    if (!contextPassword) {
      setError('密码是必填项');
      return;
    }
    
    // 这里添加实际的登录验证逻辑
    console.log('Login attempt:', { userType, familyCode, password: contextPassword });
    
    // 模拟登录成功
    setCompleted(true);
    setShowLogin(false);
    alert('登录成功!');
  }, [userType, familyCode, contextPassword]);

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
              value={dragValues[question.id] || 0}
              onChange={(e) => setDragValues({
                ...dragValues,
                [question.id]: parseInt(e.target.value)
              })}
              style={{ width: '100%' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '0.5rem' 
            }}>
              <span>0%</span>
              <span>{dragValues[question.id] || 0}%</span>
              <span>100%</span>
            </div>
          </div>
        );
      
      case 'drag':
        return (
          <div className={styles['drag-container']} style={{ padding: '1rem 0' }}>
            {question.options.map(option => (
              <div key={option.value} style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '1rem 0'
              }}>
                <span style={{ flex: '0 0 150px' }}>{option.label}</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={dragValues[option.value] || 0}
                  onChange={(e) => handleDragChange(option.value, parseInt(e.target.value))}
                  style={{ flex: '1', margin: '0 1rem' }}
                />
                <span style={{ 
                  flex: '0 0 50px', 
                  textAlign: 'right',
                  minWidth: '40px', 
                  fontWeight: 'bold' 
                }}>
                  {dragValues[option.value] || 0}%
                </span>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  // 渲染家庭码设置表单
  const renderFamilyCodeSetup = () => {
    return (
      <div id="family-code-setup" className="family-code-setup" style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Set Up Your Family Code</h3>
        <p style={{ marginBottom: '1rem' }}>Your family code is: <strong>{tempFamilyCode}</strong></p>
        <p style={{ marginBottom: '1.5rem' }}>Please set a password and security question to protect your family code.</p>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '0.5rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Security Question:</label>
          <input 
            type="text" 
            value={securityQuestion}
            onChange={(e) => setSecurityQuestion(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '0.5rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Answer:</label>
          <input 
            type="text" 
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '0.5rem'
            }}
          />
        </div>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <button 
          onClick={handleFamilyCodeSetupSubmit}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#E67300',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Save Family Code
        </button>
      </div>
    );
  };

  // 渲染家庭码验证表单
  const renderFamilyCodeVerification = () => {
    return (
      <div id="family-code-verification" className="family-code-verification" style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Verify Family Code</h3>
        <p style={{ marginBottom: '1.5rem' }}>Please enter the family code and password shared by your partner.</p>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Family Code:</label>
          <input 
            type="text" 
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '0.5rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input 
            type="password" 
            value={verificationPassword}
            onChange={(e) => setVerificationPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '0.5rem'
            }}
          />
        </div>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <button 
          onClick={handleFamilyCodeVerification}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#E67300',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Verify
        </button>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.questionnaire}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '2rem'
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
                  minWidth: '150px'
                }}
              >
                {showAllQuestions ? 'SingleQuestion' : 'Preview'}
              </button>
            </div>
            <div>
              <button 
                onClick={() => setShowLogin(true)}
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
                Login
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
            <div 
              style={{ 
                width: '100%', 
                height: 'calc(100vh - 200px)', // 适应窗口高度，减去顶部元素的高度
                overflowY: 'auto', 
                padding: '1.5rem',
                marginBottom: '2rem',
                backgroundColor: '#F5E9DC',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
              className={styles.previewContainer}
            >
              <div style={{ flex: '1 1 auto', overflowY: 'auto', marginBottom: '1rem' }}>
                {questions.map((question, index) => (
                  <div 
                    key={question.id} 
                    className={styles['question-item']} 
                    style={{ 
                      marginBottom: '1.5rem', 
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setCurrentQuestion(index);
                      setShowAllQuestions(false);
                    }}
                  >
                    <h3 style={{ 
                      marginBottom: '1rem', 
                      fontWeight: 'bold',
                      color: type === 'mother' ? '#E67300' : '#2E8B57' 
                    }}>
                      {index + 1}. {question.text}
                    </h3>
                    {renderQuestionContent(question)}
                  </div>
                ))}
              </div>
              
              <div style={{ 
                width: '100%', 
                padding: '1rem 0',
                position: 'sticky',
                bottom: 0,
                backgroundColor: '#F5E9DC'
              }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: type === 'mother' ? '#E67300' : '#2E8B57',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Submit All Answers
                </button>
              </div>
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
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '2rem'
              }}>
                <button
                  onClick={() => currentQuestion > 0 && setCurrentQuestion(cq => cq - 1)}
                  disabled={currentQuestion === 0}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: currentQuestion === 0 ? '#ccc' : '#f0f0f0',
                    color: currentQuestion === 0 ? '#999' : '#333',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: type === 'mother' ? '#E67300' : '#2E8B57',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: type === 'mother' ? '#E67300' : '#2E8B57',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 条件渲染：家庭码设置 / 验证 / 登录弹窗 */}
      {showFamilyCodeSetup && renderFamilyCodeSetup()}
      {showFamilyCodeVerification && renderFamilyCodeVerification()}
      {showLogin && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255,245,235,0.95)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Login with Family Code</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '.5rem' }}>Family Code:</label>
              <input 
                type="text" 
                value={familyCode}
                onChange={e => setFamilyCode(e.target.value)}
                style={{ width: '100%', padding: '.75rem', border: '1px solid #ddd', borderRadius: '.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '.5rem' }}>Password:</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '.75rem', border: '1px solid #ddd', borderRadius: '.5rem' }}
              />
            </div>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <button 
              onClick={handleLoginClick}
              style={{
                padding: '.75rem 1.5rem',
                backgroundColor: '#E67300',
                color: 'white',
                border: 'none',
                borderRadius: '.5rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Login
            </button>
            <button 
              onClick={() => { setShowLogin(false); setError(''); }}
              style={{
                marginTop: '1rem',
                padding: '.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#E67300',
                border: '1px solid #E67300',
                borderRadius: '.5rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Questionnaire;




