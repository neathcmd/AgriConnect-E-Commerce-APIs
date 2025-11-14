import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { UserModel } from "../models/user-model";
import bcrypt from "bcrypt";

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ Database connected");

        const {
            PASSWORD_ADMIN,
            FULL_NAME_ADMIN,
            USER_NAME_ADMIN,
            EMAIL_ADMIN,
            PHONE_ADMIN
        } = process.env;

        // Check if admin exists
        const existingAdmin = await UserModel.findOne({ email: EMAIL_ADMIN });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists. Skipping seed.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(PASSWORD_ADMIN!, 10);

        // Create admin user
        await UserModel.create({
            full_name: FULL_NAME_ADMIN,
            user_name: USER_NAME_ADMIN,
            email: EMAIL_ADMIN,
            password: hashedPassword,
            phone: PHONE_ADMIN,
            role: "ADMIN",
        });

        console.log("🎉 Admin user seeded successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seedAdmin();
