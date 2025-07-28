import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css'],
})
export class EditStudentComponent implements OnInit {
  student: any = { nom: '', prenom: '', email: '', tel: '', date_naissance: '', filiere: '' };
  isEditMode: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentService.getStudentById(+id).subscribe((data) => {
        this.student = data;
      });
    }
  }

  onSubmit() {
    if (this.validateForm()) {
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