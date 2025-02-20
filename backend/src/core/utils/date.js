export const createTimestamp = () => {
	return new Date().toISOString().replace(/\D/g, "").slice(0, 14);
};
