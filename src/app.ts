import express from "express";
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 8080; // default port to listen
console.log("Process env: ");
console.dir(process.env);
console.log("Dynamic port: " + process.env.PORT);
console.log("Port chosen: " + port);

// Serve static files from the React app
import { router as testAPIRouter } from './routes/testApi';
import { router as usersRouter } from './controllers/users.controllers';
import { router as lettersRouter } from './controllers/Letters.controllers';
import { router as authRouter } from './controllers/Auth.controllers';

// app.use(bodyParser.json());
// fixes request payload too large error
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.use(express.static(path.join(__dirname, '../build')));
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.get( "/bye", (req, res) => {
	const x: number = 10;
	res.send( "Bye world!" + x);
});

app.use("/testAPI", testAPIRouter);

app.use("/auth", authRouter);

/*
* Any your preceded by /api/v1 indicates an authenticated route
* The controller for these routes should contain the line to work correctly
* router.use(AuthModule.verifyUser);
*/
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/letters", lettersRouter);

// start the Express server
app.listen( port, () => {
    console.log( `server listening on port:${ port }` );
} );

module.exports = app;
