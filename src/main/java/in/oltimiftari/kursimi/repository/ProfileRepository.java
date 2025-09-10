package in.oltimiftari.kursimi.repository;

import in.oltimiftari.kursimi.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {

    Optional<ProfileEntity> findByEmail(String email);
}
