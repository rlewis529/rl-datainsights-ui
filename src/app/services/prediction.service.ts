import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prediction {
  id: string;
  description: string;
  probability: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:5000/predictions';

  constructor(private http: HttpClient) {}

  getPredictions(): Observable<Prediction[]> {
    return this.http.get<Prediction[]>(this.apiUrl);
  }
}

