import { dbConnect } from "#config/db.js";
import settings from "#config/settings.js";
import routers from "#routers/index.js";
import express from "express";

const app = express();
app.use(express.json());

const startServer = async () => {
	try {
		await dbConnect();
		const port = process.env.PORT || 4000;
		app.get("/heartbeat", (req, res) => {
			res.send({
				status: "ok"
			});
		});

		app.use(settings.API_PREFIX, routers);
		app.use((err, req, res, next) => {
			console.error(err.stack);
			res.status(500).json({
				error: err.message,
				stack: process.env.NODE_ENV === "development" ? err.stack : undefined
			});
		});

		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (err) {
		console.error("Server failed to start:", err);
		process.exit(1);
	}
};

startServer();
