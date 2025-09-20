package in.oltimiftari.kursimi.controller;

import in.oltimiftari.kursimi.dto.DebtDto;
import in.oltimiftari.kursimi.service.DebtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException; // SHTO KËTË IMPORT

import java.util.List;

@RestController
@RequestMapping("/debts")
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

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadDebtsReport() {
        byte[] excelData = debtService.generateExcelReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "debts_report.xlsx"); // Ndryshohet emri i skedarit
        headers.setContentLength(excelData.length);

        return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    }


    // Endpoint i ri per dergim me email
    @PostMapping("/email")
    public ResponseEntity<Void> emailDebtsReport() {
        try {
            debtService.emailDebtsReport();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (MessagingException e) {
            // E rregulluar per te kapur gabimin e mundshem
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}