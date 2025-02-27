export interface ExamTask {
    id?: string;
    createdBy?: string;
    modifiedBy?: string;
    deletedBy?: string;
    createdDate?: string;
    modifiedDate?: string;
    isDeleted: boolean,
    soruBankasiId: string,
    soruTaslakAdi: string,
    aciklama: string
}
