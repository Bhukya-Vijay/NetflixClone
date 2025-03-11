import express from 'express'
import { authCheck, Login, Logout, SignUp, Subscribe } from '../controllers/user.js';
import { protectedRoute } from '../middleware/protectedRoute.js';



const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/subscribe", protectedRoute, Subscribe)

router.get("/authCheck", protectedRoute, authCheck)


/* router.route("/register").post(Register)
router.route("/login").post(Login)
router.route("/logout").get(Logout) */

export default router