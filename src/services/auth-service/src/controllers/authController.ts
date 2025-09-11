import logger from "../config/logger";
import ApiError from "../errors/ApiError";
import { grpcService } from "../services/grpc.service";
import { asyncHandler } from "../utils/asyncHandler";

interface UserResponse {
    id: string;
    name: string;
    email: string;
}

const authController = {
  login: asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required.");
    }

    const user = await grpcService.getUserByEmail(email) as UserResponse;

    return res.status(200).json({ 
      message: "Login successful", 
      metadata: user 
    });
  }),
};

export default authController;
