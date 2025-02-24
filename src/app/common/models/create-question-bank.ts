export interface CreateQuestionBank {
    id?: string;
    dersAdi: string;
    dersKodu: string;
    dersSezonu: string;
    dersDonemi: string;
    konuBasligi: string;
    kategori: number;
    kullaniciId: string;
    kullaniciAdi: string;
    createdBy: string;
    modifiedBy: string;
    deletedBy: string;
    createdDate: string;
    modifiedDate: string;
    deletedDate: string | null;
    isDeleted: boolean;
  }