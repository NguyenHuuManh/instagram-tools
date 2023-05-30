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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulePost = exports.getStatusAccount = exports.loginWithCookies = exports.deleteAccount = exports.getListAccount = exports.autoPostOnAccount = exports.LoginAccount = void 0;
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const connectdb_1 = require("../../connectdb");
const constant_1 = require("../../constant");
const response_1 = __importDefault(require("../../models/response"));
const user_1 = __importDefault(require("../../models/user"));
const cron = require("node-cron");
const path = require("path");
const pathUpload = "../.././../upload";
const clients = new Map();
// export const postContent = async (req: Request, res: Response) => {
//   try {
//     const { path, mimetype } = req.file as Express.Multer.File;
//     let fileBuffer = await fs.promises.readFile(path as any);
//     const isJPG = mimetype == "image/jpg";
//     if (!isJPG) fileBuffer = await sharp(path).jpeg().toBuffer();
//     // console.log(fileBuffer, "===fileBuffer====");
//     const captionTxt = req.body.caption;
//     const result = await ig.publish.photo({
//       caption: captionTxt,
//       file: fileBuffer,
//     });
//     // console.log(result, "===result===");
//     res.json(result);
//   } catch (error: any) {
//     // console.log(error, "====err===");
//     res.json(error?.error ?? error);
//   }
// };
const LoginAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_1.default)(req.body);
        const resLogin = yield user.login();
        const sql = `INSERT INTO social.account ( username, password, cookies) VALUES ('${user.username}', '${user.password}', '${JSON.stringify(resLogin.storeCookies)}');`;
        (0, connectdb_1.excuteQuery)(sql, (ressult) => {
            console.log(ressult, "===result====");
            res.json({ code: "200", message: "Thêm mới thành công" });
        });
    }
    catch (error) {
        next(error);
    }
});
exports.LoginAccount = LoginAccount;
const autoPostOnAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_1.default)(req.body);
        // const file = req.file as Express.Multer.File;
        const caption = req.body.caption;
        const filenames = fs_1.default.readdirSync(path.resolve(__dirname, pathUpload));
        console.log(filenames, "====filenames===");
        const files = [];
        let error = [];
        const promises = filenames.map((pathName) => __awaiter(void 0, void 0, void 0, function* () {
            const filePath = path.resolve(__dirname, path.join(pathUpload, pathName));
            const file = fs_1.default.readFileSync(filePath);
            const fileJpg = yield (0, sharp_1.default)(file).jpeg().toBuffer();
            files.push(fileJpg);
            return user.postContent(fileJpg, caption);
        }));
        console.log(files, "===files===");
        Promise.all(promises).then((results) => {
            console.log(results, "results===");
            res.json(results);
        });
        // user.postContent(file, caption, { onError: res.json, onSuccess: res.json });
    }
    catch (error) {
        next(error);
    }
});
exports.autoPostOnAccount = autoPostOnAccount;
const getListAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = "SELECT username, password,cookies FROM social.account";
        (0, connectdb_1.excuteQuery)(sql, (result) => {
            res.json((0, response_1.default)({ data: result }));
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getListAccount = getListAccount;
const deleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const sql = `DELETE FROM social.account WHERE idaccount=${id};`;
        (0, connectdb_1.excuteQuery)(sql, (result) => {
            if (result.affectedRows > 0) {
                res.json((0, response_1.default)({ message: "Xóa tài khoản thành công" }));
                return;
            }
            res.json((0, response_1.default)({
                message: "Tài khoản không tồn tại",
                code: constant_1.REPONSE_CODE.FAILD,
            }));
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAccount = deleteAccount;
const loginWithCookies = (req, res, next) => {
    try {
        const id = req.body.id;
        const sql = `SELECT * from social.account where idaccount=${id}`;
        (0, connectdb_1.excuteQuery)(sql, (results) => __awaiter(void 0, void 0, void 0, function* () {
            if (results.length > 0) {
                const { username, password } = results[0];
                const user = yield (0, user_1.default)({
                    username,
                    password,
                });
                const restoreLogin = yield user.login();
                clients.set(`${id}`, user);
                res.json((0, response_1.default)({ message: "Đăng nhập thành công", data: restoreLogin }));
                return;
            }
            res.json((0, response_1.default)({
                message: "Không tìm thấy tài khoản với id:" + id,
                code: constant_1.REPONSE_CODE.FAILD,
            }));
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.loginWithCookies = loginWithCookies;
const getStatusAccount = (req, res, next) => {
    var _a;
    try {
        const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        const account = clients.get(`${id}`);
        if (account) {
            res.json((0, response_1.default)({ data: { status: "ONLINE" } }));
        }
        else {
            res.json((0, response_1.default)({ data: { status: "OFFLINE" } }));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getStatusAccount = getStatusAccount;
const schedulePost = (req, res, next) => {
    try {
        const cronJob = cron.schedule("* * * * *", () => {
            console.log("==========task running=====");
        });
        cronJob.start();
        res.json((0, response_1.default)({ message: "Đặt lịch thành công" }));
    }
    catch (error) {
        next(error);
    }
};
exports.schedulePost = schedulePost;
//# sourceMappingURL=index.js.map