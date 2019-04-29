import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Utils from "../utils";
import Store from "../store";
import { observer } from 'mobx-react';
import DropdownAlert from "../component/dropDownAlert";
import { CommonInput } from "../component/customTextInput";
//@ts-ignore
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export interface LoginScreenProps {
    componentId: string,
    handleLogin: Function,
}


@observer
export class LoginComponent extends React.Component<LoginScreenProps, any> {
    //@ts-ignore
    //private dropdown: DropdownAlert;
    constructor(props: LoginScreenProps) {
        super(props);
    }
    componentDidMount(){
        console.log("home screen",this.props)
    }

    public render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
                <View style={Styles.childContainer}>
                    <Image
                        source={Utils.images.userImage}
                        style={Styles.logoStyle}
                        resizeMode={"contain"}
                    />
                    <CommonInput
                        containerStyle={{ marginTop: 50, }}
                        placeholderText={"Enter your name"}
                        value={Store.userStore.userName}
                        onChangeText={(val: string) => { Store.userStore.userName = val }}
                        onSubmitEditing={() => { }}
                    />
                    <CommonInput
                        placeholderText={"Enter your mobile number"}
                        value={Store.userStore.userPhone}
                        keyboardType={'phone-pad'}
                        onChangeText={(val: string) => { Store.userStore.userPhone = val }}
                        onSubmitEditing={() => { }}
                    />
                    <View style={Styles.buttonContainer}>
                        <TouchableOpacity
                            style={Styles.buttonStyle}
                            onPress={() => this.props.handleLogin()}
                        >
                            <Text style={{
                                color: Utils.color.white,
                                fontWeight: 'bold',
                                fontSize: wp("7%"),
                            }}>
                                Login
                      </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <DropdownAlert
                    //@ts-ignore
                    ref={ref => this.dropdown = ref}
                    inactiveStatusBarBackgroundColor={Utils.color.transparent}
                    elevation={6} panResponderEnabled={true}
                /> */}
            </View>
        )
    }
}



export interface ContactScreenProps {
    componentId: string,
   
}
export class ContactComponent extends React.Component<ContactScreenProps, any> {
    constructor(props: ContactScreenProps) {
        super(props);
    }

    public render() {
        return (
            <View style={{
                flex: 1, padding: wp("3%"),
            }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={Styles.contactContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Image
                                    source={Utils.images.building}
                                    style={{ width: wp("50%"), height: wp("50%") }}
                                    resizeMode={"contain"}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={Styles.contactText}>
                                    TOTALL Diabetes Hormone institute  Scheme 54, Near Bombay Hospital,
                                    Behind Prestige management institute, Indore-452010 Phone No: 0731-2443344
                                </Text>

                            </View>
                        </View>
                        <Text style={Styles.contactText}>
                            Website: www.totall.in, www.sandeepan.in
                        </Text>
                        <Text style={Styles.contactText}>
                            EmailId: education@totall.in
                        </Text>
                        <View style={{ backgroundColor: "#728FD9", width: "100%", height: 5, marginTop: 5 }}>
                        </View>
                        <View style={{ width: wp("92%"), height: 300,flexDirection: "row"}}>
                            <Image
                                source={Utils.images.maps}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode={"contain"}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export const loginScreen = (props: any) => {

}




const Styles = StyleSheet.create({
    childContainer: {
        width: wp("90%"),
        height: hp("65%"),
        alignItems: "center",
        paddingLeft: wp("4%"),
        paddingRight: wp("4%"),
        justifyContent: 'center',
        backgroundColor: "#d7eef4"
    },
    contactContainer: {
        //flex: 1,
        //alignItems: "center",
        //justifyContent: 'center',

    },
    logoStyle: {
        width: wp("34%"),
        height: wp("34%"),
        borderRadius: wp("17%"),
        backgroundColor: Utils.color.white,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: hp("5%"),
    },
    buttonStyle: {
        backgroundColor: Utils.color.dark,
        width: wp("36%"),
        height: hp("9%"),
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactText: {
        fontSize: wp("5%"),
        color: Utils.color.black,
        fontWeight: "bold",
    }
})