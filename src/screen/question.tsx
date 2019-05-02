import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
//@ts-ignore
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Utils from "../utils";
import Store from "../store";
import { observer } from 'mobx-react';
import { Navigation } from 'react-native-navigation';
//@ts-ignore
import BackgroundTimer from 'react-native-background-timer';
//@ts-ignore
import HTML from "react-native-render-html";
import DropdownAlert from "../component/dropDownAlert";
import moment from "moment";

export interface QuestionProps {
    componentId: string
}


@observer
export default class Question extends React.Component<QuestionProps, any> {
    public clockCall: any = null;
    //@ts-ignore
    private dropdown: DropdownAlert;

    constructor(props: QuestionProps) {
        super(props);
        this.state = {
            question: {},
            remainingTime: 0,
            selectedOption: -1
        }
        Navigation.events().bindComponent(this);
    }
    componentDidMount() {
       
    }
    componentDidAppear() {
        Store.userStore.currentScreenName = "question"
        Store.userStore.currentComponentId = this.props.componentId,
        Store.userStore.questionComponentId = this.props.componentId;
        console.log("componenttDidAppear Question", Store.userStore.question)
        Store.userStore.calculate()
       
    }
    componentWillUnmount() {
        BackgroundTimer.stopBackgroundTimer();
        Store.userStore.question = {};

    }

    // calculateTime = () => {
    //     let question = this.state.question;
    //     let serverTime = moment(question.datetime).utc().format()
    //     let localTime = moment().utc().format()
    //     let timePassed = moment(localTime).diff(serverTime, 'seconds');
    //     let remainingTime = this.state.question.total_timer - timePassed;
    //     if (remainingTime > 0) {
    //         this.setState({ remainingTime: remainingTime }, () => {
    //             this.clockCall = setInterval(() => {
    //                 this.decrementClock();
    //             },1000);
    //         })
    //     }
    //     else {
    //         this.setState({ remainingTime: 0 }, () => {
    //             this.decrementClock();
    //         })
    //     }
    // }
    // decrementClock = ()=>{
    //     if (this.state.remainingTime > 0) {
    //         this.setState((prev_State: any) => ({
    //             remainingTime: prev_State.remainingTime == 0 ? 0 : prev_State.remainingTime - 1
    //           }));
    //     }else {
    //         clearInterval(this.clockCall);
    //         Navigation.pop(this.props.componentId)
    //     }
    // }

    selectOption = (index: number) => {
        this.setState({ selectedOption: index })
    }

    renderRow = (rowData: any) => {
        const { item, index } = rowData
        return (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <TouchableOpacity onPress={() => this.selectOption(index)} style={{ padding: wp("4%") }}>
                    <View style={[
                            Styles.circleShapeView, 
                            { 
                                backgroundColor: 
                                (Store.userStore.question.remainingTime == 0 || Object.keys(Store.userStore.question).length == 0) ? "#d3d4d0" 
                                : this.state.selectedOption === index ? "green" : item.color}]}>
                        <Text style={Styles.circleText}>{item.option}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    public render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.headingStyle}>
                    {/* <TouchableOpacity style={{ position: 'absolute', left: 10 }}
                        onPress={() => Navigation.pop(this.props.componentId)}
                    >
                        <Text style={{
                            color: Utils.color.white,
                            fontWeight: 'bold',
                            fontSize: wp("4%"),
                        }}>
                            Back
                        </Text>
                    </TouchableOpacity> */}
                    <Text style={Styles.headingText}>
                        TOTALL
                    </Text>
                    <View style={{ position: 'absolute', right: 10 }}

                    >
                        <Text style={{
                            color: Store.userStore.hasNetworkConnection ? Utils.color.green : Utils.color.red,
                            fontWeight: 'bold',
                            fontSize: wp("4%"),
                        }}>
                            {Store.userStore.hasNetworkConnection ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: wp("5%"), marginTop: hp("5%"), color: Utils.color.black, fontWeight: 'bold' }}>
                        {`Remaining time: ${Store.userStore.question.remainingTime}`}
                    </Text>
                    <ScrollView 
                        style={{ flex: 1, marginTop: hp("2%"),  }}
                        contentContainerStyle={{alignItems: 'center'}}
                    >
                        
                        <View style={{ flex: 1 }}>
                            <HTML 
                                html={Store.userStore.question.question} 
                                imagesMaxWidth={wp("90%")} 
                                baseFontStyle={{ fontSize: wp("5%")}}
                                containerStyle={{width: wp("100%"), paddingLeft: wp("5%"), paddingRight: wp("5%")}}
                            />
                            <FlatList
                                data={Store.userStore.question.options}
                                renderItem={this.renderRow}
                                numColumns={2}
                                extraData={this.state}
                                keyExtractor={(item,index)=>index.toString()}
                            />
                            <View style={[Styles.buttonContainer]}>
                                <TouchableOpacity
                                    style={[Styles.buttonStyle,{backgroundColor: this.state.selectedOption==-1 ? Utils.color.appGray : Utils.color.dark} ]}
                                    onPress={() => {
                                            this.setState({selectedOption: -1})
                                            Store.userStore.replyAnswer(this.state.selectedOption, this.dropdown)
                                        }}
                                    disabled={this.state.selectedOption==-1 ? true : false}
                                >
                                    <Text style={{
                                        color: Utils.color.white,
                                        fontWeight: 'bold',
                                        fontSize: wp("10%"),
                                    }}>
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp("100%"),
        height: hp("12%")
    },
    headingText: {
        color: Utils.color.white,
        fontWeight: 'bold',
        fontSize: wp("5%"),
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
        width: wp("46%"),
        height: hp("10%"),
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleShapeView: {
        width: wp("26%"),
        height: wp("26%"),
        borderRadius: wp("13%"),
        justifyContent: "center",
        alignItems: "center"
    },
    circleText: {
        textAlign: "center",
        fontSize: wp("16%"),
        color: "white"
    }

})
