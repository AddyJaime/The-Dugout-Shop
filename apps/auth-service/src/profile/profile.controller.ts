// el controller es el layer entre http y la base de datos, en otros proyectos tengo un fodler separado para el serivce que habla con la base de dato pero aqwui lo vmaos a poner todo junti

// el controller solo maneja HTTP (extraer params, responder con status codes
import { Request, Response, NextFunction } from "express";
import { createProfile, getProfile, updateProfile } from "./profile.service";
import { CreateProfileInput } from "../types/profile.types";

export const createProfileHandler = async (req: Request, res: Response) => {
  try {
    const {
      keycloak_id,
      favorite_team_id,
      shipping_street,
      shipping_apt,
      shipping_city,
      shipping_state,
      shipping_zip,
    } = req.body;

    // tengo que crear el objecto que se le va enviar a service porque eso es lo que espera
    const input = {
      keycloak_id,
      favorite_team_id,
      shipping_street,
      shipping_apt,
      shipping_city,
      shipping_state,
      shipping_zip,
    };

    const profile = await createProfile(input);

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfileHandler = async (req: Request, res: Response) => {
  try {
    // middleware mete
    //  el payload en req.user, controller lo saca con
    // req.user?.sub.
    const keycloak_id = req.user!.sub;

    // getprofile espera un objecto, no un string por eso le pasmos el
    // objecto creado  con keycloak_id: Lo envuelves en un objeto:
    const input = { keycloak_id };

    const profile = await getProfile(input);

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Internal error " });
  }
};

export const updateProfileHandler = async (req: Request, res: Response) => {
  try {
    const keycloak_id = req.user!.sub;
    const {
      favorite_team_id,
      shipping_street,
      shipping_apt,
      shipping_city,
      shipping_state,
      shipping_zip,
    } = req.body;

    const input = {
      keycloak_id,
      favorite_team_id,
      shipping_street,
      shipping_apt,
      shipping_state,
      shipping_city,
      shipping_zip,
    };

    const profileUpdate = await updateProfile(input);

    res.status(200).json(profileUpdate);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
