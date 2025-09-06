// Original file: src/protos/user.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetUserByEmailRequest as _user_package_GetUserByEmailRequest, GetUserByEmailRequest__Output as _user_package_GetUserByEmailRequest__Output } from './GetUserByEmailRequest';
import type { User as _user_package_User, User__Output as _user_package_User__Output } from './User';

export interface UserServiceClient extends grpc.Client {
  GetUserByEmail(argument: _user_package_GetUserByEmailRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_user_package_User__Output>): grpc.ClientUnaryCall;
  GetUserByEmail(argument: _user_package_GetUserByEmailRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_user_package_User__Output>): grpc.ClientUnaryCall;
  GetUserByEmail(argument: _user_package_GetUserByEmailRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_user_package_User__Output>): grpc.ClientUnaryCall;
  GetUserByEmail(argument: _user_package_GetUserByEmailRequest, callback: grpc.requestCallback<_user_package_User__Output>): grpc.ClientUnaryCall;
  getUserByEmail(argument: _user_package_GetUserByEmailRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_user_package_User__Output>): grpc.ClientUnaryCall;
  getUserByEmail(argument: _user_package_GetUserByEmailRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_user_package_User__Output>): grpc.ClientUnaryCall;
  getUserByEmail(argument: _user_package_GetUserByEmailRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_user_package_User__Output>): grpc.ClientUnaryCall;
  getUserByEmail(argument: _user_package_GetUserByEmailRequest, callback: grpc.requestCallback<_user_package_User__Output>): grpc.ClientUnaryCall;
  
}

export interface UserServiceHandlers extends grpc.UntypedServiceImplementation {
  GetUserByEmail: grpc.handleUnaryCall<_user_package_GetUserByEmailRequest__Output, _user_package_User>;
  
}

export interface UserServiceDefinition extends grpc.ServiceDefinition {
  GetUserByEmail: MethodDefinition<_user_package_GetUserByEmailRequest, _user_package_User, _user_package_GetUserByEmailRequest__Output, _user_package_User__Output>
}
