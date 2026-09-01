import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Service()
export class EmployeeData {
    private readonly baseURL=  "http://localhost:8080/api/v1/employees";
    private readonly httpClient = inject(HttpClient)

    getEmployeeList(): Observable<Employee[]> {
        return this.httpClient.get<Employee[]>(`${this.baseURL}`);
    }

    getById(id: number): Observable<Employee> {
        return this.httpClient.get<Employee>(`${this.baseURL}/${id}`);
    }

    createEmployee(employee: Employee): Observable<Employee> {
        return this.httpClient.post<Employee>(`${this.baseURL}`, employee);
    }

    updateEmployee(id: number, employee: Employee):  Observable<Employee> {
        return this.httpClient.put<Employee>(`${this.baseURL}/${id}`, employee);
    }

    deleteEmployee(id: number) {
        return this.httpClient.delete(`${this.baseURL}/${id}`);
    }
}
