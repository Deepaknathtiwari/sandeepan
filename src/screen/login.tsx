import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
//@ts-ignore
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Utils from "../utils";
import Store from "../store";
import { observer } from 'mobx-react';
import Loader from "../component/loader";
import DropdownAlert from "../component/dropDownAlert";
import { Navigation } from "react-native-navigation";
import { LoginComponent, ContactComponent } from "./homeScreen";
//@ts-ignore
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
//@ts-ignore
import TabBar from "react-native-underline-tabbar";
export interface LoginProps {
  componentId: string,
}





const PageOne = (props: { tabLabel: object, handleLogin: Function, componentId: string}) => (
  <LoginComponent 
    componentId = {props.componentId}
    handleLogin= {props.handleLogin}
  />
);

const PageTwo = (props: { tabLabel: object, componentId: string}) => (
  <ContactComponent 
    componentId = {props.componentId}
    
  />
);

@observer
export default class Login extends React.Component<LoginProps, any> {
  //@ts-ignore
  private dropdown: DropdownAlert;
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'login', title: 'Login' },
        { key: 'contacts', title: 'Contacts' },
      ],
    }
    Navigation.events().bindComponent(this);
  }
  componentDidMount() {

  }
  componentDidAppear() {
    Store.userStore.currentScreenName = "login"
    Store.userStore.currentComponentId = this.props.componentId;

    // Store.userStore.userName = Store.userStore.userData.username;
    // Store.userStore.userPhone = Store.userStore.userData.mobile_no;
  }
  

  renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'white' }}
        style={{ backgroundColor: Utils.color.light, }}
        labelStyle={{ color: Utils.color.black }}
      />
    )

  }

  handleLogin = ()=>{
    Store.userStore.doLogin(this.dropdown)
  }
  public render() {
    return (
      <View style={Styles.container}>
        <View style={Styles.headingStyle}>

          <Text style={Styles.headingText}>
            TOTALL
              </Text>

        </View>
        {/* <View style={Styles.subHeadingStyle}>
          <View>
            <Text style={Styles.subHeadingText}>
              Login
              </Text>
          </View>
          <View>
            <Text style={Styles.subHeadingText}>
              Contacts
              </Text>
          </View>

        </View> */}

        {/* <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            login: loginScreen,
            contacts: contactScreen,
          })}
          onIndexChange={(index: number) => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={this.renderTabBar}

        /> */}

        <ScrollableTabView
            //style={{ width: '100%' }}
            initialPage={0}
            //@ts-ignore
            onChangeTab={(i:number) => {}}
            tabBarActiveTextColor={Utils.color.black}
            tabBarInactiveTextColor={Utils.color.white}
            
            renderTabBar={() => <TabBar 
                underlineColor={Utils.color.white}
                underlineBottomPosition={0}
                tabBarTextStyle={{fontSize: wp('5%'),fontWeight:'bold',color: Utils.color.black}}
                activeTabTextStyle={{fontSize: wp('5%'),fontWeight:'bold',}}
                tabBarStyle={{marginTop: 0,height: 50, alignItems: 'center',width: wp("100%")}}
                backgroundColor={Utils.color.light}
                tabStyles={{height: 50}}
                scrollContainerStyle = {{justifyContent: 'space-around',width: wp("100%"), height: 50, alignItems: 'center',}}
                //tabMargin= {100}
                />} >
            <PageOne tabLabel={{ label: "Login"}} handleLogin={this.handleLogin} componentId={this.props.componentId} />
            <PageTwo tabLabel={{ label: "Contacts"}}  componentId={this.props.componentId} />
           
        </ScrollableTabView>

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
  
})
