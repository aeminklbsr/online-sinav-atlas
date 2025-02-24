import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionAnswerKey } from '../models/question-answer-key';

@Injectable({
  providedIn: 'root'
})
export class QuestionAnswerKeyService {
  private apiUrl = 'https://apievaluation.atlas.edu.tr/api/SoruCevapAnahtari';

  constructor(private http: HttpClient) {}

  addAnswerKey(answerKeyData: QuestionAnswerKey): Observable<{ data: QuestionAnswerKey }> {
    return this.http.post<{ data: QuestionAnswerKey }>(this.apiUrl, answerKeyData);
  }
  getAnswerKeyByQuestionId(soruId: string) {
    const url = `${this.apiUrl}/filter?soruId=${soruId}`;
    return this.http.get<{ data: QuestionAnswerKey[] }>(url);
  }
  updateAnswerKey(answerKeyData: QuestionAnswerKey): Observable<{ data: QuestionAnswerKey }> {
    return this.http.put<{ data: QuestionAnswerKey }>(this.apiUrl, answerKeyData);
  }
}