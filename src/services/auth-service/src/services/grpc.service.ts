import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import logger from '../config/logger';

// Load the proto definition for the user service from the shared api folder
const USER_PROTO_PATH = path.join(__dirname, '../protos/user.proto');
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const userProto: any = grpc.loadPackageDefinition(userPackageDefinition);
const UserService = userProto.user_package.UserService;

// Create a new gRPC client instance
const userServiceClient = new UserService(
    'localhost:9002', // Address and port of the user service server
    grpc.credentials.createInsecure()
);

const getUserByEmail = (email: string) => {
    return new Promise((resolve, reject) => {
        userServiceClient.GetUserByEmail({ email }, (error: any, response: any) => {
            if (error) {
                logger.error('Error calling User Service:', error);
                return reject(error);
            }
            logger.log('Received response from User Service:', response);
            resolve(response);
        });
    });
};

export const grpcService = {
    getUserByEmail
} 