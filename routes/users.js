const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const ElectionCommissioner = require('../models/electionCommissioner');
const Voter = require('../models/voter');
const Candidate = require('../models/candidate');
const Booth = require('../models/booth');
const PollOperator = require('../models/pollOperator');
const Election = require('../models/election');

//register
router.post('/register', (req, res, next) => {
    const checkUsername = req.body.username;
    let newUser = new ElectionCommissioner({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        usertype: req.body.type
    });

    ElectionCommissioner.getUserByUsername(checkUsername, (err, user) => {
        if(err) throw err;
        if(user) {
            res.json({success: false, msg: 'Username already exists'});
        }else {
            ElectionCommissioner.addEc(newUser, (err, user) => {
                if (err) {
                    console.log(err);
                    res.json({success: false, msg: 'failed to register'});
                } else {
                    res.json({success: true, msg: ' registered'});
                }
            });
        }

    });
//adding the user to the database, invoking the encrypting functionality

});

//register poll Operator
router.post('/register_po', (req, res, next) => {
    const checkUsername = req.body.username;
    let newUser = new PollOperator({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        poll_station: req.body.poll_station,
        usertype: "poll Operator"
    });

    PollOperator.getUserByUsername(checkUsername, (err, user) => {
        if(err) throw err;
        if(user) {
            res.json({success: false, msg: 'Username already exists'});
        }else {
            PollOperator.addPo(newUser, (err, user) => {
                if (err) {
                    console.log(err);
                    res.json({success: false, msg: 'failed to register'});
                } else {
                    res.json({success: true, msg: ' registered'});
                }
            });
        }

    });
//adding the user to the database, invoking the encrypting functionality

});

router.post('/register_booth', (req, res, next) => {
    const checkBoothId = req.body.booth_id;
    let newUser = new Booth({
        booth_id: req.body.booth_id,
        poll_station: req.body.poll_station,
        password: req.body.password,
        letVote: false,
        usertype: "booth"
    });
//adding the user to the database, invoking the encrypting functionality
    Booth.getBoothByBoothId(checkBoothId, (err, booth) => {
        if(err) throw err;
        if(booth) {
            res.json({success: false, msg: 'Booth ID already exists. Assign another ID'});
        }else {
            Booth.addBooth(newUser, (err, booth) => {
                if (err) {
                    res.json({success: false, msg: 'failed to register'})
                } else {
                    res.json({success: true, msg: ' registered'})
                }
            });
        }

    });
    
});

router.post('/register_voter', (req, res, next) => {
    const checkvoter = req.body.nic;
    let newUser = new Voter({
        name: req.body.name,
        nic: req.body.nic,
        district: req.body.district,
        isVoted: false
    });

//adding the user to the database, invoking the encrypting functionality
    
    Voter.getVoterByNic(checkvoter, (err, user) => {
        if(err) throw err;
        if(user) {
            res.json({success: false, msg: 'The voter you are trying to register is already registered. Check again and re-enter the NIC'});
        }else {
            Voter.addVoter(newUser, (err, user) => {
                if (err) {
                    res.json({success: false, msg: 'failed to register'});
                } else {
                    res.json({success: true, msg: ' registered'})                             ;
                }
            });
        }

    });

    
});

router.post('/register_candidate', (req, res, next) => {
    const checkCandidate = req.body.nic;
    const checkCandidateNum = req.body.candidate_no;
    let newUser = new Candidate({
        name: req.body.name,
        nic: req.body.nic,
        party: req.body.party,
        candidate_no: req.body.candidate_no,
        email: req.body.email,
        votes: 0
    });

//adding the user to the database, invoking the encrypting functionality
    Candidate.getCandidateByNic(checkCandidate, (err, user) => {
        if(err) throw err;
        if(user) {
            res.json({success: false, msg: 'The candidate you are trying to register is already registered. Check again and re-enter the NIC'});
        }else {
            Candidate.getCandidateByNum(checkCandidateNum, (err, user) => {
                if(err) throw err;
                if(user) {
                    res.json({success: false, msg: 'The candidate number is already assigned. Submit another number'});
                }else {
                    Candidate.addCandidate(newUser, (err, user) => {
                        if (err) {
                            res.json({success: false, msg: 'failed to register'})
                        } else {
                            res.json({success: true, msg: ' registered'})
                        }
                    });
                }
            });
        }
    });
    

});
    

//sending a post request to authenticate by username and password
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    ElectionCommissioner.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: "user not found"});
        }
        ElectionCommissioner.comparePassword(password, user.password, (err, isMatch) => {
            //compare with the encrypted password
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: user}, config.secret, {  //create the token
                    expiresIn: 604800

                });
                //response to the front-end
                res.json({
                    success: true,
                    token: "JWT " + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        usertype: user.usertype
                    }
                });
            } else {
                return res.json({success: false, msg: "wrong password"});

            }

        });
    });

});

router.post('/authenticate_po', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    PollOperator.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: "user not found"});
        }
        PollOperator.comparePassword(password, user.password, (err, isMatch) => {
            //compare with the encrypted password
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: user}, config.secret, {  //create the token
                    expiresIn: 604800

                });
                //response to the front-end
                res.json({
                    success: true,
                    token: "JWT " + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        poll_station: user.poll_station,
                        usertype: user.usertype
                    }
                });
            } else {
                return res.json({success: false, msg: "wrong password"});

            }

        });
    });

});

router.post('/authenticate_voter', (req, res, next) => {
    const nic = req.body.nic;

    Voter.getVoterByNic(nic, (err, voter) => {
        if (err) throw err;
        if (!voter) {
            return res.json({success: false, msg: "Voter is not registered"});
        }

        if(voter.isVoted === false){
            return res.json({success: true, msg: "Voter " +voter.name+ " is Authenticated Successfully"});
        }
        if(voter.isVoted === true){
            return res.json({success: true, msg: "Voter " +voter.name+ " has already voted"});
        }
        
    });

});

router.post('/authenticate_booth', (req, res, next) => {
    const booth_id = req.body.booth_id;
    const password = req.body.password;

    Booth.getBoothByBoothId(booth_id, (err, booth) => {
        if (err) throw err;
        if (!booth) {
            return res.json({success: false, msg: "Booth not found"});
        }
        Booth.comparePassword(password, booth.password, (err, isMatch) => {
            //compare with the encrypted password
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: booth}, config.secret, {  //create the token
                    expiresIn: 604800

                });
                //response to the front-end
                res.json({
                    success: true,
                    token: "JWT " + token,
                    booth: {
                        id: booth._id,
                        booth_id: booth.booth_id,
                        poll_station: booth.poll_station
                    }
                });
            } else {
                return res.json({success: false, msg: "wrong password"});

            }

        });
    });

});

//profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

//booth
router.get('/booth_profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

router.get('/po_profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

router.get('/voter', function(req, res, next){
    Voter.find(function(err, voters){
        if (err) {
            res.send(err);
        } 
        res.json(voters);
        
    })
});

router.get('/candidate', function(req, res, next){
    Candidate.find(function(err, candidates){
        if (err) {
            res.send(err);
        } 
        res.json(candidates);
        
    })
});

router.delete('/voter/:id', function(req, res, next) {
    Voter.findByIdAndRemove(req.params.id, req.body, function(err, voter) {  
        // As always, handle any potential errors:
        if (err) return next(err);
        
        res.json(voter);
    });
});

router.post('/vote', function(req, res, next){
    const id = req.body.id;
    Candidate.update({candidate_no:id} , { $inc: { votes: 1 }}, function(err, candidate) {  
        // As always, handle any potential errors:
        if (err) return next(err);
        
        res.json({success: true});
    });
})

router.post('/mark_booth', function(req, res, next){
    const id = req.body.id;
    Booth.update({booth_id:id} , { $set: { letVote: false }}, function(err, booth) {  
        // As always, handle any potential errors:
        if (err) return next(err);
        
        res.json({success: true});
    });
})

router.delete('/candidate/:id', function(req, res, next) {
    Candidate.findByIdAndRemove(req.params.id, req.body, function(err, candidate) {  
        // As always, handle any potential errors:
        if (err) return next(err);
        
        res.json(candidate);
    });
  });


module.exports = router;