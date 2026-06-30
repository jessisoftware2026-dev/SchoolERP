import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true })
  );

  // Allow the configured web origins AND any of their tenant subdomains.
  // WEB_ORIGIN may be a comma-separated list of base URLs, e.g.:
  //   http://localhost:3000,http://192.168.1.110.nip.io:3000
  const rawOrigins = process.env.WEB_ORIGIN ?? "http://localhost:3000";
  const allowedHosts = rawOrigins
    .split(",")
    .map((o) => {
      try { return new URL(o.trim()).host; } catch { return null; }
    })
    .filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl / server-to-server
      try {
        const host = new URL(origin).host;
        const ok = allowedHosts.some(
          (h) => host === h || host.endsWith(`.${h}`)
        );
        return cb(null, ok);
      } catch {
        return cb(null, false);
      }
    },
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Jessi ERP API")
    .setDescription("Core School Management ERP backend")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, doc);

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port, "0.0.0.0");
  // eslint-disable-next-line no-console
  console.log(`Jessi ERP API running on http://localhost:${port} (docs: /docs)`);
}

bootstrap();
