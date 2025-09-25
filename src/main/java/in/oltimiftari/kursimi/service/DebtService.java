package in.oltimiftari.kursimi.service;

import in.oltimiftari.kursimi.dto.DebtDto;
import in.oltimiftari.kursimi.entity.DebtEntity;
import in.oltimiftari.kursimi.entity.ProfileEntity;
import in.oltimiftari.kursimi.repository.DebtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;
import java.time.LocalDate;
import java.util.List;

import jakarta.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.stream.Collectors;


@Service
public class DebtService {

    @Autowired
    private DebtRepository debtRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ExcelService excelService;


    // Metoda per krijimin e nje borxhi te ri
    public DebtDto createDebt(DebtDto debtDto) {
        ProfileEntity currentProfile = profileService.getCurrentProfile();

        DebtEntity debt = DebtEntity.builder()
                .name(debtDto.getName())
                .originalAmount(debtDto.getOriginalAmount())
                .remainingAmount(debtDto.getRemainingAmount())
                .interestRate(debtDto.getInterestRate())
                .type(debtDto.getType())
                .dueDate(debtDto.getDueDate())
                .profile(currentProfile)
                .build();

        DebtEntity savedDebt = debtRepository.save(debt);
        return convertToDto(savedDebt);
    }

    // Metoda per te marre te gjitha borxhet per nje perdorues te caktuar
    public List<DebtDto> getDebtsByProfile() {
        ProfileEntity currentProfile = profileService.getCurrentProfile();
        List<DebtEntity> debts = debtRepository.findByProfileId(currentProfile.getId());
        return debts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Metoda per te perditesuar nje borxh ekzistues
    public DebtDto updateDebt(Long id, DebtDto updatedDebtDto) {
        DebtEntity existingDebt = debtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borxhi nuk u gjet!"));

        if (!existingDebt.getProfile().getId().equals(profileService.getCurrentProfile().getId())) {
            throw new RuntimeException("Nuk keni te drejte te perditesoni kete borxh.");
        }

        existingDebt.setName(updatedDebtDto.getName());
        existingDebt.setOriginalAmount(updatedDebtDto.getOriginalAmount());
        existingDebt.setRemainingAmount(updatedDebtDto.getRemainingAmount());
        existingDebt.setInterestRate(updatedDebtDto.getInterestRate());
        existingDebt.setType(updatedDebtDto.getType());
        existingDebt.setDueDate(updatedDebtDto.getDueDate());

        DebtEntity updatedDebt = debtRepository.save(existingDebt);
        return convertToDto(updatedDebt);
    }

    // Metoda per te gjeneruar nje raport Excel
    public byte[] generateExcelReport() {
        List<DebtDto> debts = getDebtsByProfile(); // Marrja e borxheve ne format DTO
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            excelService.writeDebtsToExcel(bos, debts);
            return bos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Dështoi gjenerimi i raportit Excel", e);
        }
    }

    @Transactional
    public void emailDebtsReport() throws MessagingException {
        byte[] excelData = generateExcelReport();
        ProfileEntity currentProfile = profileService.getCurrentProfile();

        String subject = "Raporti i Borxheve (Excel)";
        String body = "Përshëndetje! Ja raporti juaj i borxheve në format Excel.";

        emailService.sendEmailWithAttachment(
                currentProfile.getEmail(),
                subject,
                body,
                excelData,
                "debts_report.xlsx"
        );
    }


    // Metoda per te fshire nje borxh
    public void deleteDebt(Long id) {
        DebtEntity debt = debtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borxhi nuk u gjet!"));

        if (!debt.getProfile().getId().equals(profileService.getCurrentProfile().getId())) {
            throw new RuntimeException("Nuk keni te drejte te fshini kete borxh.");
        }
        debtRepository.deleteById(id);
    }

    public List<DebtDto> filterDebts(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<DebtEntity> list = debtRepository.findByProfileIdAndDueDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword, sort);
        return list.stream().map(this::convertToDto).toList();
    }


    // Metoda private per konvertimin e Entitetit ne DTO
    private DebtDto convertToDto(DebtEntity debt) {
        return DebtDto.builder()
                .id(debt.getId())
                .name(debt.getName())
                .originalAmount(debt.getOriginalAmount())
                .remainingAmount(debt.getRemainingAmount())
                .interestRate(debt.getInterestRate())
                .type(debt.getType())
                .dueDate(debt.getDueDate())
                .build();
    }
}