package com.example.demo.student;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents(){

        return studentRepository.findAll();
    }

    public void addStudent(Student student) {

        //Check if email is taken
        Student studentWithExistingEmail = studentRepository.findByEmail(student.getEmail());

        if(studentWithExistingEmail != null){
            throw new IllegalStateException("A student with this email already exists!");
        }

        studentRepository.save(student);
    }

    public void deleteStudent(Student student){

        studentRepository.delete(student);
    }
}
