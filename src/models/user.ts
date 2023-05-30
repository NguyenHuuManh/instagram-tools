import { IgApiClient } from "instagram-private-api";
type cookieType = {
  key: string;
  path: string;
  value: string;
  domain: string;
  maxAge: number;
  secure: boolean;
  expires: string;
  creation: string;
  hostOnly: boolean;
  lastAccessed: string;
};

type paramLogin = {
  username: string;
  password: string;
  cookieSerialzed?: {
    version: string;
    storeType: string;
    rejectPublicSuffixes: boolean;
    cookies: cookieType[];
  };
};
const userModel = async ({
  username,
  password,
  cookieSerialzed,
}: paramLogin) => {
  let ig: IgApiClient;

  const login = async () => {
    ig = new IgApiClient();
    ig.state.generateDevice(username);
    const resLogin = await ig.account.login(username, password);
    if (resLogin.full_name) {
      const storeCookies = await ig.state.serializeCookieJar();
      return { resLogin, storeCookies };
    }
    throw resLogin;
  };

  const postContent = async (file: Buffer, caption: string) => {
    const result = await ig.publish.photo({ caption, file });
    return result;
  };

  const postVideo = async (
    video: Buffer,
    caption: string,
    coverImage: Buffer
  ) => {
    const result = await ig.publish.video({ caption, video, coverImage });
    return result;
  };

  const logout = async () => {
    try {
      const res = await ig.account.logout();
      return res;
    } catch (error) {
      return error;
    }
  };

  return { postContent, logout, login, username, password, postVideo };
};

export default userModel;
