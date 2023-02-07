const fs = require("fs");

console.log(process.env.GOOGLE_CONFIG);
fs.writeFileSync(
	"./" + process.env.GOOGLE_CREDENTIALS_LOCATION ?? "secret/client_secret.json",
	process.env.GOOGLE_CONFIG
);
