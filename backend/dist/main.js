"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({ origin: 'http://localhost:5173' });
    await app.listen(5000);
    console.log('Servidor corriendo en puerto 5000');
}
void bootstrap();
//# sourceMappingURL=main.js.map