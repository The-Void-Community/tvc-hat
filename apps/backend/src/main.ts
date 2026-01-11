import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { init as initSentry, consoleLoggingIntegration } from "@sentry/nestjs";
import { ValidationPipe } from "@nestjs/common";

import { json, urlencoded } from "express";

import cookieParser = require("cookie-parser");

import Session from "./app/session.app";
import AppModule from "./app.module";

import { env } from "f@/env";

import { networkInterfaces } from "os"
const nets = networkInterfaces();
const results: {
  [key: string]: string[]
} = {}
for (const name of Object.keys(nets)) {
  if (!nets[name]) {
    continue;
  }

  for (const net of nets[name]) {
    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
    if (net.family !== familyV4Value || net.internal) {
      continue;
    }

    if (!results[name]) {
      results[name] = [];
    }
    results[name].push(net.address);
  }
}

initSentry({
  dsn: env.SENTRY_URL,
  tracesSampleRate: 1.0,
  integrations: [
    consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  enableLogs: true,
});

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: [env.CLIENT_URL], credentials: true },
  });

  new Session(env.SESSION_SECRET, app).create();

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("API documentation")
    .setDescription("API documentation")
    .setVersion("1.0")
    .addTag("api")
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, documentFactory);

  await app.listen(env.PORT);
  console.log("http://localhost:"+env.PORT);
  console.log(Object.keys(results).flatMap(key => results[key].map(hostname => key + ": http://"+hostname+":"+env.PORT)).join("\n"));
})();
