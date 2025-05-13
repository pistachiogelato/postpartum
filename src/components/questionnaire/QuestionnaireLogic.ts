import { useState, useCallback } from 'react';
import { Question, QuestionOption, UserType } from './QuestionTypes';
import { motherQuestions } from './MotherQuestions';
import { partnerQuestions } from './PartnerQuestions';
import { useFamilyCode } from '../../contexts/FamilyCodeContext';
import { useUser } from '../../contexts/UserContext';

/**
 * 问卷逻辑钩子函数
 * 处理问卷的状态管理和交互逻辑
 * @param type 用户类型（母亲或伴侣）
 */
export const useQuestionnaireLogic = (type: UserType) => {
  // 基础状态
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, QuestionOption[]>>({});
  const [dragValues, setDragValues] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  // 上下文状态
  const { userType, setUserType } = useUser();
  const { familyCode } = useFamilyCode();

  // 根据用户类型选择问题集
  const questions = type === 'mother' ? motherQuestions : partnerQuestions;

  /**
   * 处理单选题和其他非特殊类型题目的回答
   * @param questionId 问题ID
   * @param answer 选择的答案
   */
  const handleAnswer = useCallback((questionId: string, answer: QuestionOption) => {
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
  }, [questions]);

  /**
   * 处理复选框题目的回答
   * @param questionId 问题ID
   * @param answer 选择的答案
   */
  const handleCheckbox = useCallback((questionId: string, answer: QuestionOption) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      const exists = current.some(a => a.value === answer.value);
      
      // 如果已存在，则移除；否则添加
      if (exists) {
        return {
          ...prev,
          [questionId]: current.filter(a => a.value !== answer.value)
        };
      } else {
        return {
          ...prev,
          [questionId]: [...current, answer]
        };
      }
    });
  }, []);

  /**
   * 切换预览模式（单题/全部题目）
   */
  const togglePreviewAll = useCallback(() => {
    setShowAllQuestions(prev => !prev);
  }, []);

  /**
   * 检查拖拽题是否完成
   * @param questionId 问题ID
   * @returns 是否完成
   */
  const isDragQuestionComplete = useCallback((questionId: string): boolean => {
    const question = questions.find((q: Question) => q.id === questionId);
    if (!question || question.type !== 'drag') return false;
    
    const segments = question.options.map((opt: QuestionOption) => opt.value);
    const total = segments.reduce((sum: number, seg: string) => sum + (dragValues[seg] || 0), 0);
    
    // 放宽条件：只要总和在90-110之间就认为完成了
    return total >= 50 && total <= 100;
  }, [questions, dragValues]);

  /**
   * 处理拖拽题的值变化
   * @param segment 拖拽选项的值
   * @param value 新的百分比值
   */
  const handleDragChange = useCallback((segment: string, value: number) => {
    setDragValues(prev => {
      // 找到包含该segment的问题
      const currentQuestion = questions.find(q => 
        q.type === 'drag' && q.options.some(opt => opt.value === segment)
      );
      
      if (!currentQuestion) return { ...prev, [segment]: value };
      
      const relatedSegments = currentQuestion.options.map(opt => opt.value);
      const newValues = { ...prev, [segment]: value };
      const total = relatedSegments.reduce((sum: number, seg: string) => sum + (newValues[seg] || 0), 0);
      
      // 自动调整其他选项，使总和不超过100%
      if (total > 100) {
        const excess = total - 100;
        const otherSegments = relatedSegments.filter(seg => seg !== segment);
        const otherTotal = otherSegments.reduce((sum: number, seg: string) => sum + (prev[seg] || 0), 0);
        
        if (otherTotal > 0) {
          // 按比例减少其他选项
          otherSegments.forEach(seg => {
            const currentVal = prev[seg] || 0;
            const reduction = Math.min(currentVal, (currentVal / otherTotal) * excess);
            newValues[seg] = Math.max(0, Math.round(currentVal - reduction));
          });
        } else {
          // 如果其他选项都是0，则将当前选项设为100
          newValues[segment] = 100;
        }
      }
      
      return newValues;
    });
    
    // 自动更新answers对象，确保题目被标记为已回答
    const questionId = questions.find(q => 
      q.type === 'drag' && q.options.some(opt => opt.value === segment)
    )?.id;
    
    if (questionId) {
      setAnswers(prev => {
        const newAnswers = {...prev};
        if(!newAnswers[questionId]) newAnswers[questionId] = [];
        newAnswers[questionId] = [{label: `${value}%`, value: String(value)}];
        return newAnswers;
      });
    }
  }, [questions, dragValues, setDragValues, setAnswers]);

  /**
   * 处理滑块题的值变化
   * @param questionId 问题ID
   * @param value 滑块的值
   */
  const handleSliderChange = useCallback((questionId: string, value: number) => {
    // 更新dragValues状态
    setDragValues(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // 同时更新answers状态，确保题目被标记为已回答
    setAnswers(prev => {
      return {
        ...prev,
        [questionId]: [{
          label: `${value}%`,
          value: String(value)
        }]
      };
    });
  }, []);

  /**
   * 处理下一题按钮点击
   * 检查当前题目是否已回答，如果已回答则前进到下一题
   */
  const handleNextQuestion = useCallback(() => {
    // 检查当前问题是否已回答
    const currentQ = questions[currentQuestion];
    let isAnswered = false;
    let errorMessage = '';
    
    // 根据题目类型检查是否已回答
    if (currentQ.type === 'drag') {
      isAnswered = isDragQuestionComplete(currentQ.id);
      if (!isAnswered) {
        const total = currentQ.options.reduce(
          (sum: number, opt: QuestionOption) => sum + (dragValues[opt.value] || 0), 
          0
        );
        errorMessage = `Please allocate percentages to add up to approximately 100% (current: ${total}%)`;
      }
    } else if (currentQ.type === 'slider') {
      // 滑块题只要有值就算完成
      isAnswered = dragValues[currentQ.id] !== undefined;
      if (!isAnswered) {
        errorMessage = 'Please move the slider to select a value';
      }
    } else if (currentQ.type === 'checkbox') {
      isAnswered = answers[currentQ.id]?.length > 0;
      if (!isAnswered) {
        errorMessage = 'Please select at least one option';
      }
    } else {
      isAnswered = answers[currentQ.id]?.length > 0;
      if (!isAnswered) {
        errorMessage = 'Please select an option before proceeding';
      }
    }
    
    // 如果未回答，显示错误信息
    if (!isAnswered) {
      setError(errorMessage);
      return;
    }
    
    // 如果已回答且不是最后一题，前进到下一题
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((cq: number) => cq + 1);
      setError('');
    }
  }, [currentQuestion, questions, answers, dragValues, isDragQuestionComplete]);

  /**
   * 检查所有问题是否已回答
   * @returns 是否所有问题都已回答
   */
  const isAllQuestionsAnswered = useCallback(() => {
    return questions.every(question => {
      if (question.type === 'drag') {
        // 对于拖拽题，检查总和是否在90-110之间
        const optionValues = question.options.map(opt => dragValues[opt.value] || 0);
        const total = optionValues.reduce((sum, val) => sum + val, 0);
        return total >= 50 && total <= 100;
      } else if (question.type === 'slider') {
        // 对于滑块题，检查是否有值
        return dragValues[question.id] !== undefined;
      } else {
        // 对于其他类型，检查是否有答案
        return answers[question.id]?.length > 0;
      }
    });
  }, [questions, answers, dragValues]);

  /**
   * 处理提交按钮点击
   * 检查所有问题是否已回答，如果已回答则标记为已完成
   * @returns 是否提交成功
   */
  const handleSubmit = useCallback(() => {
    if (!isAllQuestionsAnswered()) {
      setError('Please answer all questions before submitting.');
      return false;
    }
    
    setCompleted(true);
    return true;
  }, [isAllQuestionsAnswered]);

  // 返回所有状态和处理函数，包括状态设置函数
  return {
    // 状态
    currentQuestion,
    showAllQuestions,
    answers,
    dragValues,
    completed,
    error,
    questions,
    
    // 处理函数
    handleAnswer,
    handleCheckbox,
    handleSliderChange,
    togglePreviewAll,
    handleDragChange,
    handleSubmit,
    handleNextQuestion,
    
    // 状态设置函数 - 添加这些导出
    setError,
    setCompleted,
    setDragValues,
    setAnswers,
    setCurrentQuestion,
    setShowAllQuestions,
    
    // 辅助函数
    isDragQuestionComplete,
    isAllQuestionsAnswered
  };
};

// 导出isAllQuestionsAnswered函数，供外部组件使用
export const isAllQuestionsAnswered = (
  questions: Question[], 
  answers: Record<string, QuestionOption[]>, 
  dragValues: Record<string, number>
) => {
  return questions.every(question => {
    if (question.type === 'drag') {
      // 对于拖拽题，检查总和是否在90-110之间
      const optionValues = question.options.map(opt => dragValues[opt.value] || 0);
      const total = optionValues.reduce((sum, val) => sum + val, 0);
      return total >= 50 && total <= 100;
    } else if (question.type === 'slider') {
      // 对于滑块题，检查是否有值
      return dragValues[question.id] !== undefined;
    } else {
      // 对于其他类型，检查是否有答案
      return answers[question.id]?.length > 0;
    }
  });
};


