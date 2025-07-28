import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/etudiants';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  showSnackbar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  getStudents(page: number = 1, limit: number = 10): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        this.showSnackbar('Erreur lors de la récupération des étudiants', 'error');
        return throwError(() => error);
      })
    );
  }

  getStudent(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        this.showSnackbar('Erreur lors de la récupération de l\'étudiant', 'error');
        return throwError(() => error);
      })
    );
  }

  addStudent(student: any): Observable<any> {
    return this.http.post(this.apiUrl, student).pipe(
      catchError((error) => {
        this.showSnackbar('Erreur lors de l\'ajout de l\'étudiant', 'error');
        return throwError(() => error);
      })
    );
  }

  updateStudent(id: number, student: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, student).pipe(
      catchError((error) => {
        this.showSnackbar('Erreur lors de la modification de l\'étudiant', 'error');
        return throwError(() => error);
      })
    );
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.showSnackbar('Erreur lors de la suppression de l\'étudiant', 'error');
        return throwError(() => error);
      })
    );
  }

  searchStudents(query: string): Observable<any> {
    const url = `${this.apiUrl}/search?q=${query}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        this.showSnackbar('Erreur lors de la recherche des étudiants', 'error');
        return throwError(() => error);
      })
    );
  }

  getAllStudents(): Observable<any> {
    const url = `${this.apiUrl}/all`;
    return this.http.get(url).pipe(
      catchError((error) => {
        this.showSnackbar('Erreur lors de la récupération de tous les étudiants', 'error');
        return throwError(() => error);
      })
    );
  }
}