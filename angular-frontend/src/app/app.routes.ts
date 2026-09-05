import { Routes } from '@angular/router';
import { EmployeeList } from './employee/employee-list/employee-list';
import { CreateEmployee } from './employee/create-employee/create-employee';
import { UpdateEmployee } from './employee/update-employee/update-employee';
import { EmployeeDetails } from './employee/employee-details/employee-details';
import { Hero } from './hero/hero'; 

export const routes: Routes = [
    { path: '', component: Hero }, 
    { path: 'employees', component: EmployeeList },
    { path: 'create-employee', component: CreateEmployee },
    { path: 'update-employee/:id', component: UpdateEmployee },
    { path: 'employee-details/:id', component: EmployeeDetails}
];