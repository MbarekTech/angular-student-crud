import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode = false;
  studentId: number | null = null;

  // List of available Filières
  filieres: string[] = [
    'Informatique',
    'Mathématiques',
    'Physique',
    'Chimie',
    'Biologie'
  ];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.studentForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      date_naissance: ['', Validators.required],
      filiere: ['', Validators.required] // Filière is now a dropdown
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.studentId = +params['id'];
        this.loadStudent(this.studentId);
      }
    });
  }

  loadStudent(id: number): void {
    this.studentService.getStudent(id).subscribe({
      next: (student: any) => {
        this.studentForm.patchValue(student);
      },
      error: (error) => {
        console.error('Error fetching student:', error);
        this.studentService.showSnackbar('Erreur lors de la récupération de l\'étudiant');
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      return;
    }

    const studentData = this.studentForm.value;

    if (this.isEditMode && this.studentId) {
      this.studentService.updateStudent(this.studentId, studentData).subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.studentService.showSnackbar('Étudiant modifié avec succès');
        },
        error: () => {
          this.studentService.showSnackbar('Erreur lors de la modification de l\'étudiant');
        }
      });
    } else {
      this.studentService.addStudent(studentData).subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.studentService.showSnackbar('Étudiant ajouté avec succès');
        },
        error: () => {
          this.studentService.showSnackbar('Erreur lors de l\'ajout de l\'étudiant');
        }
      });
    }
  }
}