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
exports.excuteQuery = void 0;
const mysql_1 = __importDefault(require("mysql"));
// Tạo kết nối
const pool = mysql_1.default.createPool({
    host: "localhost",
    user: "root",
    // password: "123aA@123", // Thay đổi tùy theo mật khẩu của MySQL của bạn
    password: "nhm090899",
    database: "social", // Thay đổi tùy theo tên cơ sở dữ liệu bạn muốn kết nối
});
const excuteQuery = (sql, callback) => __awaiter(void 0, void 0, void 0, function* () {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error("Lỗi khi kết nối: " + err.stack);
            return;
        }
        connection.query(sql, (error, results) => {
            if (error) {
                console.error("excute faild: " + error.stack);
                throw error;
            }
            callback === null || callback === void 0 ? void 0 : callback(results);
        });
        // Khi không cần thiết nữa, hãy giải phóng kết nối
        connection.release();
    });
});
exports.excuteQuery = excuteQuery;
exports.default = pool;
//# sourceMappingURL=index.js.map