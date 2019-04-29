import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator } from "react-native";
// @ts-ignore
import Utils from "../utils";
//@ts-ignore
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/**
 * define keys of CommonInput props
 */
export interface Props {
    containerStyle?: object,
    placeholderText: string,
    placeholderTextColor?: string,
    inputStyle?: object,
    value: string,
    errorStyle?: object,
    multiline?: boolean,
    numberOfLines?: number,
    maxLength ?: number,
    onChangeText: Function,
    returnKeyType?: any,
    keyboardType?: any,
    fieldName?: string,
    secureTextEntry?: boolean,
    onSubmitEditing: Function,
    editable?: boolean,
    autoCapitalize ?: any,
    returnKeyLabel ? : string
}

export class CommonInput extends Component<Props>{

    public static defaultProps: Partial<Props> = {
        keyboardType: "default",
        editable: true,
        maxLength: 30,
        numberOfLines: 1,
        autoCapitalize: "none"
    }

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        
        return (
            <View style={[Styles.containerStyle, this.props.containerStyle, this.props.errorStyle]}>
                <TextInput
                    ref={"TextInput"}
                    placeholder={this.props.placeholderText}
                    placeholderTextColor={this.props.placeholderTextColor}
                    style={[Styles.inputStyle, this.props.inputStyle, {fontWeight : !this.props.value ? "700": "500"}]}
                    value={this.props.value}
                    multiline={this.props.multiline}
                    numberOfLines={this.props.numberOfLines}
                    maxLength={this.props.maxLength}
                    onChangeText={(val) => this.props.onChangeText(val)}
                    returnKeyType={this.props.returnKeyType}
                    keyboardType={this.props.keyboardType}
                    onSubmitEditing={() => this.props.onSubmitEditing()}
                    autoCapitalize={this.props.autoCapitalize}
                    editable={this.props.editable}
                    returnKeyLabel={this.props.returnKeyLabel}
                />
            </View>
        )
    }
}

/**
 * defualt style for Custom TextInput field
 */
const Styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        //width: Constant.Common.vw- 30,
        height: "auto",
        minHeight: hp("6.12%"),
        maxHeight: hp("15%"),
        borderBottomWidth: Utils.Constant.isIos ? 2 : 0,
        borderBottomColor:   Utils.color.white,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        //marginLeft:15,
        //marginRight: 15,

        backgroundColor: Utils.color.white,
        alignItems: 'center',
        borderRadius: 10,
    },
    inputStyle: {
        flex: 1,
        minHeight: hp("6.12%"),
        fontSize: wp("5.33%"),
        borderRadius: 10,

    },
    
})