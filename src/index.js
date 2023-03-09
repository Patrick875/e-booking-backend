import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

// routers
import home from './routes/home';
// import userRouter from './routes/api/users';
// import registerRouter from './routes/register';
import loginRouter from './routes/login';
// import logoutRouter from './routes/logout';
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

// app.use('/api/auth/register', registerRouter);
app.use('/api/auth/login', loginRouter);
// app.use('/api/auth/logout', logoutRouter);
// app.use('/api/users', userRouter);
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