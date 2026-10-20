"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicProviderError = void 0;
class MusicProviderError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "MusicProviderError";
        this.code = code;
        Object.setPrototypeOf(this, MusicProviderError.prototype);
    }
}
exports.MusicProviderError = MusicProviderError;
//# sourceMappingURL=provider.errors.js.map