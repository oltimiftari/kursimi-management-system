package in.oltimiftari.kursimi.controller;

import in.oltimiftari.kursimi.dto.ExpenseDTO;
import in.oltimiftari.kursimi.dto.IncomeDTO;
import in.oltimiftari.kursimi.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeDTO> addExpense(@RequestBody IncomeDTO dto) {
        IncomeDTO saved = incomeService.addIncome(dto);
        return  ResponseEntity.status(HttpStatus.CREATED).body(saved);

    }

    @GetMapping
    public  ResponseEntity<List<IncomeDTO>> getExpenses() {
        List<IncomeDTO> expenses = incomeService.getCurrentMonthIncomesForCurrentUser();
        return ResponseEntity.ok(expenses);
    }
}
