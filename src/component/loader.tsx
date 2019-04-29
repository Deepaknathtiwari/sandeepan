import * as React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Utils from "../utils";
//@ts-ignore
const Spinner = require('react-native-spinkit');

interface LoaderProps {
  isVisible: boolean
}
interface LoaderState {
}

export default class Loader extends React.PureComponent<LoaderProps, LoaderState> {
  constructor(props: LoaderProps) {
    super(props);
  }

  render() {
    return (
      <View style={Styles.container}>
          <Spinner style={Styles.spinner} isVisible={this.props.isVisible} size={100} type={"CircleFlip"} color={Utils.color.dark} />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:"center",
        alignItems: 'center',
        backgroundColor: Utils.color.transparent,
        position: 'absolute',
        top:0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    spinner: {
      marginBottom: 50
    },
    
})
