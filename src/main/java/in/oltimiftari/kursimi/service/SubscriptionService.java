package in.oltimiftari.kursimi.service;
import in.oltimiftari.kursimi.dto.SubscriptionDTO;
import in.oltimiftari.kursimi.entity.CategoryEntity;
import in.oltimiftari.kursimi.entity.ProfileEntity;
import in.oltimiftari.kursimi.entity.SubscriptionEntity;
import in.oltimiftari.kursimi.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private CategoryService categoryService;

    public SubscriptionDTO createSubscription(SubscriptionDTO subscriptionDTO) {
        ProfileEntity currentProfile = profileService.getCurrentProfile();
        CategoryEntity category = categoryService.getCategoryById(subscriptionDTO.getCategoryId());

        SubscriptionEntity subscription = SubscriptionEntity.builder()
                .name(subscriptionDTO.getName())
                .amount(subscriptionDTO.getAmount())
                .frequency(subscriptionDTO.getFrequency())
                .paymentDate(subscriptionDTO.getPaymentDate())
                .nextPaymentDate(calculateNextPaymentDate(subscriptionDTO.getPaymentDate(), subscriptionDTO.getFrequency()))
                .profile(currentProfile)
                .category(category)
                .build();

        SubscriptionEntity savedSubscription = subscriptionRepository.save(subscription);
        return convertToDto(savedSubscription);
    }

    public List<SubscriptionDTO> getSubscriptionsByProfile() {
        ProfileEntity currentProfile = profileService.getCurrentProfile();
        List<SubscriptionEntity> subscriptions = subscriptionRepository.findByProfileId(currentProfile.getId());

        return subscriptions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public SubscriptionDTO updateSubscription(Long id, SubscriptionDTO updatedSubscriptionDTO) {
        ProfileEntity currentProfile = profileService.getCurrentProfile();

        SubscriptionEntity existingSubscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonimi nuk u gjet!"));

        if (!existingSubscription.getProfile().getId().equals(currentProfile.getId())) {
            throw new RuntimeException("Nuk keni te drejte te perditesoni kete abonim.");
        }

        existingSubscription.setName(updatedSubscriptionDTO.getName());
        existingSubscription.setAmount(updatedSubscriptionDTO.getAmount());
        existingSubscription.setFrequency(updatedSubscriptionDTO.getFrequency());
        existingSubscription.setPaymentDate(updatedSubscriptionDTO.getPaymentDate());
        existingSubscription.setNextPaymentDate(calculateNextPaymentDate(updatedSubscriptionDTO.getPaymentDate(), updatedSubscriptionDTO.getFrequency()));
        existingSubscription.setCategory(categoryService.getCategoryById(updatedSubscriptionDTO.getCategoryId()));

        SubscriptionEntity savedSubscription = subscriptionRepository.save(existingSubscription);
        return convertToDto(savedSubscription);
    }

    public void deleteSubscription(Long id) {
        SubscriptionEntity subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonimi nuk u gjet!"));

        if (!subscription.getProfile().getId().equals(profileService.getCurrentProfile().getId())) {
            throw new RuntimeException("Nuk keni te drejte te fshini kete abonim.");
        }

        subscriptionRepository.delete(subscription);
    }

    private SubscriptionDTO convertToDto(SubscriptionEntity subscription) {
        return SubscriptionDTO.builder()
                .id(subscription.getId())
                .name(subscription.getName())
                .amount(subscription.getAmount())
                .frequency(subscription.getFrequency())
                .paymentDate(subscription.getPaymentDate())
                .nextPaymentDate(subscription.getNextPaymentDate())
                .profileId(subscription.getProfile().getId())
                .categoryId(subscription.getCategory().getId())
                .build();
    }

    private LocalDate calculateNextPaymentDate(LocalDate lastPaymentDate, String frequency) {
        if (lastPaymentDate == null) {
            return null;
        }

        switch (frequency.toUpperCase()) {
            case "MONTHLY":
                return lastPaymentDate.plusMonths(1);
            case "YEARLY":
                return lastPaymentDate.plusYears(1);
            case "WEEKLY":
                return lastPaymentDate.plusWeeks(1);
            default:
                return lastPaymentDate;
        }
    }
}