import { Component, inject } from '@angular/core';
import { Employee } from '../employee';
import { FormsModule } from '@angular/forms';
import { EmployeeData } from '../employee-data';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-create-employee',
  styleUrl: './create-employee.css',
  templateUrl: './create-employee.html',
})
export class CreateEmployee {
  public employee = new Employee;
  private readonly service = inject(EmployeeData);
  private readonly router = inject(Router);

  saveForm() {
    this.service.createEmployee(this.employee).subscribe({
      next: data => console.log(data),
      error: error => console.log(error),
      complete: () => this.router.navigate(['/employees']),
      });
  }

  onSubmit() {
    this.saveForm();
    console.log(this.employee);
  }
}
