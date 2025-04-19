import { Router } from "express";
import { userRouter } from "../Modules/user/user.routes";
import { adminRouter } from "../Modules/admin/admin.routes";
import { authRouter } from "../Modules/auth/auth.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user0",
    router: userRouter,
  },
  {
    path: "/admin",
    router: adminRouter,
  },
  {
    path: "/auth",
    router: authRouter,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));


export default router;
