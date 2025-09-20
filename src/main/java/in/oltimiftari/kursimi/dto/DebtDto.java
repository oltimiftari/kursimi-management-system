package in.oltimiftari.kursimi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DebtDto {

    private Long id;
    private String name;
    private BigDecimal originalAmount;
    private BigDecimal remainingAmount;
    private BigDecimal interestRate;
    private String type;
    private LocalDate dueDate;
}