package in.oltimiftari.kursimi.repository;

import in.oltimiftari.kursimi.entity.DebtEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DebtRepository extends JpaRepository<DebtEntity, Long> {


    List<DebtEntity> findByProfileId(Long profileId);
}