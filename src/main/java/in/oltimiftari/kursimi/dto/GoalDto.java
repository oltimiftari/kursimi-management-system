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
public class GoalDto {

    private Long id;
    private String goalName;
    private BigDecimal targetAmount;
    private BigDecimal savedAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isAchieved;
    private String icon;

}