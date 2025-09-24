package in.oltimiftari.kursimi.controller;

import in.oltimiftari.kursimi.dto.GoalDto;
import in.oltimiftari.kursimi.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalDto> createGoal(@RequestBody GoalDto goalDto) {
        GoalDto createdGoal = goalService.createGoal(goalDto);
        return ResponseEntity.ok(createdGoal);
    }

    @GetMapping
    public ResponseEntity<List<GoalDto>> getGoals() {
        List<GoalDto> goals = goalService.getGoalsByProfile();
        return ResponseEntity.ok(goals);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalDto> updateGoal(@PathVariable Long id, @RequestBody GoalDto goalDto) {
        GoalDto updatedGoal = goalService.updateGoal(id, goalDto);
        return ResponseEntity.ok(updatedGoal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id); // Kjo metode duhet shtuar edhe ne GoalService
        return ResponseEntity.noContent().build();
    }
}