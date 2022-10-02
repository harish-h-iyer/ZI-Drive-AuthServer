const grpc = require('grpc');
const loader = require('@grpc/proto-loader');
const package = loader.loadSync('auth.proto', {});
const object = grpc.loadPackageDefinition(package);
const authPackage = object.authPackage;

const client  = new authPackage.Auth('localhost:5001', grpc.credentials.createInsecure())


const email = process.argv[2];
const password = process.argv[3];

const token = process.argv[2];


// client.login({email: email, password: password}, (error, response)=> {
//     console.log("Error: ", error);
//     console.log("Response: ", response);
// })


client.logout({token: token}, (error, response)=> {
    console.log("Error: ", error);
    console.log("Response: ", response);
})