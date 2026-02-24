package com.sms.backend.service;

import com.sms.backend.model.Student;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

@Service
public class StudentCsvService {

    public String exportToCsv(List<Student> students) throws IOException {
        StringWriter out = new StringWriter();

        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader("studentCode", "fullName", "email", "phone", "address", "grade", "active", "createdAt", "updatedAt")
                .build();

        try (CSVPrinter printer = new CSVPrinter(out, format)) {
            for (Student s : students) {
                printer.printRecord(
                        s.getStudentCode(),
                        s.getFullName(),
                        s.getEmail(),
                        s.getPhone(),
                        s.getAddress(),
                        s.getGrade(),
                        s.isActive(),
                        s.getCreatedAt(),
                        s.getUpdatedAt()
                );
            }
        }

        return out.toString();
    }
}