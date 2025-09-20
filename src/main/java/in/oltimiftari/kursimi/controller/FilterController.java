package in.oltimiftari.kursimi.controller;

import in.oltimiftari.kursimi.dto.ExpenseDTO;
import in.oltimiftari.kursimi.dto.FilterDTO;
import in.oltimiftari.kursimi.dto.IncomeDTO;
import in.oltimiftari.kursimi.service.ExpenseService;
import in.oltimiftari.kursimi.service.IncomeService;
import lombok.RequiredArgsConstructor;
import in.oltimiftari.kursimi.service.DebtService; // Shto këtë
import in.oltimiftari.kursimi.service.InvestmentService; // Shto këtë
import in.oltimiftari.kursimi.service.GoalService; // Shto këtë

import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;
    private final DebtService debtService;
    private final InvestmentService investmentService;
    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<?> filterTransactions(@RequestBody FilterDTO filter) {
        // preparing the data or validation
        LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.MIN;
        LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();
        String keyword = filter.getKeyword() != null ? filter.getKeyword() : "";
        String sortField = filter.getSortField() != null ? filter.getSortField() : "date";
        Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortField);
        switch(filter.getType().toLowerCase()) {
            case "income":
                List<IncomeDTO> incomes = incomeService.filterIncomes(startDate, endDate, keyword, sort);
                return  ResponseEntity.ok(incomes);
            case "expense":
                List<ExpenseDTO> expenses = expenseService.filterExpenses(startDate, endDate, keyword, sort);
                return ResponseEntity.ok(expenses);
            case "debts":
                List<?> debts = debtService.filterDebts(startDate, endDate, keyword, sort);
                return ResponseEntity.ok(debts);
            case "investments":
                List<?> investments = investmentService.filterInvestments(startDate, endDate, keyword, sort);
                return ResponseEntity.ok(investments);
            case "goals":
                List<?> goals = goalService.filterGoals(startDate, endDate, keyword, sort);
                return ResponseEntity.ok(goals);
            default:
                return ResponseEntity.badRequest().body("Invalid type. Must be 'income', 'expense', 'debts', 'investments', or 'goals'");
        }
    }
}