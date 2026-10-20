"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListeningEventType = exports.DiscoveryLevel = exports.AtmosphereMode = exports.UserRole = exports.UserStatus = void 0;
exports.UserStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    DELETED: 'DELETED'
};
exports.UserRole = {
    USER: 'USER',
    ADMIN: 'ADMIN'
};
exports.AtmosphereMode = {
    OFF: 'OFF',
    AUTO: 'AUTO',
    MANUAL: 'MANUAL'
};
exports.DiscoveryLevel = {
    LOW: 'LOW',
    BALANCED: 'BALANCED',
    HIGH: 'HIGH'
};
exports.ListeningEventType = {
    PLAY_STARTED: 'PLAY_STARTED',
    PLAY_COMPLETED: 'PLAY_COMPLETED',
    SKIPPED: 'SKIPPED',
    PAUSED: 'PAUSED',
    REPLAYED: 'REPLAYED',
    SAVED: 'SAVED',
    UNSAVED: 'UNSAVED',
    SEARCHED: 'SEARCHED',
    QUEUED: 'QUEUED',
    TAPE_ADDED: 'TAPE_ADDED',
    MEMORY_ADDED: 'MEMORY_ADDED',
    RECOMMENDATION_ACCEPTED: 'RECOMMENDATION_ACCEPTED',
    RECOMMENDATION_REJECTED: 'RECOMMENDATION_REJECTED'
};
//# sourceMappingURL=enums.js.map