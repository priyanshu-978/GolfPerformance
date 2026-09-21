import { Router, type IRouter } from "express";
import healthRouter from "./health";
import digitalHeroesRouter from "./digital-heroes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(digitalHeroesRouter);

export default router;
