package in.oltimiftari.kursimi.repository;

import in.oltimiftari.kursimi.entity.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, Long> {

    // Kjo metode do t'gjeje te gjitha abonimet per nje profil te caktum
    List<SubscriptionEntity> findByProfileId(Long profileId);
}