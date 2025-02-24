import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionOption } from '../models/question-option';

@Injectable({
  providedIn: 'root'
})
export class QuestionOptionService {
  private apiUrl = 'https://apievaluation.atlas.edu.tr/api/SoruSecenek';

  constructor(private http: HttpClient) {}

  addQuestionOption(optionData: QuestionOption): Observable<{ data: QuestionOption }> {
    return this.http.post<{ data: QuestionOption }>(this.apiUrl, optionData);
  }

  getOptionsByQuestionId(soruId: string) {
    const url = `${this.apiUrl}/filter?soruId=${soruId}`;
    return this.http.get<{ data: QuestionOption[] }>(url);
  }
  updateQuestionOption(optionData: QuestionOption): Observable<{ data: QuestionOption }> {
    return this.http.put<{ data: QuestionOption }>(this.apiUrl, optionData);
  }

}