import { Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";
import { IgApiClient } from "instagram-private-api";
// const { IgApiClient } = require("instagram-private-api");

type paramLogin = {
  username: string;
  password: string;
};
const userModel = async ({ username, password }: paramLogin) => {
  let ig: any;
  await (async () => {
    try {
      console.log(username, password, "=====username, password====");
      ig = new IgApiClient();
      ig.state.generateDevice(username);
      const resLogin = await ig.account.login(username, password);
      console.log(resLogin, "===resLogin===");
    } catch (error) {
      console.log(error, "====error login====");
    }
  })();

  const postContent = async (file: Buffer, caption: string) => {
    try {
      const result = await ig.publish.photo({ caption, file });
      return result;
    } catch (error: any) {
      console.log(error, "====err post content ===");
      return error;
    }
  };

  return { postContent };
};

export default userModel;
