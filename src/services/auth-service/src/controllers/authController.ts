import ApiError from "../errors/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const authController = {
  login: asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required.");
    }

    return res.status(200).json({ message: "Login successful" });
  }),
};

export default authController;
