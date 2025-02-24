export interface QuestionAnswerKey {
    id?: string;
    soruId: string;
    soruSecenekId: string;
    createdBy: string;
    modifiedBy: string;
    deletedBy: string;
    createdDate: string;
    modifiedDate: string;
    deletedDate: string | null;
    isDeleted: boolean;
  }