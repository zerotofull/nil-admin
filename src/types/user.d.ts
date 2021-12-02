import {AxiosResponse} from "axios";

export interface UserInfo {
    uid?: string,
    username?: string,
    role?: string
}

export interface ApiReturnData {
    success?: boolean,
    message?: string,
    data?: any,
    code?: number
}
export interface ApiReturn extends AxiosResponse<ApiReturnData>{
    data: ApiReturnData
}