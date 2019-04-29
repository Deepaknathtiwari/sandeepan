import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, AppState, YellowBox } from 'react-native';
//@ts-ignore
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Utils from "../utils";
import Store from "../store";
import { observer } from 'mobx-react';
import Loader from "../component/loader";
//import BackgroundTimers from 'react-native-background-timer';
//@ts-ignore
import BackgroundTask from 'react-native-background-task'
import Blink from "./blink";
import { Navigation } from 'react-native-navigation';
import { socketHandler } from "../store/userStore";
import DropdownAlert from "../component/dropDownAlert";

// BackgroundTimers.runBackgroundTimer(() => {
//     console.log("hasSocketConnection",Store.userStore.hasSocketConnection)
//     Store.userStore.hasConnection = Store.userStore.hasSocketConnection;
//     if (!Store.userStore.hasSocketConnection) {
//         console.log("disconnected");
//         console.log("call connection");
//         socketHandler();
//     } else {
//         //Store.userStore.hasSocketConnection = true;
//         //console.log("timer Question",Store.userStore.question)
//     }

// }, 5000);

// BackgroundTask.define(() => {
//     console.log("hasSocketConnection",Store.userStore.hasSocketConnection)
//     Store.userStore.hasConnection = Store.userStore.hasSocketConnection;
//     if (!Store.userStore.hasSocketConnection) {
//         console.log("disconnected");
//         console.log("call connection");
//        // socketHandler();
//     } else {
//         //Store.userStore.hasSocketConnection = true;
//         //console.log("timer Question",Store.userStore.question)
//     }
// })




export interface WelcomeProps {
    componentId: string,
}
@observer
export default class Welcome extends React.Component<WelcomeProps, any> {

    //@ts-ignore
    private dropdown: DropdownAlert;
    constructor(props: WelcomeProps) {
        super(props);
    }
    componentDidMount() {
        Store.userStore.doConnection();
        AppState.addEventListener("change", Store.userStore.handleAppState);
        Navigation.events().bindComponent(this);
        YellowBox.ignoreWarnings([
            'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
        ]);
        // BackgroundTask.schedule({
        //     period: 5, // Aim to run every 30 mins - more conservative on battery
        // })
       
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", Store.userStore.handleAppState);
        //BackgroundTimers.stopBackgroundTimer();
        //BackgroundTask.finish()
    }
    componentDidAppear() {
        Store.userStore.currentScreenName = "welcome"
        Store.userStore.currentComponentId = this.props.componentId;
        Store.userStore.welcomeComponentId = this.props.componentId;
    }

    public render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.headingStyle}>
                    <View style={{ flexDirection: 'row', height: hp("6%"), width: wp("100%"), alignItems: "flex-end", justifyContent:"space-between", paddingLeft: 5, paddingRight: 5 }}>
                        <View>
                            <Text style={{
                                color: Utils.color.black,
                                fontWeight: 'bold',
                                fontSize: wp("4%"),
                            }}>
                                {Store.userStore.hasSocketLogin ? 'You are logged in' : 'You are logged out'}
                        </Text>
                        </View>
                        <View>
                            <Text style={{
                                color: Store.userStore.hasNetworkConnection ? Utils.color.green : Utils.color.red,
                                fontWeight: 'bold',
                                fontSize: wp("4%"),
                            }}>
                                {Store.userStore.hasNetworkConnection ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', height: hp("6%"), width: wp("100%"),  alignItems: "center",paddingLeft: 5, paddingRight: 5}}>
                        <Text style={Styles.headingText}>
                            TOTALL
                        </Text>
                        <TouchableOpacity style={{ position: 'absolute', left: 10 }}
                            onPress={() => Store.userStore.handleLogOut(this.props.componentId, this.dropdown, () => {
                                //BackgroundTimers.stopBackgroundTimer();
                            })}
                        >
                            <Text style={{
                                color: Utils.color.white,
                                fontWeight: 'bold',
                                fontSize: wp("4%"),
                            }}>
                                Logout
                        </Text>
                        </TouchableOpacity>
                    </View>


                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Image
                        source={Utils.images.logoSandeepan}
                        style={{ width: wp("50%"), height: hp("50%"), marginTop: hp("4%") }}
                        resizeMode={"contain"}
                    />
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: wp("7%"), fontWeight: "bold", color: "#828282" }}>
                            WELCOME TO
                        </Text>

                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Text style={{ fontSize: wp("7%"), fontWeight: "bold", color: "#24A5BE" }}>
                            TOTALL EDUCATION
                        </Text>
                    </View>
                    <View style={Styles.bottom}>
                        <Blink text="Your opinion matters, question will appear soon." />
                    </View>

                </View>
                {
                    Store.userStore.isLoading &&
                    <Loader
                        isVisible={true}
                    />
                }
                <DropdownAlert
                    //@ts-ignore
                    ref={ref => this.dropdown = ref}
                    inactiveStatusBarBackgroundColor={Utils.color.transparent}
                    elevation={6} panResponderEnabled={true}
                />
            </View>

        );
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Utils.color.white
    },
    headingStyle: {
        backgroundColor: Utils.color.dark,
        //flexDirection: 'row',
        width: wp("100%"),
        height: hp("12%"),
        
    },
    headingText: {
        color: Utils.color.white,
        fontWeight: 'bold',
        fontSize: wp("5%"),
        width: "100%",
        textAlign: "center"
    },
    subHeadingStyle: {
        backgroundColor: Utils.color.light,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: wp("100%"),
        height: hp("6%")
    },
    subHeadingText: {
        color: Utils.color.black,
        fontWeight: 'bold',
        fontSize: wp("4%"),
    },
    headingInner: {
        flex: 1,

    },
    childContainer: {
        width: wp("90%"),
        height: hp("60%"),
        alignItems: "center",
        paddingLeft: wp("4%"),
        paddingRight: wp("4%"),
        justifyContent: 'center',
        backgroundColor: "#d7eef4"
    },
    logoStyle: {
        width: wp("40%"),
        height: wp("40%"),
        borderRadius: wp("20%"),
        backgroundColor: Utils.color.white,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: hp("5%"),
    },
    buttonStyle: {
        backgroundColor: Utils.color.dark,
        width: wp("26%"),
        height: hp("5%"),
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        height: hp("10%"),
        //position: "absolute",
        //bottom: wp("5%"),

    },
})
