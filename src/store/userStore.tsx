import Utils from "../utils";
import { observable, action, computed } from 'mobx';
import gql from 'graphql-tag';
//@ts-ignore
import io from 'socket.io-client';
import { userDataModal } from "./models/index";
import { persist } from 'mobx-persist';
import DropdownAlert from "../component/dropDownAlert";
import { Navigation } from "react-native-navigation";
import { handleNavigationPush } from "../utils/navigationHandler";
import moment from "moment";
import Store from "./index";
//@ts-ignore
import BackgroundTimer from 'react-native-background-timer';
//import Toast from 'react-native-simple-toast';
import Toast from 'react-native-simple-toast';
import { Alert } from "react-native";



class UserStore {
    @observable playlist: Array<any> = [];
    @observable isLoading: boolean = false;
    @persist @observable userName: string = "";
    @persist @observable userPhone: string = "";
    
    @observable appState: string = "";
    @observable hasSocketLogin: boolean = false;
    @observable hasNetworkConnection: boolean = false;
    @observable hasSocketConnection: boolean = false;
    @persist('object', userDataModal) @observable userData = new userDataModal();

    @persist('object') @observable question: any = {};
    @observable disConnectionCounter: any = 0;
    public socket: any = {};
    public backgroundTimeCalculator: any = null;
    @observable currentScreenName: string = ""
    @observable currentComponentId: string = ""
    @observable welcomeComponentId: string = ""
    @observable questionComponentId: string = ""
    @observable selectedOption: number = -1;
    //private phoneRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    private phoneRegex =/^\d{10}$/;
    private nameRegex = /^[a-zA-Z. ]{1,30}$/
    private appCloseCounter: number = 0;
    public manualClose: boolean = false;
    
    @action getPlayList = async () => {

        Utils.client.query({
            query: gql`
              {
                playlist {
                        name,
                        songs {
                            title
                        }
                        
                    }
                
              }
            `
        })

            .then(data => console.log(data))
            .catch(error => console.log(error.message));

        //console.log(query);
    }
    @action doLogin = (dropdown: DropdownAlert) => {

        if (!this.userName) {
            dropdown.alertWithType('error', "User name is required");
        }else if(!this.nameRegex.test(this.userName)){
            dropdown.alertWithType('error', "User name should be alphabetic");
        }
        else if (!this.userPhone) {
            dropdown.alertWithType('error', "Mobile number is required");
        }  
        else if (!this.phoneRegex.test(this.userPhone)) {
            dropdown.alertWithType('error', "Mobile number is not valid");
        } else {
            if (!this.hasNetworkConnection) {
                dropdown.alertWithType('info', "Check network connection");
                return false;
            }
            this.isLoading = true;
            const URL = `?method=new_login&username=${this.userName}&device=${Utils.Constant.deviceId}&device_token=${1234567}&password=${this.userPhone}&lecture_done_count=1`;
            Utils.service.getApiCall(
                URL,
                ``,
                (response: any) => {
                    this.isLoading = false;
                    if (response.data.success) {
                        console.log("Appstet question Question", response.data)
                        this.userData = response.data;
                        Store.userStore.hasSocketLogin = true;
                        this.resetStack(this.currentComponentId, Utils.Screen.welcome);
                        this.manualClose = false;
                    }
                },
                (errorResponse: any) => {
                    this.isLoading = false;
                }
            )
        }

    }
    @action handleLogOut = (componentId: string, dropdown: DropdownAlert, callback: Function) => {

        if (!this.hasNetworkConnection) {
            dropdown.alertWithType('info', "Check network connection");
            return false;
        }
        this.isLoading = true;
        const URL = `?method=logout&user_id=${this.userData.user_id}`;

        Utils.service.getApiCall(
            URL,
            ``,
            (response: any) => {
                this.isLoading = false;
                if (response.data.success) {
                    this.manualClose = true;
                    Store.userStore.socket.emit("disconnect");
                    Store.userStore.socket.disconnect();
                    this.userData = new userDataModal()
                    callback();
                    this.hasSocketLogin = false;
                    this.resetStack(componentId, Utils.Screen.login)

                }
            },
            (errorResponse: any) => {
                this.isLoading = false;
                this.userData = new userDataModal()
            }
        )
    }

    // @action doConnection = () => {
    //     console.log("doConnection is called")
    //     this.socket = io.connect(
    //         'http://app.totall.in:4001',
    //         {
    //             transports: ['websocket'],
    //             // autoConnect: true,
    //             // reconnection: true,
    //             // reconnectionAttempts: Infinity,
    //             //forceNew: true,
    //         });


    //     this.socket.on("connection", function () {
    //         console.warn("connection")
    //     })
    //     this.socket.on("onQuestionFire", (question: any) => {
    //         console.log("onQuestionFire", question)
    //         this.question = question
    //     });
    //     this.socket.on('disconnected', () => {
    //         console.log("disconnected")
    //         this.disConnectionCounter = this.disConnectionCounter++;
    //         this.socket.connect()
    //     });
    // }

    backgroundLogout = ()=>{
        const URL = `?method=logout&user_id=${this.userData.user_id}`;

        Utils.service.getApiCall(
            URL,
            ``,
            (response: any) => {
                this.isLoading = false;
                if (response.data.success) {
                    Store.userStore.socket.emit("disconnect")
                    this.userData = new userDataModal()
                    this.hasSocketLogin = false;
                    

                }
            },
            (errorResponse: any) => {
                this.isLoading = false;
                this.userData = new userDataModal()
            })
    }
    @action doConnection = () => {
        socketHandler();
    }
    resetStack = (componentId: string, screenName: string) => {
        Navigation.setStackRoot(componentId, {
            component: {
                name: screenName,
                options: {
                    animations: {

                    }
                }
            }
        });
    }

    @action handleAppState = (nextAppState: any) => {
        console.log("nextAppState",nextAppState)
        if (this.appState.match(/inactive|background/) && nextAppState === "active") {
            this.appCloseCounter =0;
            if (Object.keys(this.question).length > 0) {
                let question = this.question;
                //question.total_timer = 1000;
                let serverTime = moment(question.datetime).utc().format()
                let localTime = moment().utc().format()
                let timePassed = moment(localTime).diff(serverTime, 'seconds');
                let remainingTime = question.total_timer - timePassed;
                console.log("Appstet question Question", Store.userStore.question)
                if (this.currentScreenName !== 'question' && this.userData.user_id) {
                    if (remainingTime > 0 && Store.userStore.currentScreenName === 'welcome') {
                       
                        handleNavigationPush(this.currentComponentId, Utils.Screen.question)
                    }
                }
                else if (this.currentScreenName === 'question') {
                    if (remainingTime < 1) {
                        this.question = {};
                        console.log("handleAppState"),
                        BackgroundTimer.stopBackgroundTimer(),
                        Navigation.popToRoot(this.questionComponentId );
                    }
                }
            }
        }else if(nextAppState === "background"){
            // this.appCloseCounter++;
            // console.log("appCloseCounter", this.appCloseCounter);
            // console.log("appState", this.appState);
            // if((this.appState.match(/background/) && this.appCloseCounter === 2) || (this.appState.match(/inactive/) && this.appCloseCounter === 1)){
            //     console.log("app close event fired");
            //     this.backgroundLogout();
            // }
            
            //Store.userStore.hasSocketLogin = false;
            // this.socket.emit("disconnect")
            // this.hasSocketLogin = false;
            // this.userData = new userDataModal()
            // this.hasSocketLogin = false;
            // this.resetStack(Store.userStore.currentComponentId, Utils.Screen.login)
    
        }
        this.appState = nextAppState;
    }

    @action calculate = () => {
        let question = this.question;
        let serverTime = moment(question.datetime).utc().format()
        let localTime = moment().utc().format()
        let timePassed = moment(localTime).diff(serverTime, 'seconds');
        let remainingTime = question.total_timer - timePassed;
        if (remainingTime > 0) {
            this.decrementClock(remainingTime);
        }
        else {
            Toast.show('Sorry out of time', Toast.SHORT);
            this.question = {};
            this.currentScreenName = "welcome";
            console.log("calculate")
            BackgroundTimer.stopBackgroundTimer(),
            Navigation.popToRoot(this.questionComponentId)
        }
    }

    @action decrementClock = (remainingTime: any) => {
        if (remainingTime > 0) {
            this.question.remainingTime = remainingTime;
            this.question = Object.assign({}, this.question);
            this.question.options = Array.from(this.question.options)
            BackgroundTimer.stopBackgroundTimer(),
            BackgroundTimer.runBackgroundTimer(() => {
                let currentId = this.currentComponentId;
                this.question.remainingTime = this.question.remainingTime === 0 ? 
               
                (
                this.question = Object.assign({}, this.question),
                !this.appState.match(/inactive|background/) && this.currentScreenName != "welcome" ? (
                    this.currentScreenName = "welcome",
                    this.currentComponentId= this.welcomeComponentId,
                    console.log("decrement", this.questionComponentId),
                    BackgroundTimer.stopBackgroundTimer(),
                    this.question = {},
                    Navigation.popToRoot(this.questionComponentId)) : 
                    this.currentScreenName = "welcome",this.currentComponentId= this.welcomeComponentId,
                    !this.appState.match(/inactive|background/) ? Toast.show('Sorry out of time', Toast.SHORT) : null
                ) 
                : this.question.remainingTime - 1, this.question = Object.assign({}, this.question);
                
            }, 1000)
        }
    }

    @action replyAnswer = (selectedOption: number, dropdown: DropdownAlert) => {

        if (!this.hasNetworkConnection) {
            dropdown.alertWithType('info', "Check network connection");
            return false;
        }
        const answer = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'j', 'K', 'L']

        const URL = `?method=user_answer&lecture_id=${
            this.question.lecture_id
            }&question_id=${this.question.question_id}&user_id=${this.userData.user_id}&answer=${
            answer[selectedOption]
            }&time=${this.question.remainingTime}&device_id=${Utils.Constant.deviceId}&lec_type=${
            this.question.lec_type
            }&max_count=${this.question.max_count}&isnew=${this.question.isnew}`;
        Utils.service.getApiCall(
            URL,
            ``,
            (response: any) => {
                this.isLoading = false;
                if (response.data.success) {
                    Toast.show('Thank you for submitting your answer ', Toast.SHORT);
                    this.question = {};
                    console.log("replyAnswer"),
                    BackgroundTimer.stopBackgroundTimer(),
                    Navigation.popToRoot(this.questionComponentId)


                }
            },
            (errorResponse: any) => {
                this.question = {};
            }
        )
    }

    handleNetConnectivity = (isConnected: boolean) => {

        console.log("isConnected", isConnected)
        this.hasNetworkConnection = isConnected;
    }

}

export function socketHandler ()  {
    console.log("doConnection is called")
    //console.warn("current screen", Store.userStore.currentScreenName)
    Store.userStore.socket = io.connect(
        'http://app.totall.in:4001',
        {
            transports: ['websocket'],
            // autoConnect: true,
            // reconnection: true,
            // reconnectionAttempts: Infinity,
            //forceNew: true,
        });


    Store.userStore.socket.on("connection", function () {
        console.log("connection")
    })
    Store.userStore.hasSocketConnection = true
    Store.userStore.socket.emit("addUser", { user_id: Store.userStore.userData.user_id, token: Store.userStore.userData.token });
    
    console.log("doConnection is called", { user_id: Store.userStore.userData.user_id })
    Store.userStore.socket.on("sendToMobileApp", (question: any) => {
        console.log("Question", Store.userStore.question)
        if ((Store.userStore.currentScreenName === 'welcome' || Object.keys(Store.userStore.question).length == 0) && question.token == Store.userStore.userData.token) {
            question.datetime = moment().utc().format()
            //question.total_timer = 30
            question.remainingTime = 0;
            Store.userStore.question = question;

            if (Store.userStore.currentScreenName == 'welcome' && !Store.userStore.appState.match(/inactive|background/)) {

                handleNavigationPush(Store.userStore.currentComponentId, Utils.Screen.question)
            }
        }
        else if(question.token != Store.userStore.userData.token && Store.userStore.hasSocketLogin){
            Store.userStore.manualClose = true;
            Store.userStore.hasSocketLogin = false;
            Store.userStore.userData = new userDataModal()
            Store.userStore.hasSocketLogin = false;
            Store.userStore.socket.emit("disconnect")
            Store.userStore.socket.disconnect();
            Store.userStore.resetStack(Store.userStore.currentComponentId, Utils.Screen.login)
        }


    });
    Store.userStore.socket.on('disconnect', function () {
        console.log("Disconnected", Store.userStore.manualClose);
        if(!Store.userStore.manualClose){
            Store.userStore.hasSocketConnection = false;
            socketHandler();
        }
       
    });

    Store.userStore.socket.on("allLogout", (response: any) => {
        console.log("allLogout is called")
        if(Store.userStore.hasSocketLogin && Store.userStore.userData.token!=""){
            Store.userStore.manualClose = true;
            Store.userStore.socket.emit("disconnect")
            Store.userStore.socket.disconnect();
            Store.userStore.hasSocketLogin = false;
            Store.userStore.userData = new userDataModal()
            Store.userStore.hasSocketLogin = false;
            Store.userStore.resetStack(Store.userStore.currentComponentId, Utils.Screen.login)
    
        }
    });
}




export default new UserStore();