package com.samibentebbiche.ChallengeApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChallengeService {


    private Long nextId = 1L;

    @Autowired
    ChallengeRepository challengeRepository;

    public ChallengeService()
    {

    }

    public List<Challenge> getAllChallenges(){
        return challengeRepository.findAll();
    }

    public boolean addChallenge(Challenge challenge) {

        if(challenge != null){
            challenge.setId(nextId++);
            challengeRepository.save(challenge);
            return true;
        }else{
            return false;
        }



    }

    public Optional<Challenge> getChallangeById(Long id) {
        return challengeRepository.findById(id);
    }

    public List<Challenge> getChallengePerMonth(int month) {
        return challengeRepository.findByMonth(month);
    }

    public List<Challenge> getChallengePerDay(LocalDate day) {
        return challengeRepository.findByEventDate(day);
    }

    public boolean updatedChallenge(Long id, Challenge updatedchallenge) {
        Optional<Challenge> challenge = challengeRepository.findById(id);
        if(challenge.isPresent())
        {
            Challenge challengeToUpdate = challenge.get();

            challengeToUpdate.setEventDate(updatedchallenge.getEventDate());
            challengeToUpdate.setTitle(updatedchallenge.getTitle());
            challengeToUpdate.setDescription(updatedchallenge.getDescription());
            challengeToUpdate.setTextMarkDown(updatedchallenge.getTextMarkDown());
            challengeRepository.save(challengeToUpdate);
            return true;
        }
        return false;

    }

    public boolean deleteChallege(Long id) {
        Optional<Challenge> challenge = challengeRepository.findById(id);
        if(challenge.isPresent()){
            challengeRepository.deleteById(id);
            return true;
        }
        return false;
    }


}
