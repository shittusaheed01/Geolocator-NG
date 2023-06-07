import * as dotenv from "dotenv";

dotenv.config();

interface Config {
	PORT: Number;
	MONGO_URI: string;
	DB_NAME: string;
	DBLOCAL: string;
}

interface ENV {
  // NODE_ENV: string | undefined;
  PORT: number | undefined;
  MONGO_URI: string | undefined;
  DB_NAME: string | undefined;
  DBLOCAL: string | undefined;
}


// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    // NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME: process.env.DB_NAME,
    DBLOCAL: process.env.DB_LOCAL,
  };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;

