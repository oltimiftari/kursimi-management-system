package in.oltimiftari.kursimi.controller;


import in.oltimiftari.kursimi.dto.ExpenseDTO;
import in.oltimiftari.kursimi.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")

public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDTO> addExpense(@RequestBody ExpenseDTO dto) {
        ExpenseDTO saved = expenseService.addExpense(dto);
        return  ResponseEntity.status(HttpStatus.CREATED).body(saved);

    }

    @GetMapping
    public  ResponseEntity<List<ExpenseDTO>> getExpenses() {
       List<ExpenseDTO> expenses = expenseService.getCurrentMonthExpensesForCurrentUser();
       return ResponseEntity.ok(expenses);
    }
}
