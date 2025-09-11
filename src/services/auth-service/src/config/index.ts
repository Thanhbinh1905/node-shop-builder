interface Config {
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  ALLOWED_ORIGINS: string;
}

export const config: Config = {
  SERVICE_NAME: require("../../package.json").name,
  PORT: Number(process.env.PORT) || 5001,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:5000',
};
