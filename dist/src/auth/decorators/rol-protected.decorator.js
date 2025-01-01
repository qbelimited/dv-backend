"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolProtected = exports.META_ROLES = void 0;
const common_1 = require("@nestjs/common");
exports.META_ROLES = 'role';
const RolProtected = (...args) => {
    return (0, common_1.SetMetadata)(exports.META_ROLES, args);
};
exports.RolProtected = RolProtected;
//# sourceMappingURL=rol-protected.decorator.js.map