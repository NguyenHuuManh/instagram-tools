import { NextFunction, Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";
import { excuteQuery } from "../../connectdb";
import userModel from "../../models/user";
import { json } from "body-parser";
const path = require("path");
const pathUpload = "../.././../upload";

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
    const sql = "SELECT username, password FROM social.account";
    const result: any = await excuteQuery(sql);
    Object.keys(result).forEach(function (key) {
      var row = result[key];
      console.log(row, "=====name===");
    });

    res.json({ message: "success" });
    // res.send(result);
  } catch (error) {
    next(error);
  }
};
