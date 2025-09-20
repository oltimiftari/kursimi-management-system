package in.oltimiftari.kursimi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvestmentDTO {

    private Long id;
    private String assetName;
    private String tickerSymbol;
    private BigDecimal initialAmount;
    private BigDecimal sharesOwned;
    private LocalDate purchaseDate;

    private BigDecimal currentValue;
    private BigDecimal profitLoss;
    private BigDecimal profitLossPercentage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}