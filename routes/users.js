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
const Party = require('../models/e_party');
const bcrypt = require('bcryptjs');


                                                        //Election Commissioner Routes
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
        if (err) throw err;
        if (user) {
            res.json({ success: false, msg: 'Username already exists' });
        } else {
            ElectionCommissioner.addEc(newUser, (err, user) => {
                if (err) {
                    console.log(err);
                    res.json({ success: false, msg: 'failed to register' });
                } else {
                    res.json({ success: true, msg: ' registered' });
                }
            });
        }

    });
    //adding the user to the database, invoking the encrypting functionality

});



router.post('/update_user', (req, res, next) => {
    const checkUser = req.body.username;
    const checkUserId = req.body.id;
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const id = req.body.id;




    ElectionCommissioner.getUserById(checkUserId, (err, user) => {
        if (err) throw err;
        if (user) {

            if (user.username == checkUser) {


                ElectionCommissioner.update({ _id: checkUserId }, { $set: { name: name, email: email } }, function (err, user) {

                    if (err) return next(err);

                    res.json({ success: true });
                });


            } else {
                ElectionCommissioner.getUserByUsername(checkUser, (err, user) => {
                    if (err) throw err;
                    if (user) {
                        res.json({ success: false, msg: 'The username you have entered is already assigned. Submit another username' });
                    } else {

                        ElectionCommissioner.update({ _id: checkUserId }, { $set: { name: name, email: email, username: username } }, function (err, user) {

                            if (err) return next(err);

                            res.json({ success: true });
                        });

                    }
                });
            }
        }
    });


});



router.post('/registerel', (req, res, next) => {

    let newUser = new Election({
        name: req.body.name,
        e_id: req.body.e_id,
        started: false,
        stopped: false,
        paused: false,
        new_election: false,
        can_release: false

    });

    Election.addel(newUser, (err, user) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'failed to register' });
        } else {
            res.json({ success: true, msg: ' registered' });
        }
    });
    //adding the user to the database, invoking the encrypting functionality

});


//register poll Operator
router.post('/register_po', (req, res, next) => {
    const checkUsername = req.body.username;
    const checkPollStation = req.body.poll_station;
    let newUser = new PollOperator({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        poll_station: req.body.poll_station,
        usertype: "poll Operator",
        assigned: false
    });

    PollOperator.getUserByUsername(checkUsername, (err, user) => {
        if (err) throw err;
        if (user) {
            res.json({ success: false, msg: 'Username already exists' });
        } else {
            PollOperator.getUserByStation(checkPollStation, (err, user) => {
                if (err) throw err;
                if (user) {
                    res.json({ success: false, msg: 'Poll station already exists' });
                } else {
                    PollOperator.addPo(newUser, (err, user) => {
                        if (err) {
                            console.log(err);
                            res.json({ success: false, msg: 'failed to register' });
                        } else {
                            res.json({ success: true, msg: ' registered' });
                        }
                    });
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
        if (err) throw err;
        if (booth) {
            res.json({ success: false, msg: 'Booth ID already exists. Assign another ID' });
        } else {
            Booth.addBooth(newUser, (err, booth) => {
                if (err) {
                    res.json({ success: false, msg: 'failed to register' })
                } else {
                    res.json({ success: true, msg: ' registered' })
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
        if (err) throw err;
        if (user) {
            res.json({ success: false, msg: 'The voter you are trying to register is already registered. Check again and re-enter the NIC' });
        } else {
            Voter.addVoter(newUser, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: 'failed to register' });
                } else {
                    res.json({ success: true, msg: ' registered' });
                }
            });
        }

    });


});

router.post('/register_party', (req, res, next) => {
    const checkparty = req.body.name;
    const checkpartyid = req.body.party_id;
    let newUser = new Party({
        name: req.body.name,
        party_id: req.body.party_id,
        votes: 0
    });

    //adding the user to the database, invoking the encrypting functionality

    Party.getPartyByName(checkparty, (err, user) => {
        if (err) throw err;
        if (user) {
            res.json({ success: false, msg: 'The party you are trying to register is already registered.' });
        } else {
            Party.getPartyByPartyId(checkpartyid, (err, user) => {
                if (err) throw err;
                if (user) {
                    res.json({ success: false, msg: 'Party Id is already assigned to another party.' });
                } else {
                    Party.addParty(newUser, (err, user) => {
                        if (err) {
                            res.json({ success: false, msg: 'failed to register' });
                        } else {
                            res.json({ success: true, msg: ' registered' });
                        }
                    });
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
        if (err) throw err;
        if (user) {
            res.json({ success: false, msg: 'The candidate you are trying to register is already registered. Check again and re-enter the NIC' });
        } else {
            Candidate.getCandidateByNum(checkCandidateNum, (err, user) => {
                if (err) throw err;
                if (user) {
                    res.json({ success: false, msg: 'The candidate number is already assigned. Submit another number' });
                } else {
                    Candidate.addCandidate(newUser, (err, user) => {
                        if (err) {
                            res.json({ success: false, msg: 'failed to register' })
                        } else {
                            res.json({ success: true, msg: ' registered' })
                        }
                    });
                }
            });
        }
    });


});

router.post('/update_candidate', (req, res, next) => {
    const checkCandidate = req.body.nic;
    const checkCandidateNum = req.body.candidate_no;
    const checkCandidateId = req.body.id;
    const name = req.body.name;
    const nic = req.body.nic;
    const party = req.body.party;
    const candidate_no = req.body.candidate_no;
    const id = req.body.id;

    Candidate.getCandidateById(checkCandidateId, (err, user) => {
        if (err) throw err;
        if (user) {
            if (user.candidate_no == checkCandidateNum) {
                if (user.nic == checkCandidate) {
                    Candidate.update({ _id: checkCandidateId }, { $set: { name: name, party: party } }, function (err, candidate) {
                        // As always, handle any potential errors:
                        if (err) return next(err);
                        res.json({ success: true });
                    });
                } else {
                    Candidate.getCandidateByNic(checkCandidate, (err, user) => {
                        if (err) throw err;
                        if (user) {
                            res.json({ success: false, msg: 'The NIC you are trying to uptade is already assigned to another candidate. Check again and re-enter the NIC' });
                        } else {
                            Candidate.update({ _id: checkCandidateId }, { $set: { name: name, party: party, nic: nic } }, function (err, candidate) {
                                if (err) return next(err);
                                res.json({ success: true });
                            });
                        }
                    });
                }
            } else if (user.nic == checkCandidate) {
                Candidate.getCandidateByNum(checkCandidateNum, (err, user) => {
                    if (err) throw err;
                    if (user) {
                        res.json({ success: false, msg: 'The candidate number is already assigned. Submit another number' });
                    } else {
                        Candidate.update({ _id: checkCandidateId }, { $set: { name: name, party: party, candidate_no: candidate_no } }, function (err, candidate) {
                            if (err) return next(err);
                            res.json({ success: true });
                        });
                    }
                });
            } else {
                Candidate.getCandidateByNum(checkCandidateNum, (err, user) => {
                    if (err) throw err;
                    if (user) {
                        res.json({ success: false, msg: 'The candidate number is already assigned. Submit another number' });
                    } else {
                        Candidate.getCandidateByNic(checkCandidate, (err, user) => {
                            if (err) throw err;
                            if (user) {
                                res.json({ success: false, msg: 'The NIC you are trying to update is already assigned to another candidate. Check again and re-enter the NIC' });
                            } else {
                                Candidate.update({ _id: checkCandidateId }, { $set: { name: name, party: party, nic: nic, candidate_no: candidate_no } }, function (err, candidate) {
                                    if (err) return next(err);
                                    res.json({ success: true });
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

router.post('/update_voter', (req, res, next) => {
    const checkVoter = req.body.nic;
    const checkVoterId = req.body.id;
    const name = req.body.name;
    const nic = req.body.nic;
    const district = req.body.district;
    const id = req.body.id;



    //adding the user to the database, invoking the encrypting functionality
    Voter.getVoterById(checkVoterId, (err, user) => {
        if (err) throw err;
        if (user) {
            if (user.nic == checkVoter) {
                Voter.update({ _id: checkVoterId }, { $set: { name: name, district: district } }, function (err, voter) {
                    if (err) return next(err);
                    res.json({ success: true });
                });
            } else {
                Voter.getVoterByNic(checkVoter, (err, user) => {
                    if (err) throw err;
                    if (user) {
                        res.json({ success: false, msg: 'The NIC number you have entered is already assigned. Submit another number' });
                    } else {
                        Voter.update({ _id: checkVoterId }, { $set: { name: name, district: district, nic: nic } }, function (err, voter) {
                            if (err) return next(err);
                            res.json({ success: true });
                        });
                    }
                });
            }
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
            return res.json({ success: false, msg: "user not found" });
        }
        ElectionCommissioner.comparePassword(password, user.password, (err, isMatch) => {
            //compare with the encrypted password
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, {  //create the token
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
                return res.json({ success: false, msg: "wrong password" });

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
            return res.json({ success: false, msg: "user not found" });
        }
        PollOperator.comparePassword(password, user.password, (err, isMatch) => {
            //compare with the encrypted password
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, {  //create the token
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
                return res.json({ success: false, msg: "wrong password" });

            }

        });
    });

});

router.post('/authenticate_voter', (req, res, next) => {
    const nic = req.body.nic;

    Voter.getVoterByNic(nic, (err, voter) => {
        if (err) throw err;
        if (!voter) {
            return res.json({ success: false, msg: "Voter is not registered" });
        }

        if (voter.isVoted === false) {
            return res.json({ success: true, msg: "Voter " + voter.nic + " is Authenticated Successfully" });
        }
        if (voter.isVoted === true) {
            return res.json({ success: true, msg: "Voter " + voter.nic + " has already voted" });
        }

    });

});

router.post('/authenticate_booth', (req, res, next) => {
    const booth_id = req.body.booth_id;
    const password = req.body.password;

    Booth.getBoothByBoothId(booth_id, (err, booth) => {
        if (err) throw err;
        if (!booth) {
            return res.json({ success: false, msg: "Booth not found" });
        }
        Booth.comparePassword(password, booth.password, (err, isMatch) => {
            //compare with the encrypted password
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: booth }, config.secret, {  //create the token
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
                return res.json({ success: false, msg: "wrong password" });

            }

        });
    });

});

//profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

//booth
router.get('/booth_profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

router.get('/po_profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

router.get('/voter', function (req, res, next) {
    Voter.find(function (err, voters) {
        if (err) {
            res.send(err);
        }
        res.json(voters);

    })
});

router.get('/candidate', function (req, res, next) {
    Candidate.find(function (err, candidates) {
        if (err) {
            res.send(err);
        }
        res.json(candidates);

    })
});

router.get('/admin', function (req, res, next) {
    ElectionCommissioner.find(function (err, admins) {
        if (err) {
            res.send(err);
        }
        
        res.json(admins);

    })
});

router.get('/party', function (req, res, next) {
    Party.find(function (err, parties) {
        if (err) {
            res.send(err);
        }
        res.json(parties);

    })
});

router.get('/poll_station', function (req, res, next) {
    PollOperator.find(function (err, poll_stations) {
        if (err) {
            res.send(err);
        }
        res.json(poll_stations);

    })
});


router.get('/access', function (req, res, next) {
    const id = "e01";
    Election.find({ e_id: id }, function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);

    })
});

router.delete('/voter/:id', function (req, res, next) {
    Voter.findByIdAndRemove(req.params.id, req.body, function (err, voter) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json(voter);
    });
});

router.post('/vote', function (req, res, next) {
    const id = req.body.id;
    const party = req.body.party;
    const e_id = "e01";
    if (id == null) {
        Election.update({ e_id: e_id }, { $inc: { rejected: 1 } }, function (err, election) {
            // As always, handle any potential errors:
            if (err) return next(err);

            res.json({ success: true });
        });
    } else {
        Candidate.update({ candidate_no: id }, { $inc: { votes: 1 } }, function (err, candidate) {
            // As always, handle any potential errors:
            if (err) return next(err);

            Party.update({ name: party }, { $inc: { votes: 1 } }, function (err, party) {
                // As always, handle any potential errors:
                if (err) return next(err);

                Election.update({ e_id: e_id }, { $inc: { total_votes: 1 } }, function (err, election) {
                    // As always, handle any potential errors:
                    if (err) return next(err);
    
                    res.json({ success: true });
                });
            });
        });
    }
})

router.post('/mark_booth_deactivate', function (req, res, next) {
    const id = req.body.id;
    Booth.update({ booth_id: id }, { $set: { letVote: false } }, function (err, booth) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})

router.post('/start_election', function (req, res, next) {
    const id = "e01";
    Election.update({ e_id: id }, { $set: { started: true } }, function (err, user) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})

router.post('/stop_election', function (req, res, next) {
    const id = "e01";
    Election.update({ e_id: id }, { $set: { started: false, stopped: true, } }, function (err, user) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})

router.post('/new_election', function (req, res, next) {
    const id = "e01";
    Election.update({ e_id: id }, { $set: { started: false, stopped: false, new_election: true, can_release: false } }, function (err, user) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})

router.post('/release_results', function (req, res, next) {
    const id = "e01";
    Election.update({ e_id: id }, { $set: { started: false, stopped: false, new_election: false, can_release: true } }, function (err, user) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})


router.post('/mark_booth_activate', function (req, res, next) {
    const id = req.body.id;
    Booth.update({ poll_station: id }, { $set: { letVote: true } }, function (err, booth) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})

router.post('/mark_voter', function (req, res, next) {
    const id = req.body.id;
    Voter.update({ nic: id }, { $set: { isVoted: true } }, function (err, booth) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})

router.post('/edit_el', function (req, res, next) {
    const id = "e01";
    const name = req.body.name;
    Election.update({ e_id: id }, { $set: { name: name } }, function (err, election) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})

router.post('/reset', function (req, res, next) {
    const id = "e01";
    Voter.updateMany({}, { $set: { isVoted: false } }, function (err, voter) {
        // As always, handle any potential errors:
        if (err) return next(err);
        Candidate.updateMany({}, { $set: { votes: 0 } }, function (err, candidate) {
            // As always, handle any potential errors:
            if (err) return next(err);

            Party.updateMany({}, { $set: { votes: 0 } }, function (err, party) {
                // As always, handle any potential errors:
                if (err) return next(err);

                Election.update({e_id: id}, { $set: { total_votes: 0 , rejected: 0} }, function (err, election) {
                    // As always, handle any potential errors:
                    if (err) return next(err);
    
                    res.json({ success: true });
                });
            });
        });

    });
})


router.post('/mark_poll', function (req, res, next) {
    const poll = req.body.poll_station;
    PollOperator.update({ poll_station: poll }, { $set: { assigned: true } }, function (err, poll) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json({ success: true });
    });
})

router.post('/change_pwd', function (req, res, next) {
    let newUser = new ElectionCommissioner({

        id: req.body.id,
        username: req.body.username,
        password: req.body.new_password,

    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            ElectionCommissioner.update({ username: newUser.username }, { $set: { password: hash } }, function (err, callback) {
                // As always, handle any potential errors:
                if (err) {
                    console.log(err);

                    res.json({ success: false, msg: 'failed to Change the Password' });
                } else {

                    res.json({ success: true, msg: ' Password Changed' });
                }
            });
        });
    });

})

router.delete('/candidate/:id', function (req, res, next) {
    Candidate.findByIdAndRemove(req.params.id, req.body, function (err, candidate) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json(candidate);
    });
});

router.delete('/admin/:id', function (req, res, next) {
    ElectionCommissioner.findByIdAndRemove(req.params.id, req.body, function (err, admin) {
        // As always, handle any potential errors:
        if (err) return next(err);

        res.json(admin);
    });
});


module.exports = router;