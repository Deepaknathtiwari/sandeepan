import * as React from 'react';
import { View, StyleSheet, Text, NetInfo, } from 'react-native';
import Utils from "../utils";

import Store from "../store";
import { observer } from 'mobx-react';
import * as Animatable from 'react-native-animatable';
//@ts-ignore
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Navigation } from "react-native-navigation";


interface SplashProps {
  componentId: string
}



@observer
export default class SplashComponent extends React.Component<SplashProps, any> {
  constructor(props: SplashProps) {
    super(props);
  }
  componentDidMount() {
    Store.userStore.currentScreenName="splash"
    Store.userStore.currentComponentId=this.props.componentId;

    NetInfo.isConnected.fetch().then(isConnected => {
      Store.userStore.handleNetConnectivity(isConnected);
      NetInfo.isConnected.addEventListener('connectionChange', Store.userStore.handleNetConnectivity);
      console.warn("connectionChange", isConnected)
      //this.props.updateNetworkState(isConnected)
    });
  }

  handleAnimationEnd = () => {
    if (Store.userStore.userData.user_id) {
      this.showLogin()
    }
    else {
     this.showLogin()
    }
  }
  showLogin = ()=>{
    Navigation.setStackRoot(this.props.componentId, {
      component: {
        name: Utils.Screen.login,
        options: {
          animations: {
           
          }
        }
      }
    });
  }

  showWelcome = ()=>{
    Navigation.setStackRoot(this.props.componentId, {
      component: {
        name: Utils.Screen.welcome,
        options: {
          animations: {
           
          }
        }
      }
    });
  }

  public render() {
    return (

      <View style={Styles.container} >

          <View style={{ width: wp("100%"), height: wp("100%"), justifyContent: "center", alignItems: "center" }}>
            <Animatable.Image delay={500} duration={2000} animation="zoomIn" iterationCount={1}
              source={Utils.images.logo} resizeMode="cover"
              resizeMethod="resize" style={Styles.logoStyle} useNativeDriver={true}
              onAnimationEnd={this.handleAnimationEnd} />

          </View>
      

      </View>

      // <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      //     <Text>
      //        {`question ${Store.userStore.question} `}

      //     </Text>
      //     <Text>
      //        {`disConnectionCounter: ${Store.userStore.disConnectionCounter}`}

      //     </Text>
      // </View>


    )
  }
}


const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  logoStyle: {
    width: wp("38%"),
    height: wp("38%"),
    justifyContent: "center"
  },

})


