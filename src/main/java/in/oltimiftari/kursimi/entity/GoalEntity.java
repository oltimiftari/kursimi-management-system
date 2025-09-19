package in.oltimiftari.kursimi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_goals")
public class GoalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String goalName;
    private BigDecimal targetAmount;
    private BigDecimal savedAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isAchieved;
    private String icon;


    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private ProfileEntity profile;

    @PrePersist
    public void prePersist() {
        if(this.startDate == null) {
            this.startDate = LocalDate.now();
        }
        if(this.savedAmount == null) {
            this.savedAmount = BigDecimal.ZERO;
        }
        if(this.isAchieved == null) {
            this.isAchieved = false;
        }
    }
}