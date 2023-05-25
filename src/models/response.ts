import { REPONSE_CODE } from "../constant";

type RESPONSE_TYPE<T = any> = {
  message?: string;
  code?: number;
  data?: T;
};
const ResponseModel = ({ code, message, ...rest }: RESPONSE_TYPE) => ({
  code: code ?? REPONSE_CODE.SUCCESS,
  message: message ?? "Thành công",
  ...rest,
});

export default ResponseModel;
