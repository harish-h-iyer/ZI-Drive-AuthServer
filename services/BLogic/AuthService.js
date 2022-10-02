const bcrypt = require('bcrypt');
const userModel = require("../../models/TokenModel");
const commonUtils = require("../../utils/CommonUtils");
const tokenDto = require("../DataTransfer/TokenDto");
const userClient = require("../../userClient");
const tokenService = require("../BLogic/TokenService");


module.exports = class API {
    constructor(db, grpc) {
        this.db = db;
        this.grpc = grpc;
    }

    login = (call, callback) => {
        var data = call.request;
        if (!commonUtils.checkEmptyFieldValue(data.email) || !commonUtils.checkEmptyFieldValue(data.password)){
            console.log("Incomplete Data Recieved While Creating User.");
            callback(null, response);
        }else{

            var query = {
                email: data.email
            };

            userClient.getUserDetails(data.email, function(response){
                console.log("Hi", response);

                bcrypt.compare(data.password, response.password, (error, result) => {
                    if(error){
                        var errorRes = {
                            message: error
                        }
                        callback(null, errorRes);
                    }else{
                        if(result){
                            var userObj = tokenDto.generateUserObject(response);
                            var token = tokenService.generateToken(userObj);
                            var tokenObj = {
                                message: token
                            }
                            callback(null, tokenObj);
                        }else{
                            var errorRes = {
                                message: "Invalid Usename/Password"
                            }
                            callback(null, errorRes);
                        }
                    }
                })

            });

            // userModel.findOne(query, function(error, foundUser){
            //     if(error){
            //         callback(null, error);
            //     }else{
            //         console.log(foundUser);
            //         if(foundUser){
            //         }else {
            //             return callback({
            //                 code: this.grpc.status.UNAUTHENTICATED,
            //                 message: "No user found",
            //             });
            //         }
            //     }
            // })
        }
    }

    readUser = (call, callback) => {
        var data = call.request;
        console.log(data);
        var query = {
            email: data.email
        };
        userModel.findOne(query, function(error, foundUser){
            if(error){
                callback(null, error);
            }else{
                console.log(foundUser);
                callback(null, foundUser);
            }
        })
    }
};