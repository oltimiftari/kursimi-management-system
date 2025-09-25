package in.oltimiftari.kursimi.controller;

import in.oltimiftari.kursimi.dto.SubscriptionDTO;
import in.oltimiftari.kursimi.entity.ProfileEntity;
import in.oltimiftari.kursimi.service.*;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    private final ExcelService excelService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final EmailService emailService;
    private final ProfileService profileService;
    private final SubscriptionService subscriptionService;

    @GetMapping("/income-excel")
    public ResponseEntity<Void> emailIncomeExcel() throws IOException, MessagingException {
        ProfileEntity profile = profileService.getCurrentProfile();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        excelService.writeIncomesToExcel(baos, incomeService.getCurrentMonthIncomesForCurrentUser());
        emailService.sendEmailWithAttachment(profile.getEmail(),
                "Raporti juaj i të ardhurave në Excel",
                "Raporti juaj i të ardhurave është i bashkëngjitur në attach",
                baos.toByteArray(),
                "income.xlsx");
        return ResponseEntity.ok(null);
    }

    @GetMapping("/expense-excel")
    public ResponseEntity<Void> emailExpenseExcel() throws IOException, MessagingException {
        ProfileEntity profile = profileService.getCurrentProfile();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        excelService.writeExpensesToExcel(baos, expenseService.getCurrentMonthExpensesForCurrentUser());
        emailService.sendEmailWithAttachment(
                profile.getEmail(),
                "Raporti juaj i shpenzimeve në Excel",
                "Raporti juaj i shpenzimeve është i bashkëngjitur në attach",
                baos.toByteArray(),
                "expenses.xlsx");
        return ResponseEntity.ok(null);
    }


    @GetMapping("/subscription-excel")
    public ResponseEntity<Void> emailSubscriptionExcel() throws IOException, MessagingException {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<SubscriptionDTO> subscriptions = subscriptionService.getSubscriptionsByProfile();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        excelService.writeSubscriptionsToExcel(baos, subscriptions);
        emailService.sendEmailWithAttachment(
                profile.getEmail(),
                "Raporti juaj i abonimeve në Excel",
                "Raporti juaj i abonimeve është i bashkëngjitur në attach",
                baos.toByteArray(),
                "subscriptions.xlsx");
        return ResponseEntity.ok(null);
    }
}