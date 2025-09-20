package in.oltimiftari.kursimi.controller;

import in.oltimiftari.kursimi.dto.InvestmentDTO;
import in.oltimiftari.kursimi.service.InvestmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/investments")
public class InvestmentController {

    private final InvestmentService investmentService;

    @PostMapping
    public ResponseEntity<InvestmentDTO> addInvestment(@RequestBody InvestmentDTO dto) {
        InvestmentDTO saved = investmentService.addInvestment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<InvestmentDTO>> getInvestments() {
        List<InvestmentDTO> investments = investmentService.getInvestmentsForCurrentUser();
        return ResponseEntity.ok(investments);
    }

    @PutMapping
    public ResponseEntity<InvestmentDTO> updateInvestment(@RequestBody InvestmentDTO dto) {
        InvestmentDTO updated = investmentService.updateInvestment(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable Long id) {
        investmentService.deleteInvestment(id);
        return ResponseEntity.noContent().build();
    }
}