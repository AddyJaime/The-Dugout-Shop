// importamos prisma para aca ya que es aqui que el service se va a encagar de habalr con la base de dato
import { prisma } from "../config/prisma";
import {
  CreateProfileInput,
  GetProfileInput,
  UpdateProfileInput,
} from "../types/profile.types";

// prisma por si solo no sabe como crear un usuario
// hay que especificalre el nombre del modelo

export const createProfile = async (profileData: CreateProfileInput) => {
  const profile = await prisma.user_profile.create({
    data: profileData,
  });

  return profile;
};
// buscar un perfil en la db
export const getProfile = async (input: GetProfileInput) => {
  const foundProfile = await prisma.user_profile.findUnique({
    where: {
      // Buscamos por keycloak_id porque es el único id que el frontend conoce (viene en el token).
      keycloak_id: input.keycloak_id,
    },
  });

  return foundProfile;
};

export const updateProfile = async (input: UpdateProfileInput) => {
  const { keycloak_id, ...rest } = input;
  const updateProfile = await prisma.user_profile.update({
    where: {
      keycloak_id: keycloak_id,
    },
    // aqui le decimos a prisma que update y ahi arriba que buscar
    data: rest,
  });
  return updateProfile;
};
