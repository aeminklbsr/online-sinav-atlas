import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExamTask } from '../models/exam-task';

@Injectable({
  providedIn: 'root'
})
export class ExamTaskService {
private apiUrl = 'https://apievaluation.atlas.edu.tr/api/SoruTaslakBaslik';

constructor(private http: HttpClient) { }
  
createExamTask(examTaskData: ExamTask): Observable<{ data: ExamTask }> {
  return this.http.post<{ data: ExamTask }>(this.apiUrl, examTaskData);
}
}
