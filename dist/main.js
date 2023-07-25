"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const transform_interceptor_1 = require("./transform.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger();
    const port = 7777;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    await app.listen(port);
    logger.log(`Application listining on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map