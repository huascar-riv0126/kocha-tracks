import { Routes } from '@angular/router';
import { EmployeeList } from './employee/employee-list/employee-list';
import { CreateEmployee } from './employee/create-employee/create-employee';
import { UpdateEmployee } from './employee/update-employee/update-employee';
import { EmployeeDetails } from './employee/employee-details/employee-details';
import { MapView } from './map/map-view/map-view';
import { SourcesPage } from './sources-page/sources-page';

export const routes: Routes = [
    { path: '', redirectTo: 'employees', pathMatch: 'full' },
    { path: 'employees', component: EmployeeList },
    { path: 'create-employee', component: CreateEmployee },
    { path: 'update-employee/:id', component: UpdateEmployee },
    { path: 'employee-details/:id', component: EmployeeDetails},
    { path: 'map', component: MapView},
    { path: 'fuentes', component: SourcesPage},
    { path: 'event-details/:id', redirectTo: 'map' } 
];
