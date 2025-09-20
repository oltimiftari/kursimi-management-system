package in.oltimiftari.kursimi.repository;

import in.oltimiftari.kursimi.entity.DebtEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DebtRepository extends JpaRepository<DebtEntity, Long> {


    List<DebtEntity> findByProfileId(Long profileId);

    List<DebtEntity> findByProfileIdAndDueDateBetweenAndNameContainingIgnoreCase(
            Long profileId,
            LocalDate startDate,
            LocalDate endDate,
            String keyword,
            Sort sort
    );
}