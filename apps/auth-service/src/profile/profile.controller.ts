// el controller es el layer entre http y la base de datos, en otros proyectos tengo un fodler separado para el serivce que habla con la base de dato pero aqwui lo vmaos a poner todo junti

// el controller solo maneja HTTP (extraer params, responder con status codes
import { Request, Response, NextFunction } from "express";
