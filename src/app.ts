import express from "express";
import cors from 'cors';
import path from 'path';
const app = express();
const port = process.env.PORT || 8080; // default port to listen
console.log("Process env: ");
console.dir(process.env);
console.log("Dynamic port: " + process.env.PORT);
console.log("Port chosen: " + port);
// Serve static files from the React app
import { router as testAPIRouter } from './routes/testApi';
import { router as usersRouter } from './controllers/Users.controllers';
import { router as lettersRouter } from './controllers/Letters.controllers';

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
app.use("/users", usersRouter);
app.use("/letters", lettersRouter);

// start the Express server
app.listen( port, () => {
    console.log( `server listening on port:${ port }` );
} );

module.exports = app;
