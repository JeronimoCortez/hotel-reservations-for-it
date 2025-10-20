import { Router } from "express";
import { UserController } from "../controllers/UserController";


const userRouter = Router();

userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
userRouter.get("/", UserController.getAll);
userRouter.get("/:id", UserController.getById)

export default userRouter;