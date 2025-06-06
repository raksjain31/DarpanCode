import {create} from  "zustand"
import {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast";

export const useExecutionStore = create((set)=>({
    isExecuting: false,
    submission:null,

executeCode:async(source_code, language_id,stdin,expected_outputs,problemsId)=>{

    try {
        set({isExecuting:true});
        console.log("Submission:",JSON.stringify({
            source_code,
            language_id,
            stdin,
            expected_outputs,
            problemsId
        }));

        const res = await axiosInstance.post("/execute-code",{source_code, language_id,stdin,expected_outputs,
            problemsId});
            set({submission:res.data.submission})
            toast.success(res.data.message)

    } catch (error) {
        console.log("Error in executing code",error);
        toast.error("Error in executing code")
    }
}



}))


