import { Component, inject } from '@angular/core';
import { EmployeeData } from '../employee-data';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [AsyncPipe],
  selector: 'app-employee-list',
  styleUrl: './employee-list.css',
  templateUrl: './employee-list.html',
})
export class EmployeeList {
  private readonly service = inject(EmployeeData);
  private readonly router = inject(Router);

  public employees$ = this.service.getEmployeeList();

  public goToUpdate(id: number) {
    this.router.navigate(["/update-employee", id]);
  }

  public goToDetails(id: number) {
    this.router.navigate(["/employee-details", id]);
  }

  public deleteEmployee(id: number) {
    this.service.deleteEmployee(id).subscribe({
      next: data => {
        console.log(data);
        this.employees$ = this.service.getEmployeeList();
      },
      error: error => {
        console.error(error);
      }
    });
  }
}
