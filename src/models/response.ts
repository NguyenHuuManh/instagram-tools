import { REPONSE_CODE } from "../constant";

type RESPONSE_TYPE<T = any> = {
  message?: string;
  code?: number;
  data?: T;
};
const ResponseModel = ({ code, message, data }: RESPONSE_TYPE) => ({
  code: code ?? REPONSE_CODE.SUCCESS,
  message: message ?? "Thành công",
  data: data ?? null,
});

export default ResponseModel;
