"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackEventDto = exports.LISTENING_EVENT_TYPES = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.LISTENING_EVENT_TYPES = [
    "PLAY_STARTED",
    "PLAY_COMPLETED",
    "SKIPPED",
    "PAUSED",
    "REPLAYED",
    "SAVED",
    "UNSAVED",
    "SEARCHED",
    "QUEUED",
    "TAPE_ADDED",
    "MEMORY_ADDED",
    "RECOMMENDATION_ACCEPTED",
    "RECOMMENDATION_REJECTED",
];
class TrackEventDto {
}
exports.TrackEventDto = TrackEventDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TrackEventDto.prototype, "musicItemId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string"
        ? value.trim().toUpperCase()
        : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.LISTENING_EVENT_TYPES),
    __metadata("design:type", String)
], TrackEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TrackEventDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(86_400_000),
    __metadata("design:type", Number)
], TrackEventDto.prototype, "positionMs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(86_400_000),
    __metadata("design:type", Number)
], TrackEventDto.prototype, "durationMs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], TrackEventDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TrackEventDto.prototype, "contextJson", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string"
        ? value.trim()
        : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], TrackEventDto.prototype, "idempotencyKey", void 0);
//# sourceMappingURL=track-event.dto.js.map