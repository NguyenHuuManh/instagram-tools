"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../constant");
const ResponseModel = ({ code, message, data }) => ({
    code: code !== null && code !== void 0 ? code : constant_1.REPONSE_CODE.SUCCESS,
    message: message !== null && message !== void 0 ? message : "Thành công",
    data: data !== null && data !== void 0 ? data : null,
});
exports.default = ResponseModel;
//# sourceMappingURL=response.js.map