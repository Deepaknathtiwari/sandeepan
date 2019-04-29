import React, { Component } from "react";
import {StyleSheet} from "react-native";
//@ts-ignore
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
interface BlinkProps {
    text: string
}
let interval: any = null;
export default class Blink extends Component<BlinkProps,any> {
    private interval: any = null;
    constructor(props: BlinkProps) {
      super(props);
      this.state = { isShowingText: true };
      // Toggle the state every second
      
    }
    componentDidMount(){
      interval = setInterval(
        () =>
          this.setState((previousState: any) => ({
            isShowingText: !previousState.isShowingText
          })),
        1000
      );
    }
    componentWillUnmount(){
      clearInterval(interval);
    }
  
    render() {
        return <Animatable.Text style={Styles.blinkText}
            duration={2000} animation="zoomInDown" iterationCount={'infinite'}
            useNativeDriver={true}
        >{this.props.text}</Animatable.Text>;
      
        
      
    }
  }

  const Styles= StyleSheet.create({
    blinkText: {
        textAlign: "center",
        fontSize: wp("5%"),
        marginLeft: 10,
        marginRight: 10,
        fontWeight: "bold"
      }
  })

