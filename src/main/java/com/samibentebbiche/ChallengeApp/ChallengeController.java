package com.samibentebbiche.ChallengeApp;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/challenges")
@CrossOrigin(origins="http://localhost:3000/")
public class ChallengeController {
    private ChallengeService challengeService;


    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }
    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges(){
        return new ResponseEntity<>(challengeService.getAllChallenges(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> addChallenge(@RequestBody Challenge challenge) {
        boolean isChallengeAdded = challengeService.addChallenge(challenge);

        if(isChallengeAdded)
            return new ResponseEntity<>("Challenge added successfully", HttpStatus.OK);
        else
            return  new ResponseEntity<>("Challenge not added successfully", HttpStatus.NOT_FOUND);
    }

    @GetMapping("month/{month}")
    public ResponseEntity<List<Challenge>> getAllChallengePerMonth(@PathVariable int month){
        return new ResponseEntity<>( challengeService.getChallengePerMonth(month), HttpStatus.OK);

    }

    @GetMapping("day/{day}")
    public ResponseEntity<List<Challenge>> getAllChallengePerDay(@PathVariable LocalDate day){

        return new ResponseEntity<>(challengeService.getChallengePerDay(day), HttpStatus.OK);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallangeById(@PathVariable Long id){
        Optional<Challenge> chanllenge= challengeService.getChallangeById(id);
        if(chanllenge.isPresent())
            return new ResponseEntity<>(chanllenge.get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);


    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateChallenge(@PathVariable Long id, @RequestBody Challenge updatedchallenge){
        boolean isChallengeUpdated = challengeService.updatedChallenge(id, updatedchallenge);

        if(isChallengeUpdated)
            return new ResponseEntity<>("Challenge updated successfully", HttpStatus.OK);
        else
            return  new ResponseEntity<>("Challenge not updated", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteChallenge(@PathVariable Long id){
        boolean isChallengeDeleted = challengeService.deleteChallege(id);
        if(isChallengeDeleted)
            return new ResponseEntity<>("Challenge Deleted successfully", HttpStatus.OK);
        else
            return  new ResponseEntity<>("Challenge not Deleted", HttpStatus.NOT_FOUND);
    }

}
