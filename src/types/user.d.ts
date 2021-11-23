import {AxiosResponse} from "axios";

interface UserInfo {
    uid?: string,
    username?: string,
    role?: string
}

interface ApiReturnData {
    success?: boolean,
    message?: string,
    data?: any,
    code?: number
}
interface ApiReturn extends AxiosResponse<ApiReturnData>{
    data: ApiReturnData
}