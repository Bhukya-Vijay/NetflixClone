import express from 'express'
import cookieParser from 'cookie-parser'
import databaseConnection from './utils/database.js'

import userRoute from './Routes/userRoute.js'
import movieRoutes from "./Routes/movie.route.js"
import tvRoutes from './Routes/tv.route.js'
import searchRoutes from './Routes/search.route.js'
import paymentRoute from './Routes/paymentRouter.js'
import cors from 'cors'

import { ENV_VARS } from './config/envVars.js';
import { protectedRoute } from './middleware/protectedRoute.js'




const PORT = ENV_VARS.PORT


const app = express();
// middlewares
// app.use(express.urlencoded({ extended: true }))
app.use(express.json()); // will allow us to parse req.body
app.use(cookieParser())


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/movie", protectedRoute, movieRoutes);
app.use("/api/v1/tv", protectedRoute, tvRoutes);
app.use("/api/v1/search", protectedRoute, searchRoutes);
app.use("/api/v1/subscribe", protectedRoute, paymentRoute)





app.listen(PORT, () => {
    console.log("server listen at http://localhost:" + PORT)
    databaseConnection();
});


