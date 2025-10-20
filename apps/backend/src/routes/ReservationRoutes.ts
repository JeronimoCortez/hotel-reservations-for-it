import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { Roles } from "../../../../domain/src/types/Roles";
import { ReservationController } from "../controllers/ReservationController";


const reservationRouter = Router();

reservationRouter.use(authenticate);

reservationRouter.get("/", authorize(Roles.ADMIN), ReservationController.listAll);
reservationRouter.get("/user/:userId", ReservationController.listByUser);
reservationRouter.post("/", ReservationController.create);
reservationRouter.put("/confirm/:id", ReservationController.confirm);
reservationRouter.put("/cancel/:id", ReservationController.cancel);

export default reservationRouter;