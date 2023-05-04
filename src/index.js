import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';


// routers
import home from './routes/home';
import userRouter from './routes/api/users';
import roleRouter from './routes/api/roles';
import roomClass from './routes/api/roomClass';
import room from './routes/api/room';
import reservationRouter from './routes/api/reservation';
import customersRouter from './routes/api/customer'
import productCategoryRouter from './routes/api/productCategory';
import productRouter from './routes/api/product';
import serviceCategoryRouter from './routes/api/serviceCategory';
import serviceRouter from './routes/api/services';
import packagesRouter from './routes/api/packages';
import stockItemRoutter from './routes/api/stockItems';
import hallRouter  from './routes/api/halls';
import hallService from './routes/api/hallServices'
import purchaseOrderRoutes from './routes/api/stockPurchaseOrder'
import stockReceiveVoucherRoutes  from './routes/api/stockReceiveVoucher';
import currencyRoutes from './routes/api/currency'
import petitStockOrderRoutes  from './routes/api/petitStockOrder'
import petitStockRoutes from './routes/api/petitStock'
import petitTableRoutes from './routes/api/tables'
import cashFlowRouters from './routes/api/cashFolows'
import chartRoutes from './routes/api/chat'
import dailySalesRoutes from './routes/api/dailyCashes'
import reportsRoutes from './routes/api/reports'
import bonDoCommandRoutes from './routes/api/bonDeCommand'
import deliveryNoteRoutes from './routes/api/deliveryNote'
import constantsRouters from './routes/api/constants';


import loginRouter from './routes/login';
import resetRouter from './routes/resetPassword'
import logoutRouter from './routes/logout';
import refresh from './routes/refresh';

import verifyJWT from './middleware/verifyJWT'
import croneJob from './jobs/fetchCurrency'

// import {swaggerDocRouter} from './docs';
import db from "./models";

const app = express();
dotenv.config();

// Cross Origin Resource Sharing
app.use(cors());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware for cookies
app.use(cookieParser());

// crone Job

app.use('/', home);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/reset', resetRouter);
app.use('/api/v1/refresh',refresh)


// app.use('/api/v1/users/add/admin', req.body.email.includes('admin'), './')

app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/users', userRouter);

app.use(verifyJWT)

// reports 
app.use('/api/v1/reports',reportsRoutes)

app.use('/api/v1/roomclass', roomClass);
app.use('/api/v1/room', room);
app.use('/api/v1/halls', hallRouter)
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/reservation', reservationRouter);
app.use('/api/v1/products/category', productCategoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/services/category', serviceCategoryRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/packages', packagesRouter);
app.use('/api/v1/stock/item', stockItemRoutter);
app.use('/api/v1/hall/services', hallService);
app.use('/api/v1/purchase/order', purchaseOrderRoutes);
app.use('/api/v1/receive/voucher', stockReceiveVoucherRoutes);
app.use('/api/v1/petitstock/order', petitStockOrderRoutes)
app.use('/api/v1/petit-stock', petitStockRoutes )
app.use('/api/v1/tables', petitTableRoutes )

app.use('/api/v1/constants', constantsRouters )


app.use('/api/v1/cashflow', cashFlowRouters)
app.use('/api/v1/chats', chartRoutes )
app.use('/api/v1/daily-sales', dailySalesRoutes)

app.use('/api/v1/bonDeCommand', bonDoCommandRoutes)
app.use('/api/v1/deliveryNote', deliveryNoteRoutes)

app.use('/api/v1/currency', currencyRoutes);

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
  croneJob.start()
  // croneJob.stop();
});

export default app;   