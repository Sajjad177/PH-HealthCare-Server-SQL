import { Router } from "express";
import { userRouter } from "../Modules/user/user.routes";
import { adminRouter } from "../Modules/admin/admin.routes";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));


export default router;
