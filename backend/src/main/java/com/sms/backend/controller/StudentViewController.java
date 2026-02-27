package com.sms.backend.controller;

import com.sms.backend.model.MarkSheet;
import com.sms.backend.model.Student;
import com.sms.backend.repository.MarkSheetRepository;
import com.sms.backend.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-view")
@CrossOrigin
public class StudentViewController {

    private final StudentRepository studentRepo;
    private final MarkSheetRepository sheetRepo;

    public StudentViewController(StudentRepository studentRepo, MarkSheetRepository sheetRepo) {
        this.studentRepo = studentRepo;
        this.sheetRepo = sheetRepo;
    }

    @GetMapping("/mark-sheet")
    public Map<String, Object> getMyMarkSheet(
            @RequestHeader("X-Student-Id") String studentId,
            @RequestParam Integer grade,
            @RequestParam String classRoom,
            @RequestParam String term
    ) {
        if (studentId == null || studentId.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing student session.");
        }

        Student me = studentRepo.findById(studentId.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Student not found."));

        // ✅ allow only grade history (<= current grade)
        if (grade == null || grade < 1 || grade > me.getGrade()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your current or previous grades.");
        }

        String myRoom = (me.getClassRoom() == null) ? "" : me.getClassRoom().trim().toUpperCase();
        String reqRoom = (classRoom == null) ? "" : classRoom.trim().toUpperCase();
        String reqTerm = (term == null) ? "" : term.trim();

        // ✅ force same class room
        if (!reqRoom.equals(myRoom)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own class room.");
        }

        // ✅ simple validation: term must start with A-/B-/C-
        if (!reqTerm.toUpperCase().startsWith(myRoom + "-")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid term for your class room.");
        }

        MarkSheet sheet = sheetRepo.findByGradeAndClassRoomAndTerm(grade, reqRoom, reqTerm)
                .orElseGet(() -> {
                    MarkSheet s = new MarkSheet();
                    s.setGrade(grade);
                    s.setClassRoom(reqRoom);
                    s.setTerm(reqTerm);
                    return sheetRepo.save(s);
                });

        // ✅ only my marks row
        Map<String, Integer> myMarks = sheet.getMarks().getOrDefault(me.getId(), Map.of());
        List<MarkSheet.MarkColumn> cols = sheet.getColumns();

        return Map.of(
                "student", Map.of(
                        "id", me.getId(),
                        "username", me.getUsername(),
                        "name", me.getName(),
                        "grade", me.getGrade(),
                        "classRoom", me.getClassRoom()
                ),
                "columns", cols,
                "marks", myMarks
        );
    }
}