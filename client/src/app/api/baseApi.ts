import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

const customBaseQuery = fetchBaseQuery({
    baseUrl: "https://localhost:5001/api",
    credentials: "include"
});

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

type ErrorResponse = | string | {title: string} | {errors: string[]}

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi,
     extraOptions: object) => {
        api.dispatch(startLoading());
        await sleep();
        const result = await customBaseQuery(args, api, extraOptions);
        api.dispatch(stopLoading());
        //stop Loading
        if (result.error) {
            // Handle unauthorized error
            const originalError = result.error.status === 'PARSING_ERROR' && result.error.originalStatus 
            ? result.error.originalStatus : result.error.status;
            
            const reponseData = await result.error.data as ErrorResponse;
            switch (originalError) {
                case 400:
                    if (typeof reponseData === 'string') toast.error(reponseData);
                    else if ('errors' in reponseData) 
                    {
                        throw Object.values(reponseData.errors).flat().join(', ');
                    }
                    else toast.error(reponseData.title);
                    break;
                case 401:
                    if (typeof reponseData === 'object' && 'title' in reponseData) {
                        toast.error(reponseData.title);
                    }
                    break;
                case 404:
                    if (typeof reponseData === 'object' && 'title' in reponseData) {
                        router.navigate('/not-found');
                    }
                    break;
                case 500:
                    if (typeof reponseData === 'object' && 'title' in reponseData) {
                        router.navigate('/server-error', {state: {error: reponseData}});
                    }  
                    else toast.error('Internal Server Error');
                    break;
                default:
                    break;
            }
        }

        return result;
    }