package in.oltimiftari.kursimi.repository;

import in.oltimiftari.kursimi.entity.InvestmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;
import org.springframework.data.domain.Sort;

public interface InvestmentRepository extends JpaRepository<InvestmentEntity, Long> {

    List<InvestmentEntity> findByProfileIdOrderByPurchaseDateDesc(Long profileId);

    List<InvestmentEntity> findByProfileIdAndPurchaseDateBetweenAndAssetNameContainingIgnoreCase(
            Long profileId,
            LocalDate startDate,
            LocalDate endDate,
            String keyword,
            Sort sort
    );
}