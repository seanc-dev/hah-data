import fs from "fs";

fs.writeFileSync(
	"./" + process.env.GOOGLE_CREDENTIALS_LOCATION ?? "secret/client_secret.json",
	process.env.GOOGLE_CONFIG ?? ""
);
