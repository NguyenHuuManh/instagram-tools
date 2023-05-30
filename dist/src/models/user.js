"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const instagram_private_api_1 = require("instagram-private-api");
const userModel = ({ username, password, cookieSerialzed, }) => __awaiter(void 0, void 0, void 0, function* () {
    let ig;
    const login = () => __awaiter(void 0, void 0, void 0, function* () {
        ig = new instagram_private_api_1.IgApiClient();
        ig.state.generateDevice(username);
        const resLogin = yield ig.account.login(username, password);
        if (resLogin.full_name) {
            const storeCookies = yield ig.state.serializeCookieJar();
            return { resLogin, storeCookies };
        }
        throw resLogin;
    });
    const postContent = (file, caption) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ig.publish.photo({ caption, file });
        return result;
    });
    const postVideo = (video, caption, coverImage) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ig.publish.video({ caption, video, coverImage });
        return result;
    });
    const logout = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield ig.account.logout();
            return res;
        }
        catch (error) {
            return error;
        }
    });
    return { postContent, logout, login, username, password, postVideo };
});
exports.default = userModel;
//# sourceMappingURL=user.js.map