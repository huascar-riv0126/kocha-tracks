import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EmployeeData } from '../employee-data';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Employee } from '../employee';

@Component({
  imports: [FormsModule, AsyncPipe],
  selector: 'app-update-employee',
  styleUrl: './update-employee.css',
  templateUrl: './update-employee.html'
})
export class UpdateEmployee {
  private readonly service = inject(EmployeeData);
  private readonly router = inject(Router);
  private readonly urlParams = inject(ActivatedRoute);

  public readonly id = this.urlParams.snapshot.params['id'];
  public readonly employee$ = this.service.getById(this.id);

  updateEmployee(employee: Employee) {
    this.service.updateEmployee(employee.id, employee).subscribe({
      next: data => console.log(data),
      error: error => console.log(error),
      complete: () => this.router.navigate(['/employees']),
    });
  }

  onSubmit(employee: Employee) {
    this.updateEmployee(employee);
  }
}