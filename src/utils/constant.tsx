import { Platform, Dimensions } from "react-native";
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
const $http = axios.create({
    baseURL: "http://app.totall.in/webservice/webservice.php",
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    },
    
});

export const Constant = {
   isIos:  Platform.OS === "ios" ,
   axiosInstance: $http,
   vh: Dimensions.get('window').height,
   vw:  Dimensions.get('window').width,
   deviceId: DeviceInfo.getDeviceId()

}