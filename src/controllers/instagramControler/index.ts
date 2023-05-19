import { Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";
const path = require("path");
import userModel from "../../models/user";
const pathUpload = "../.././../upload";

// const { IgApiClient } = require("instagram-private-api");

// const ig = new IgApiClient();
// // { password: "123aA@123", username: "HaDN123aA" }
// export const loginIstagram = async (req: Request, res: Response) => {
//   const { username, password } = req.body;
//   ig.state.generateDevice(username);
//   const response = await ig.account.login(username, password);
//   res.json(response);
// };

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

export const autoPostOnAccount = async (req: Request, res: Response) => {
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
    console.log(error, "====error===");
  }
};
