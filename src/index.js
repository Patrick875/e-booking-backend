import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

// routers
import home from './routes/home';
import userRouter from './routes/api/users';
import roleRouter from './routes/api/roles';
import roomClass from './routes/api/roomClass';
import room from './routes/api/room';
import reservationRouter from './routes/api/reservation';
import productCategoryRouter from './routes/api/productCategory';
import productRouter from './routes/api/product';
import serviceCategoryRouter from './routes/api/serviceCategory';
import serviceRouter from './routes/api/services';
import packagesRouter from './routes/api/packages';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
// import {swaggerDocRouter} from './docs';
import db from "./models/index";

const app = express();
dotenv.config();

// Cross Origin Resource Sharing

app.use(cors());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', home);

app.use('/api/v1/roomclass', roomClass);
app.use('/api/v1/room', room);
app.use('/api/v1/reservation', reservationRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/products/category', productCategoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/services/category', serviceCategoryRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/packages', packagesRouter);

app.use('/api/v1/login', loginRouter);
app.use('/api/logout', logoutRouter);
// app.use(swaggerDocRouter);

app.all('*', (req, res) => {
  return  res.status(404).json({ "error": "404 Not Found" });
});

const PORT = process.env.PORT || 4000;
db.dbConnection;
db.sequelize.sync({ force: false }).then(async () => {
  console.log("DB synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export default app;