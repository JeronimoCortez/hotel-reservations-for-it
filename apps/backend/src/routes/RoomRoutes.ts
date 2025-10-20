import { Router } from "express";
import { RoomController } from "../controllers/RoomController";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { Roles } from "../../../../domain/src/types/Roles";


const roomRouter = Router();

roomRouter.get("/", RoomController.getAllRooms);
roomRouter.get("/:id", RoomController.getRoomById);

roomRouter.use(authenticate);
roomRouter.post("/", authorize(Roles.ADMIN), RoomController.createRoom);
roomRouter.put("/:id", authorize(Roles.ADMIN), RoomController.updateRoom);
roomRouter.delete("/:id", authorize(Roles.ADMIN), RoomController.deleteRoom);

export default roomRouter;