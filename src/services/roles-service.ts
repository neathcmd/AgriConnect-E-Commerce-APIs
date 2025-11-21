import { badRequestError } from "@/utils/helper/error-helper";
import { rolesModel } from "@/models/role-model";

export const createRoleService = async (name: string, des?: string) => {
  
  if (!name?.trim()) {
    throw badRequestError("Role name is required");
  }

  const existRole = await rolesModel.findOne({ name: name.trim() });
  if (existRole) {
    throw badRequestError("This role already exists");
  }

  const newRole = await rolesModel.create({
    name: name.trim(),
    des: des || "",
  });

  return newRole;
};