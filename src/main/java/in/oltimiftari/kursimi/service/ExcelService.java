package in.oltimiftari.kursimi.service;

import in.oltimiftari.kursimi.dto.ExpenseDTO;
import in.oltimiftari.kursimi.dto.IncomeDTO;
import in.oltimiftari.kursimi.dto.SubscriptionDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import in.oltimiftari.kursimi.dto.DebtDto;


import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class ExcelService {

    //METODA PER SHKRIMIN E TE ARDHURAVE NE EXCEL
    public void writeIncomesToExcel(OutputStream os, List<IncomeDTO> incomes) throws IOException {
        try(Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Të ardhurat");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("S.No");
            header.createCell(1).setCellValue("Emri");
            header.createCell(2).setCellValue("Kategoria");
            header.createCell(3).setCellValue("Shuma");
            header.createCell(4).setCellValue("Data");
            IntStream.range(0, incomes.size())
                    .forEach(i -> {
                        IncomeDTO income = incomes.get(i);
                        Row row = sheet.createRow(i + 1);
                        row.createCell(0).setCellValue(i + 1);
                        row.createCell(1).setCellValue(income.getName() != null ? income.getName(): "N/A");
                        row.createCell(2).setCellValue(income.getCategoryId() != null ? income.getCategoryName(): "N/A");
                        row.createCell(3).setCellValue(income.getAmount() != null ? income.getAmount().doubleValue(): 0);
                        row.createCell(4).setCellValue(income.getDate() != null ? income.getDate().toString(): "N/A");
                    });
            workbook.write(os);
        }
    }

    //METODA PER SHKRIMIN E SHPENZIMEVE NE EXCEL
    public void writeExpensesToExcel(OutputStream os, List<ExpenseDTO> expenses) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Shpenzimet");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("S.No");
            header.createCell(1).setCellValue("Emri");
            header.createCell(2).setCellValue("Kategoria");
            header.createCell(3).setCellValue("Shuma");
            header.createCell(4).setCellValue("Data");
            IntStream.range(0, expenses.size())
                    .forEach(i -> {
                        ExpenseDTO expense = expenses.get(i);
                        Row row = sheet.createRow(i + 1);
                        row.createCell(0).setCellValue(i + 1); // Serial number
                        row.createCell(1).setCellValue(expense.getName() != null ? expense.getName() : "");
                        row.createCell(2)
                                .setCellValue(expense.getCategoryId() != null ? expense.getCategoryName() : "N/A");
                        row.createCell(3)
                                .setCellValue(expense.getAmount() != null ? expense.getAmount().doubleValue() : 0);
                        row.createCell(4).setCellValue(expense.getDate() != null ? expense.getDate().toString() : "");
                    });
            workbook.write(os);
        }
    }

    // METODA PER SHKRIMIN E BORXHEVE NE EXCEL
    public void writeDebtsToExcel(OutputStream os, List<DebtDto> debts) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Borxhet");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("S.No");
            header.createCell(1).setCellValue("Emri");
            header.createCell(2).setCellValue("Shuma Origjinale");
            header.createCell(3).setCellValue("Shuma e Mbetur");
            header.createCell(4).setCellValue("Norma e Interesit");
            header.createCell(5).setCellValue("Tipi");
            header.createCell(6).setCellValue("Data e Shlyerjes");

            IntStream.range(0, debts.size())
                    .forEach(i -> {
                        DebtDto debt = debts.get(i);
                        Row row = sheet.createRow(i + 1);
                        row.createCell(0).setCellValue(i + 1);
                        row.createCell(1).setCellValue(debt.getName());
                        row.createCell(2).setCellValue(debt.getOriginalAmount().doubleValue());
                        row.createCell(3).setCellValue(debt.getRemainingAmount().doubleValue());
                        row.createCell(4).setCellValue(debt.getInterestRate().doubleValue());
                        row.createCell(5).setCellValue(debt.getType());
                        row.createCell(6).setCellValue(debt.getDueDate().toString());
                    });
            workbook.write(os);
        }
    }

    public void writeSubscriptionsToExcel(OutputStream os, List<SubscriptionDTO> subscriptions) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Abonimet");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("S.No");
            header.createCell(1).setCellValue("Emri");
            header.createCell(2).setCellValue("Kategoria");
            header.createCell(3).setCellValue("Shuma");
            header.createCell(4).setCellValue("Data");
            IntStream.range(0, subscriptions.size())
                    .forEach(i -> {
                        SubscriptionDTO subscription = subscriptions.get(i);
                        Row row = sheet.createRow(i + 1);
                        row.createCell(0).setCellValue(i + 1);
                        row.createCell(1).setCellValue(subscription.getName() != null ? subscription.getName() : "");
                        row.createCell(2).setCellValue(subscription.getCategoryName() != null ? subscription.getCategoryName() : "N/A");
                        row.createCell(3).setCellValue(subscription.getAmount() != null ? subscription.getAmount().doubleValue() : 0);
                        row.createCell(4).setCellValue(subscription.getPaymentDate() != null ? subscription.getPaymentDate().toString() : "");
                    });
            workbook.write(os);
        }
    }


}
