interface Config {
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
}

export const config: Config = {
  SERVICE_NAME: require("../../package.json").name,
  PORT: Number(process.env.PORT) || 5001,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
