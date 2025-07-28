import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  student: any = { nom: '', prenom: '', email: '', tel: '', date_naissance: '', filiere: '' };
  isEditMode: boolean = false;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentService.getStudentById(+id).subscribe((data) => {
        this.student = data;
      });
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      if (this.isEditMode) {
        this.studentService.updateStudent(this.student.id, this.student).subscribe({
          next: () => {
            alert('Étudiant mis à jour avec succès !');
            this.router.navigate(['/students']);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
            alert('Erreur lors de la mise à jour de l\'étudiant.');
          },
        });
      } else {
        this.studentService.addStudent(this.student).subscribe({
          next: () => {
            alert('Étudiant ajouté avec succès !');
            this.router.navigate(['/students']);
          },
          error: (error) => {
            console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
            alert('Erreur lors de l\'ajout de l\'étudiant.');
          },
        });
      }
    }
  }

  validateForm(): boolean {
    const forms = document.querySelectorAll('.needs-validation');
    let isValid = true;

    Array.from(forms).forEach((form: any) => {
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        isValid = false;
      } else {
        form.classList.remove('was-validated');
      }
    });

    return isValid;
  }
}