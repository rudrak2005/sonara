"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.NullableJsonNullValueInput = exports.SortOrder = exports.ListeningEventScalarFieldEnum = exports.QueueItemScalarFieldEnum = exports.SavedMusicItemScalarFieldEnum = exports.MusicItemScalarFieldEnum = exports.AlbumScalarFieldEnum = exports.ArtistScalarFieldEnum = exports.PasswordResetTokenScalarFieldEnum = exports.AuthSessionScalarFieldEnum = exports.SessionItemScalarFieldEnum = exports.SessionScalarFieldEnum = exports.UserPreferenceScalarFieldEnum = exports.ProfileScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.objectEnumValues.classes.DbNull,
    JsonNull: runtime.objectEnumValues.classes.JsonNull,
    AnyNull: runtime.objectEnumValues.classes.AnyNull,
};
exports.DbNull = runtime.objectEnumValues.instances.DbNull;
exports.JsonNull = runtime.objectEnumValues.instances.JsonNull;
exports.AnyNull = runtime.objectEnumValues.instances.AnyNull;
exports.ModelName = {
    User: 'User',
    Profile: 'Profile',
    UserPreference: 'UserPreference',
    Session: 'Session',
    SessionItem: 'SessionItem',
    AuthSession: 'AuthSession',
    PasswordResetToken: 'PasswordResetToken',
    Artist: 'Artist',
    Album: 'Album',
    MusicItem: 'MusicItem',
    SavedMusicItem: 'SavedMusicItem',
    QueueItem: 'QueueItem',
    ListeningEvent: 'ListeningEvent'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    status: 'status',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.ProfileScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    displayName: 'displayName',
    avatarUrl: 'avatarUrl',
    bio: 'bio',
    locale: 'locale',
    timezone: 'timezone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserPreferenceScalarFieldEnum = {
    userId: 'userId',
    autoAtmosphereEnabled: 'autoAtmosphereEnabled',
    atmosphereMode: 'atmosphereMode',
    personalizationEnabled: 'personalizationEnabled',
    pulseEnabled: 'pulseEnabled',
    memoryEnabled: 'memoryEnabled',
    discoveryLevel: 'discoveryLevel',
    aiAssistantEnabled: 'aiAssistantEnabled',
    reducedMotion: 'reducedMotion',
    privateSessionDefault: 'privateSessionDefault',
    onboardingCompleted: 'onboardingCompleted'
};
exports.SessionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    lastActivityAt: 'lastActivityAt',
    privateMode: 'privateMode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SessionItemScalarFieldEnum = {
    id: 'id',
    sessionId: 'sessionId',
    position: 'position',
    trackId: 'trackId',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    playedMs: 'playedMs',
    completed: 'completed'
};
exports.AuthSessionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt',
    lastUsedAt: 'lastUsedAt'
};
exports.PasswordResetTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
};
exports.ArtistScalarFieldEnum = {
    id: 'id',
    provider: 'provider',
    providerArtistId: 'providerArtistId',
    name: 'name',
    imageUrl: 'imageUrl',
    metadataJson: 'metadataJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.AlbumScalarFieldEnum = {
    id: 'id',
    provider: 'provider',
    providerAlbumId: 'providerAlbumId',
    artistId: 'artistId',
    title: 'title',
    releaseDate: 'releaseDate',
    artworkUrl: 'artworkUrl',
    metadataJson: 'metadataJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.MusicItemScalarFieldEnum = {
    id: 'id',
    provider: 'provider',
    providerTrackId: 'providerTrackId',
    title: 'title',
    artistId: 'artistId',
    albumId: 'albumId',
    durationMs: 'durationMs',
    releaseDate: 'releaseDate',
    genreData: 'genreData',
    audioFeaturesJson: 'audioFeaturesJson',
    artworkUrl: 'artworkUrl',
    metadataJson: 'metadataJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SavedMusicItemScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    musicItemId: 'musicItemId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.QueueItemScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    musicItemId: 'musicItemId',
    position: 'position',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ListeningEventScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    musicItemId: 'musicItemId',
    eventType: 'eventType',
    timestamp: 'timestamp',
    sessionId: 'sessionId',
    positionMs: 'positionMs',
    durationMs: 'durationMs',
    source: 'source',
    contextJson: 'contextJson',
    idempotencyKey: 'idempotencyKey',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map