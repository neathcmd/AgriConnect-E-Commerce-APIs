import { Request, Response } from "express";
import { badRequestError } from "@/utils/helper/error-helper";
import { rolesModel } from "@/models/role-model";

export const createRoleService = async (req: Request, res: Response) => {
  try {
    const { name, des } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const existRole = await rolesModel.findOne({ name });
    if (existRole) {
      return res.status(400).json({ message: "THIS ROLE ALREADY EXIST" });
    }

    const newRole = await rolesModel.create({ name, des });

    res.status(201).json({
      message: "CREATED ROLE SUCCESSFULLY",
      data: newRole,
    });

  } catch (error: any) {
    console.error("createRoleService error:", error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
