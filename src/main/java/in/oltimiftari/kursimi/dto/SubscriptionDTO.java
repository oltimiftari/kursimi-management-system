package in.oltimiftari.kursimi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDTO {

    private Long id;
    private String name;
    private Double amount;
    private String frequency;
    private LocalDate paymentDate;
    private LocalDate nextPaymentDate;
    private Long profileId;
    private Long categoryId;
    private String categoryName;


    public String getCategoryName() {
        return categoryName;
    }
}
