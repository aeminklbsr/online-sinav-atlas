export interface QuestionOption {
    id?: string;
    soruId: string;
    secenekSirasi: number;
    secenekMetni: string;
    aktifMi: boolean;
    createdBy: string;
    modifiedBy: string;
    deletedBy: string;
    createdDate: string;
    modifiedDate: string;
    deletedDate: string | null;
    isDeleted: boolean;
  }