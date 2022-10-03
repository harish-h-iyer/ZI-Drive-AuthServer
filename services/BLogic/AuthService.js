const bcrypt = require('bcrypt');
const tokenModel = require("../../models/TokenModel");
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
            var messageObj = {
                message: "Incomplete Data Recieved While Creating User."
            }
            callback(null, messageObj);
        }else{

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
                            var tokenObject = new tokenModel(tokenDto.generateTokenObject(response, token));

                            tokenObject.save(tokenObject, function(error, result){
                                if(error){
                                    var message = {
                                        message: error
                                    }

                                    callback(null, message);
                                }else{
                                    callback(null, tokenObj);
                                }
                            });
                        }else{
                            var errorRes = {
                                message: "Invalid Usename/Password"
                            }
                            callback(null, errorRes);
                        }
                    }
                })

            });
        }
    }

    logout = (call, callback) => {
        var data = call.request.token;
        console.log(data);
        var query = {
            token: data
        };
        tokenModel.findOneAndDelete(query, function(error, foundToken){
            if(error){
                callback(null, error);
            }else{
                console.log(foundToken);
                var messageObj = {
                    message: "User Logged out successfully"
                }
                callback(null, messageObj);
            }
        })
    }

    getToken = (call, callback) => {
        var data = call.request.token;
        console.log(data);
        var query = {
            token: data
        };
        tokenModel.findOne(query, function(error, foundToken){
            if(error){
                callback(null, error);
            }else{
                console.log(foundToken);
                var messageObj = {
                    message: foundToken
                }
                callback(null, messageObj);
            }
        })
    }
};