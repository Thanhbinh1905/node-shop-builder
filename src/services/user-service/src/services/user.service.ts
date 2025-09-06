import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../protos/user';
import path from 'path';


const PROTO_PATH = path.join(__dirname, '../protos/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const users = [
    { id: '1', name: 'Alice', email: 'alice@example.com', password: '123456' },
    { id: '2', name: 'Bob', email: 'bob@example.com', password: '123456' },
];


const userProto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;

const getUserByEmail = (call: any, callback: any) => {
    const user = users.find(u => u.email === call.request.email);
    if (user) {
        callback(null, user);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            message: 'User not found',
        });
    }
};

export const createUserService = () => {
    const server = new grpc.Server();
    server.addService(userProto.user_package.UserService.service, {
        GetUserByEmail: getUserByEmail,
    });
    return server;
};