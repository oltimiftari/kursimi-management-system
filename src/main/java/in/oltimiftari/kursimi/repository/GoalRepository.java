package in.oltimiftari.kursimi.repository;

import in.oltimiftari.kursimi.entity.GoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<GoalEntity, Long> {

    List<GoalEntity> findByProfileId(Long profileId);

    List<GoalEntity> findByProfileIdAndTargetDateBetweenAndGoalNameContainingIgnoreCase(
            Long profileId,
            LocalDate startDate,
            LocalDate endDate,
            String keyword,
            Sort sort
    );

}