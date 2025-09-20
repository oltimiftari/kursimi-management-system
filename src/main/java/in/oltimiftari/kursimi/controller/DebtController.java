package in.oltimiftari.kursimi.controller;

import in.oltimiftari.kursimi.dto.DebtDto;
import in.oltimiftari.kursimi.service.DebtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    @Autowired
    private DebtService debtService;

    // Krijimi i nje borxhi te ri
    @PostMapping
    public ResponseEntity<DebtDto> createDebt(@RequestBody DebtDto debtDto) {
        DebtDto createdDebt = debtService.createDebt(debtDto);
        return new ResponseEntity<>(createdDebt, HttpStatus.CREATED);
    }

    // Marja e te gjitha borxheve per perdoruesin e loguar
    @GetMapping
    public ResponseEntity<List<DebtDto>> getDebts() {
        List<DebtDto> debts = debtService.getDebtsByProfile();
        return new ResponseEntity<>(debts, HttpStatus.OK);
    }

    // Perditesimi i nje borxhi ekzistues
    @PutMapping("/{id}")
    public ResponseEntity<DebtDto> updateDebt(@PathVariable("id") Long id, @RequestBody DebtDto debtDto) {
        DebtDto updatedDebt = debtService.updateDebt(id, debtDto);
        return new ResponseEntity<>(updatedDebt, HttpStatus.OK);
    }

    // Fshirja e nje borxhi ekzistues
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebt(@PathVariable("id") Long id) {
        debtService.deleteDebt(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}