import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import usersRoutes from "./server/routes/usersRoutes.js";
import articlesRoutes from "./server/routes/articlesRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(morgan('dev'))

app.use((req, res, next)=>{
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Origin, Accept, Authorization")
	if(req.method === "OPTIONS"){
		res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE, GET")
		return res.status(200).json({})
	} 
	next()
})

app.use("/api/v1/auth", usersRoutes);
app.use("/api/v1", articlesRoutes);

// home page
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Teamwork API',
  });
});

app.use((req, res, next)=>{
	res.sendStatus(404);
});

app.use((err, req, res, next)=>{
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: req.app.get("env") === "development" ? err : {}
	})
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});
export default app;