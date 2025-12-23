import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";

const customBaseQuery = fetchBaseQuery({
    baseUrl: "https://localhost:5001/api",
});

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi,
     extraOptions: object) => {
        api.dispatch(startLoading());
        await sleep();
        const result = await customBaseQuery(args, api, extraOptions);
        api.dispatch(stopLoading());
        //stop Loading
        if (result.error && result.error.status === 401) {
            // Handle unauthorized error
            const {status, data} = result.error;
            console.error(`Error ${status}: ${data}`);
            // Redirect to login page or perform other actions
        }

        return result;
    }