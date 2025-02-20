import settings from "#config/settings.js";

export const authenticateApiKey = (req, res, next) => {
	const apiKey = req.headers["x-api-key"];
	if (!apiKey || !settings.API_KEYS.has(apiKey)) {
		return res.status(403).json({ error: "Unauthorized: Invalid API Key" });
	}
	next();
};
