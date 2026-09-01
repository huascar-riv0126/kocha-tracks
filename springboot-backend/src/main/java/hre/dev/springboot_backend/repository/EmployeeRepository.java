package hre.dev.springboot_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hre.dev.springboot_backend.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long>{
    
}
