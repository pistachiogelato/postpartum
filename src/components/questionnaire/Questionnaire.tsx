import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useFamilyCode } from '../../contexts/FamilyCodeContext';
import { useUser } from '../../contexts/UserContext';
import styles from '../../styles/Questionnaire.module.css';
import { motherQuestions } from './MotherQuestions';
import { partnerQuestions } from './PartnerQuestions';
import { 
  useQuestionnaireLogic,
  isAllQuestionsAnswered 
} from './QuestionnaireLogic';
import { Question, QuestionOption } from './QuestionTypes';

/**
 * 问卷组件属性
 */
interface QuestionnaireProps {
  type: 'mother' | 'partner';
  stage: 'name' | 'type' | 'mainMenu' | 'questionnaire';
  setStage: React.Dispatch<React.SetStateAction<'name' | 'type' | 'mainMenu' | 'questionnaire'>>;
}

/**
 * 问卷组件
 * 处理问卷的显示和用户交互
 */
const Questionnaire: React.FC<QuestionnaireProps> = ({ type, stage, setStage }) => {
  const router = useRouter();
  
  // 使用问卷逻辑钩子
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
    handleSliderChange,
    togglePreviewAll,
    handleDragChange,
    handleSubmit,
    handleNextQuestion,
    setError,
    setCompleted,  // 现在已经从钩子中导出
    setDragValues, // 现在已经从钩子中导出
    setAnswers,    // 现在已经从钩子中导出
    setCurrentQuestion, // 现在已经从钩子中导出
    setShowAllQuestions, // 现在已经从钩子中导出
    isDragQuestionComplete,
    isAllQuestionsAnswered: checkAllAnswered
  } = useQuestionnaireLogic(type);
  
  // 家庭码相关状态
  const [showFamilyCodeSetup, setShowFamilyCodeSetup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [tempFamilyCode, setTempFamilyCode] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationPassword, setVerificationPassword] = useState('');

  // 上下文状态
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

  /**
   * 处理登录按钮点击
   * 验证用户输入并执行登录
   */
  const handleLoginClick = useCallback(() => {
    // 步骤1: 验证用户输入
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
    
    // 步骤2: 记录登录尝试（用于调试）
    console.log('Login attempt:', { userType, familyCode, password });
    
    // 步骤3: 这里应该添加实际的登录验证逻辑
    // TODO: 添加与后端API的验证
    
    // 步骤4: 登录成功后的处理
    setShowLogin(false);
    
    // 步骤5: 显示成功提示
    alert('Login successful!');
    
    // 步骤6: 跳转到主菜单
    router.push('/mainmenu');
  }, [userType, familyCode, password, router, setError]);

  /**
   * 处理家庭码设置提交
   * 保存家庭码和相关安全信息
   */
  const handleFamilyCodeSetupSubmit = useCallback(() => {
    // 验证输入
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
  }, [tempFamilyCode, password, securityQuestion, securityAnswer, setFamilyCode, setContextPassword, setContextSecurityQuestion, setContextSecurityAnswer, setError, setCompleted]);

  /**
   * 处理问卷提交
   * 检查所有问题是否已回答，如果已回答则根据用户类型执行不同操作
   */
  const handleQuestionnaireSubmit = useCallback(() => {
    // 检查所有问题是否已回答
    if (!checkAllAnswered()) {
      setError('Please answer all questions before submitting.');
      return;
    }
    
    if (type === 'mother') {
      // 母亲角色：生成新的家庭码并跳转到设置页面
      const newFamilyCode = generateFamilyCode();
      setTempFamilyCode(newFamilyCode);
      router.push(`/family-code-setup?code=${newFamilyCode}`);
    } else {
      // 伴侣角色：跳转到登录页面
      router.push('/login');
    }
    
    setError('');
  }, [checkAllAnswered, generateFamilyCode, setError, router, type]);

  /**
   * 渲染问题内容
   * 根据问题类型渲染不同的UI组件
   * @param question 问题对象
   */
  const renderQuestionContent = useCallback((question: Question) => {
    switch (question.type) {
      case 'radio':
        // 单选题
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
            
            {/* 显示完成状态 */}
            {answers[question.id]?.length > 0 && (
              <div style={{
                marginTop: '1rem',
                padding: '0.5rem',
                backgroundColor: '#E6F7E6',
                borderRadius: '4px',
                textAlign: 'right'
              }}>
                ✓ Response recorded
              </div>
            )}
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
              onChange={(e) => {
                setDragValues({
                  ...dragValues,
                  [question.id]: parseInt(e.target.value)
                });
                // 同时更新answers对象
                setAnswers({
                  ...answers,
                  [question.id]: [{label: `${parseInt(e.target.value)}%`, value: String(parseInt(e.target.value))}]
                });
              }}
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
  }, [answers, dragValues, handleAnswer, handleCheckbox, handleDragChange, setAnswers, setDragValues]);  // 确保依赖数组正确

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.questionnaire}>
        {error && (
          <div style={{ 
            color: 'red', 
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#FFF0F0',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
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
                    onClick={handleQuestionnaireSubmit} // 修改这里，使用新的处理函数
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

      {showFamilyCodeSetup && renderFamilyCodeSetup()}
    </motion.div>
  );
};

export default Questionnaire;




