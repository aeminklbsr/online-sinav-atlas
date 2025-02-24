export interface Question {
    id: number;
    text: string;
    type: 'multiple' | 'essay';
    options?: string[];
    correctAnswer?: string;
    points: number;
  }