import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";


type ResType={
    data: MessageResponse;
    error?: undefined;
} | {
    data?: undefined;
    error: FetchBaseQueryError | SerializedError;
}
export const responseToast=(res:ResType,navigate:NavigateFunction|null,url:string)=>{
if("data" in res){
    if (res.data) {
        toast.success(res.data.message);
    }
}
if(navigate) navigate(url);
else {
    const error=res.error as FetchBaseQueryError;
    const messageResponse=error.data as MessageResponse;
    toast.error(messageResponse.message)
}
}

export const transformImage = (url: string, width = 200) => {
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
    return newUrl;
  };