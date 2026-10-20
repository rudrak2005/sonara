"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyPolicyService = void 0;
const common_1 = require("@nestjs/common");
let PrivacyPolicyService = class PrivacyPolicyService {
    canPersonalize(preferences) {
        return preferences.personalizationEnabled;
    }
    canUsePulse(preferences) {
        return preferences.pulseEnabled;
    }
    canUseMemory(preferences) {
        return preferences.memoryEnabled;
    }
    canUseAiAssistant(preferences) {
        return preferences.aiAssistantEnabled;
    }
    shouldReduceMotion(preferences) {
        return preferences.reducedMotion;
    }
    shouldStartPrivate(preferences) {
        return preferences.privateSessionDefault;
    }
};
exports.PrivacyPolicyService = PrivacyPolicyService;
exports.PrivacyPolicyService = PrivacyPolicyService = __decorate([
    (0, common_1.Injectable)()
], PrivacyPolicyService);
//# sourceMappingURL=privacy-policy.service.js.map