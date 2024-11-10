import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { name, email, photo, gender, _id, dob } = req.body;

    // Validate required fields
    if (!name || !email || !gender || !dob) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Ensure `dob` is a valid date
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for 'dob'",
      });
    }

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: dateOfBirth,
    });

    // Send success response
    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  } catch (error: any) {
    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
