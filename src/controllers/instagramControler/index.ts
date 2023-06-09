import { NextFunction, Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";
import { excuteQuery } from "../../connectdb";
import { REPONSE_CODE } from "../../constant";
import ResponseModel from "../../models/response";
import userModel from "../../models/user";
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
export const LoginAccount = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const user = await userModel(req.body);
    const resLogin: any = await user.login();
    const sql = `INSERT INTO social.account ( username, password, cookies) VALUES ('${
      user.username
    }', '${user.password}', '${JSON.stringify(resLogin.storeCookies)}');`;
    excuteQuery(sql, (ressult) => {
      console.log(ressult, "===result====");
      res.json({ code: "200", message: "Thêm mới thành công" });
    });
  } catch (error) {
    next(error);
  }
};

export const autoPostOnAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel(req.body);
    // const file = req.file as Express.Multer.File;
    const caption = req.body.caption;
    const filenames = fs.readdirSync(path.resolve(__dirname, pathUpload));
    console.log(filenames, "====filenames===");
    const files: Buffer[] = [];
    let error: any[] = [];
    const promises = filenames.map(async (pathName) => {
      const filePath = path.resolve(__dirname, path.join(pathUpload, pathName));
      const file = fs.readFileSync(filePath);
      const fileJpg = await sharp(file).jpeg().toBuffer();
      files.push(fileJpg);
      return user.postContent(fileJpg, caption);
    });
    console.log(files, "===files===");
    Promise.all(promises).then((results) => {
      console.log(results, "results===");
      res.json(results);
    });

    // user.postContent(file, caption, { onError: res.json, onSuccess: res.json });
  } catch (error: any) {
    next(error);
  }
};

export const getListAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sql = "SELECT username, password,cookies FROM social.account";
    excuteQuery(sql, (result) => {
      res.json(ResponseModel({ data: result }));
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM social.account WHERE idaccount=${id};`;
    excuteQuery(sql, (result) => {
      if (result.affectedRows > 0) {
        res.json(ResponseModel({ message: "Xóa tài khoản thành công" }));
        return;
      }
      res.json(
        ResponseModel({
          message: "Tài khoản không tồn tại",
          code: REPONSE_CODE.FAILD,
        })
      );
    });
  } catch (error) {
    next(error);
  }
};

export const loginWithCookies = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.body.id;
    const sql = `SELECT * from social.account where idaccount=${id}`;
    excuteQuery(sql, async (results) => {
      if (results.length > 0) {
        const { username, password } = results[0];
        const user = await userModel({
          username,
          password,
        });
        const restoreLogin = await user.login();
        clients.set(`${id}`, user);
        res.json(
          ResponseModel({ message: "Đăng nhập thành công", data: restoreLogin })
        );
        return;
      }
      res.json(
        ResponseModel({
          message: "Không tìm thấy tài khoản với id:" + id,
          code: REPONSE_CODE.FAILD,
        })
      );
    });
  } catch (error) {
    next(error);
  }
};

export const getStatusAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params?.id;
    const account = clients.get(`${id}`);
    if (account) {
      res.json(ResponseModel({ data: { status: "ONLINE" } }));
    } else {
      res.json(ResponseModel({ data: { status: "OFFLINE" } }));
    }
  } catch (error) {
    next(error);
  }
};

export const schedulePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cronJob = cron.schedule("* * * * *", () => {
      console.log("==========task running=====");
    });
    cronJob.start();
    res.json(ResponseModel({ message: "Đặt lịch thành công" }));
  } catch (error) {
    next(error);
  }
};
