// 定义问卷相关的类型
export interface QuestionOption {
  label: string;
  value: string;
  image?: string;
  score?: number;
  type?: 'drag-segment' | 'time-block';
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'slider' | 'drag' | 'checkbox';
  options: QuestionOption[];
  clinicalMapping?: string;
}

export type UserType = 'mother' | 'partner';