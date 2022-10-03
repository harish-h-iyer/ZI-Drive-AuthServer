require('dotenv').config();
const loader = require('@grpc/proto-loader');
const grpc = require('grpc');
const package = loader.loadSync('auth.proto', {});
const API = require('./services/BLogic/AuthService');
const object = grpc.loadPackageDefinition(package);
const mongoose = require("mongoose");
const authPackage = object.authPackage;

// Mongo Connection
const DB_Connections = process.env.DB_URI;

const mongooseOptions = { useUnifiedTopology: true };
let api = null;

async function connectDB() {
    try {
        let db = await mongoose.connect(DB_Connections, mongooseOptions);
        console.log("Connected successfully to mongo server");

        // Init api
        api = new API(db, grpc);
    } catch (e) {
        console.error(e);
    }
}

async function main() {
    await connectDB().catch(console.dir);
    let server = new grpc.Server();

    server.addService(authPackage.Auth.service, {
        "login": api.login,
        "logout": api.logout,
        "getToken": api.getToken
    });
    
    let address = process.env.HOST + ":" + process.env.PORT;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("Server running at " + address);
    });
}

main();