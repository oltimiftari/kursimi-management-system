package in.oltimiftari.kursimi.service;

import in.oltimiftari.kursimi.dto.GoalDto;
import in.oltimiftari.kursimi.entity.GoalEntity;
import in.oltimiftari.kursimi.entity.ProfileEntity;
import in.oltimiftari.kursimi.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private ProfileService profileService;

    public GoalDto createGoal(GoalDto goalDto) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        GoalEntity goal = GoalEntity.builder()
                .goalName(goalDto.getGoalName())
                .targetAmount(goalDto.getTargetAmount())
                .savedAmount(goalDto.getSavedAmount())
                .startDate(goalDto.getStartDate())
                .endDate(goalDto.getEndDate())
                .icon(goalDto.getIcon())
                .profile(currentProfile)
                .build();

        GoalEntity savedGoal = goalRepository.save(goal);
        return convertToDto(savedGoal);
    }

    public List<GoalDto> getGoalsByProfile() {

        ProfileEntity currentProfile = profileService.getCurrentProfile();
        List<GoalEntity> goals = goalRepository.findByProfileId(currentProfile.getId());
        return goals.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void deleteGoal(Long id) {

        GoalEntity goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Objektivi nuk u gjet!"));

        if (!goal.getProfile().getId().equals(profileService.getCurrentProfile().getId())) {
            throw new RuntimeException("Nuk keni te drejte te fshini kete objektiv.");
        }
        goalRepository.deleteById(id);
    }

    public GoalDto updateGoal(Long id, GoalDto updatedGoalDto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        System.out.println("ID e objektivit në kërkesë: " + id);
        System.out.println("ID e profilit aktual: " + profile.getId());


        GoalEntity existingGoal = goalRepository.findByIdAndProfileId(id, profile.getId())
                .orElseThrow(() -> new RuntimeException("Nuk u gjet ose nuk lejohet qasja në këtë qëllim"));

        existingGoal.setGoalName(updatedGoalDto.getGoalName());
        existingGoal.setTargetAmount(updatedGoalDto.getTargetAmount());
        existingGoal.setSavedAmount(updatedGoalDto.getSavedAmount());
        existingGoal.setEndDate(updatedGoalDto.getEndDate());
        existingGoal.setIcon(updatedGoalDto.getIcon());

        if (existingGoal.getSavedAmount().compareTo(existingGoal.getTargetAmount()) >= 0) {
            existingGoal.setIsAchieved(true);
        } else {
            existingGoal.setIsAchieved(false);
        }

        GoalEntity savedGoal = goalRepository.save(existingGoal);

        return convertToDto(savedGoal);
    }

    public List<GoalDto> filterGoals(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<GoalEntity> list = goalRepository.findByProfileIdAndTargetDateBetweenAndGoalNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword, sort);
        return list.stream().map(this::convertToDto).toList();
    }

    private GoalDto convertToDto(GoalEntity goal) {
        return GoalDto.builder()
                .id(goal.getId())
                .goalName(goal.getGoalName())
                .targetAmount(goal.getTargetAmount())
                .savedAmount(goal.getSavedAmount())
                .startDate(goal.getStartDate())
                .endDate(goal.getEndDate())
                .isAchieved(goal.getIsAchieved())
                .icon(goal.getIcon())
                .build();
    }
}