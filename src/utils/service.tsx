import Utils from "../utils";
const getApiCall = (endPoint: string, paramsData: string = "", successCallback: Function, errorCalback: Function) => {
    console.log("endPoint", endPoint + paramsData);
    Utils.Constant.axiosInstance.get("http://app.totall.in/webservice/webservice.php" + endPoint + paramsData, {

    }).then((response: any) => {
        console.log(response);
        successCallback(response);
    }).catch((error: any) => {
        console.log(error.response)
        if (error.code === "ECONNABORTED") {
            let payload = {
                data: {
                    statusCode: 408
                }
            }
            errorCalback(payload);
        }
        else if (error.response) {

            errorCalback(error.response)
        }
        else if (!error.response) {
            let payload = {
                data: {
                    statusCode: ""
                }
            }
            errorCalback(payload);
        }
    })
}


export default{
    getApiCall,
}


