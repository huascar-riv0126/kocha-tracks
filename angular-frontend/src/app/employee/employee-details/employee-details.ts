import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EmployeeData } from '../employee-data';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [AsyncPipe],
  selector: 'app-employee-details',
  styleUrl: './employee-details.css',
  templateUrl: './employee-details.html',
})
export class EmployeeDetails {
  private readonly service = inject(EmployeeData);
  private readonly router = inject(Router);
  private readonly urlParams = inject(ActivatedRoute);

  public readonly id = this.urlParams.snapshot.params['id'];
  public readonly employee$ = this.service.getById(this.id);

  goToList() {
    this.router.navigate(["/employees"]);
  }
}
