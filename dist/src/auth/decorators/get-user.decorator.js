"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user)
        throw new common_1.InternalServerErrorException('Missed user');
    if (data) {
        if ((0, class_validator_1.isArray)(data)) {
            let userData = {};
            data.forEach(param => {
                userData[param] = user[param];
            });
            return userData;
        }
        return user[data];
    }
    return user;
});
//# sourceMappingURL=get-user.decorator.js.map