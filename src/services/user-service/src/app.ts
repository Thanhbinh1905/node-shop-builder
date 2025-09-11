import dotenv from 'dotenv';
import * as grpc from '@grpc/grpc-js';
import { createUserService } from './services/user.service';

dotenv.config();
const GRPC_PORT = process.env.GRPC_PORT || '0.0.0.0:9002';

const server = createUserService();

server.bindAsync(GRPC_PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Error while start User Service GRPC:', err);
    } else {
        console.log(`User Service GRPC is working on PORT: ${port}`);
    }
});