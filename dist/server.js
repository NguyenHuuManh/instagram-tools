"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routers_1 = __importDefault(require("./src/routers"));
const middleware_1 = require("./src/controllers/middleware");
var multer = require("multer");
var multer = multer();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// app.use(upload.array());
app.use(express_1.default.static("public"));
app.use(middleware_1.LogRequest);
app.use("/", routers_1.default);
app.use(middleware_1.errorHandler);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = server;
// "start": "tsc && nodemon --exec  node dist/server.js"
//# sourceMappingURL=server.js.map