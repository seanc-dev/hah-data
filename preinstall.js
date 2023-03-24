import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

fs.writeFileSync(
	"./" + process.env.GOOGLE_CREDENTIALS_LOCATION,
	process.env.GOOGLE_CONFIG
);
