import * as dotenv from "dotenv";

dotenv.config();

interface Config {
	PORT: Number;
	MONGO_URI: string;
	DBNAME: string;
	DBLOCAL: string;
  REDIS_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_USERNAME: string;
}

interface ENV {
  // NODE_ENV: string | undefined;
  PORT: number | undefined;
  MONGO_URI: string | undefined;
  DBNAME: string | undefined;
  DBLOCAL: string | undefined;
  REDIS_PASSWORD: string | undefined;
  REDIS_HOST: string | undefined;
  REDIS_PORT: number | undefined;
  REDIS_USERNAME: string | undefined;
}


// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI,
    DBNAME: process.env.DB_NAME,
    DBLOCAL: process.env.DB_LOCAL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
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

