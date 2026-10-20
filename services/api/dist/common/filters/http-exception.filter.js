"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const incomingRequestId = request.headers["x-request-id"];
        const requestId = typeof incomingRequestId ===
            "string" &&
            incomingRequestId.length > 0
            ? incomingRequestId
            : (0, node_crypto_1.randomUUID)();
        const status = exception instanceof
            common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let code = "INTERNAL_SERVER_ERROR";
        let message = "Internal server error";
        if (exception instanceof
            common_1.HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse ===
                "string") {
                message =
                    exceptionResponse;
            }
            else if (typeof exceptionResponse ===
                "object" &&
                exceptionResponse !== null) {
                const data = exceptionResponse;
                if (Array.isArray(data.message)) {
                    message =
                        data.message.join(", ");
                }
                else if (data.message) {
                    message =
                        data.message;
                }
                if (data.error) {
                    code =
                        data.error
                            .toUpperCase()
                            .replaceAll(" ", "_");
                }
                else {
                    code = `HTTP_${status}`;
                }
            }
        }
        const payload = {
            success: false,
            error: {
                code,
                message,
                requestId,
            },
        };
        response
            .status(status)
            .json(payload);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map