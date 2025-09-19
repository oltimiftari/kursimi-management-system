package in.oltimiftari.kursimi.repository;

import in.oltimiftari.kursimi.entity.GoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<GoalEntity, Long> {

    List<GoalEntity> findByProfileId(Long profileId);
}