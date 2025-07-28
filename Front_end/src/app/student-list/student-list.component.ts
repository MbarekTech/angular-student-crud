import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  currentPage = 1; 
  itemsPerPage = 10; 
  totalStudents = 0; 
  totalPages = 1; 
  searchQuery: string = ''; 
  sortColumn: string = ''; 
  sortDirection: 'asc' | 'desc' = 'asc'; 
  allStudents: any[] = []; 

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'tel', label: 'Téléphone' },
    { key: 'date_naissance', label: 'Date de Naissance' },
    { key: 'filiere', label: 'Filière' }
  ];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadAllStudents();
  }

  loadAllStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students: any) => {
        this.allStudents = students;
        this.totalStudents = students.length;
        this.totalPages = Math.ceil(this.totalStudents / this.itemsPerPage);
        this.loadStudents();
      },
      error: (error) => {
        console.error('Error fetching all students:', error);
        this.studentService.showSnackbar('Erreur lors de la récupération de tous les étudiants', 'error');
      }
    });
  }

  loadStudents(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.students = this.allStudents.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStudents();
  }

  deleteStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.loadAllStudents();
        this.studentService.showSnackbar('Étudiant supprimé avec succès', 'success');
      },
      error: () => {
        this.studentService.showSnackbar('Erreur lors de la suppression de l\'étudiant', 'error');
      }
    });
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.students = this.allStudents.filter((student) =>
        student.nom.toLowerCase().includes(query) ||
        student.prenom.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.tel.toLowerCase().includes(query)
      );
      this.totalStudents = this.students.length;
      this.totalPages = Math.ceil(this.totalStudents / this.itemsPerPage);
    } else {
      this.loadStudents();
    }
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.allStudents.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    this.loadStudents();
  }
}