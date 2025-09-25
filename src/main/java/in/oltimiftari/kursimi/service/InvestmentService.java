package in.oltimiftari.kursimi.service;

import in.oltimiftari.kursimi.dto.InvestmentDTO;
import in.oltimiftari.kursimi.entity.InvestmentEntity;
import in.oltimiftari.kursimi.entity.ProfileEntity;
import in.oltimiftari.kursimi.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final ProfileService profileService;

    // Metoda per te shtuar nje investim te ri
    public InvestmentDTO addInvestment(InvestmentDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        InvestmentEntity newInvestment = toEntity(dto, profile);
        newInvestment = investmentRepository.save(newInvestment);
        return toDTO(newInvestment);
    }

    // Metoda per te marre te gjitha investimet per perdoruesin aktual
    public List<InvestmentDTO> getInvestmentsForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<InvestmentEntity> investments = investmentRepository.findByProfileIdOrderByPurchaseDateDesc(profile.getId());
        return investments.stream().map(this::toDTO).toList();
    }

    // Metoda per te fshire nje investim
    public void deleteInvestment(Long investmentId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        InvestmentEntity entity = investmentRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Nuk u gjet asnjë investim"));

        if (!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Nuk ke leje për të fshirë këtë investim");
        }
        investmentRepository.delete(entity);
    }

    // Metoda per te perditesuar nje investim ekzistues
    public InvestmentDTO updateInvestment(InvestmentDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        InvestmentEntity existingInvestment = investmentRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Nuk u gjet asnjë investim"));

        if (!existingInvestment.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Nuk ke leje për të përditësuar këtë investim");
        }


        existingInvestment.setAssetName(dto.getAssetName());
        existingInvestment.setTickerSymbol(dto.getTickerSymbol());
        existingInvestment.setInitialAmount(dto.getInitialAmount());
        existingInvestment.setSharesOwned(dto.getSharesOwned());
        existingInvestment.setPurchaseDate(dto.getPurchaseDate());

        existingInvestment = investmentRepository.save(existingInvestment);
        return toDTO(existingInvestment);
    }

    public List<InvestmentDTO> filterInvestments(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<InvestmentEntity> list = investmentRepository.findByProfileIdAndPurchaseDateBetweenAndAssetNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword, sort);
        return list.stream().map(this::toDTO).toList();
    }

    // Metodat ndihmese per konvertim
    private InvestmentEntity toEntity(InvestmentDTO dto, ProfileEntity profile) {
        return InvestmentEntity.builder()
                .assetName(dto.getAssetName())
                .tickerSymbol(dto.getTickerSymbol())
                .initialAmount(dto.getInitialAmount())
                .sharesOwned(dto.getSharesOwned())
                .purchaseDate(dto.getPurchaseDate())
                .profile(profile)
                .build();
    }

    private InvestmentDTO toDTO(InvestmentEntity entity) {
        return InvestmentDTO.builder()
                .id(entity.getId())
                .assetName(entity.getAssetName())
                .tickerSymbol(entity.getTickerSymbol())
                .initialAmount(entity.getInitialAmount())
                .sharesOwned(entity.getSharesOwned())
                .purchaseDate(entity.getPurchaseDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}