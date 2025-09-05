import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GetUserByEmailRequest as _user_package_GetUserByEmailRequest, GetUserByEmailRequest__Output as _user_package_GetUserByEmailRequest__Output } from './user_package/GetUserByEmailRequest';
import type { User as _user_package_User, User__Output as _user_package_User__Output } from './user_package/User';
import type { UserServiceClient as _user_package_UserServiceClient, UserServiceDefinition as _user_package_UserServiceDefinition } from './user_package/UserService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  user_package: {
    GetUserByEmailRequest: MessageTypeDefinition<_user_package_GetUserByEmailRequest, _user_package_GetUserByEmailRequest__Output>
    User: MessageTypeDefinition<_user_package_User, _user_package_User__Output>
    UserService: SubtypeConstructor<typeof grpc.Client, _user_package_UserServiceClient> & { service: _user_package_UserServiceDefinition }
  }
}

