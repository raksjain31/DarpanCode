import axios from "axios";
export const getJudge0LangaugeId = (Language) => {

    const languageMap = {
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63,
    }

    return languageMap[Language.upperCase()];
}

const sleep =(ms)=> new Promise((resolve) => setTimeout(resolve,ms))

export const pollBatchResults = async (tokens)=>{
    while(true){

      const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
        param:{
            tokens: tokens.join(","),
            base64_encoded: false,
        }
      })

      const  results = data.submissions;

      const isallDone = results.every(
            (r)=> r.status.id !== 1 && r.status.id !== 2
        )
        
        if(isallDone) return results
        await sleep(1000)

    }

}
    

export const submitBatch = async (submissions)=> {
    const {data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/?base64_encoded=false&wait=false`,{
        submissions
    }) 

    console.log("Submission Results : ",data)
    return data //{token},{token}....
}