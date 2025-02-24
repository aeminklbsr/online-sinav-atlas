import { QuestionAnswerKey } from './question-answer-key';
import { QuestionOption } from './question-option';

export interface QuestionAdd {
  id?: string;
  soruBankasiId: string;
  soruMetni: string;
  puan: number;
  zorluk: number;
  soruTipi: number;
  aktifMi: boolean;
  dogruSecenek: number;
  createdBy: string;
  modifiedBy: string | null;  // Değiştirilen kullanıcı adı (null olabilir)
  deletedBy: string | null;  // Silinen kullanıcı adı (null olabilir)
  createdDate: string;
  modifiedDate: string | null;  // Değiştirilme tarihi (null olabilir)
  deletedDate: string | null;  // Silinme tarihi (null olabilir)
  isDeleted: boolean;
  cevapAnahtari?: QuestionAnswerKey;  // Bu opsiyonel bir alan, eğer yoksa null olabilir.
  secenekler?: QuestionOption[];  // Aynı şekilde, bu da opsiyonel bir alan.
}