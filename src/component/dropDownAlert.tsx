import React, { Component } from 'react'
import {
  StyleSheet, View, Text, TouchableHighlight, ViewPropTypes,
  Animated, StatusBar, Platform, Dimensions, Image, PanResponder, TouchableOpacity
} from "react-native";

import Utils from "../utils";
//@ts-ignore
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  infoColor?: string,
  warnColor?: string,
  errorColor?: string,
  successColor?: string,
  closeInterval?: number,
  startDelta?: number,
  endDelta?: number,
  containerStyle?: object,
  titleStyle?: object,
  messageStyle?: object,
  titleNumOfLines?: number,
  messageNumOfLines?: number,
  onClose?: Function,
  onCancel?: Function,
  showCancel?: boolean,
  tapToCloseEnabled?: boolean,
  panResponderEnabled?: boolean,
  replaceEnabled?: boolean,
  translucent?: boolean,
  activeStatusBarStyle?: string,
  activeStatusBarBackgroundColor?: string,
  inactiveStatusBarStyle?: string,
  inactiveStatusBarBackgroundColor?: string,
  updateStatusBar?: boolean,
  elevation?: number,
  sensitivity?: number
}

interface State {
  animationValue: Animated.Value
  isOpen: boolean,
  duration: number,
  type: string,
  message: string,
  title: string,
  startDelta?: number,
  endDelta?: number,
  topValue: number
}

const WINDOW = Dimensions.get('window');
let closeTimeoutId: number = 0;
// @ts-ignore
var panResponder;

export default class DropdownAlert extends Component<Props, State> {


  public static defaultProps: Partial<Props> = {
    infoColor: "#2B73B6",
    warnColor: "#cd853f",
    errorColor: "#cc3232",
    successColor: "#32A54A",
    closeInterval: 2000,
    startDelta: -100,
    endDelta: 0,
    containerStyle: {
      padding: 16,
      flexDirection: 'row'
    },
    titleStyle: {
      fontSize: 16,
      textAlign: 'left',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: 'transparent'
    },
    messageStyle: {
      fontSize: 14,
      textAlign: 'left',
      fontWeight: 'normal',
      color: 'white',
      backgroundColor: 'transparent'
    },
    titleNumOfLines: 1,
    messageNumOfLines: 3,
    onClose: () => { },
    onCancel: () => { },
    showCancel: false,
    tapToCloseEnabled: true,
    panResponderEnabled: true,
    replaceEnabled: true,
    translucent: true,
    activeStatusBarStyle: 'light-content',
    // @ts-ignore
    activeStatusBarBackgroundColor: StatusBar._defaultProps.backgroundColor.value,
    // @ts-ignore
    inactiveStatusBarStyle: StatusBar._defaultProps.barStyle.value,
    inactiveStatusBarBackgroundColor: '#fff',
    updateStatusBar: false,
    elevation: 1,
    sensitivity: 20
  };

  public static defaultState: Partial<State> = {
    animationValue: new Animated.Value(0),
    duration: 450,
    type: '',
    message: '',
    title: '',
    isOpen: false,
    topValue: 0
  };

  constructor(props: Props) {
    super(props)
    this.state = {
      animationValue: new Animated.Value(0),
      duration: 450,
      type: '',
      message: '',
      title: '',
      isOpen: false,
      startDelta: props.startDelta,
      endDelta: props.endDelta,
      topValue: 0,
    }
    // Render
    this.renderDropDown = this.renderDropDown.bind(this)
    // Action
    this.alert = this.alert.bind(this)
    this.alertWithType = this.alertWithType.bind(this)
    this.dismiss = this.dismiss.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onClose = this.onClose.bind(this)
    // Util
    this.animate = this.animate.bind(this)
    // Pan Responder
    this.handlePanResponderMove = this.handlePanResponderMove.bind(this)
    this.handlePanResponderEnd = this.handlePanResponderEnd.bind(this)
    this.handleMoveShouldSetPanResponder = this.handleMoveShouldSetPanResponder.bind(this)
    this.handleStartShouldSetPanResponder = this.handleMoveShouldSetPanResponder.bind(this)


  }

  componentWillMount() {
    panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    })
  }
  alert(title: string, message: string) {
    if (title == undefined) {
      title = ""
    }
    if (message == undefined) {
      message = ""
    }
    this.alertWithType('custom', title, message)
  }
  alertWithType(type: string, message: string, title?: string, ) {
    if (this.validateType(type) == false) {
      return
    }
    if (this.props.replaceEnabled == false) {
      //@ts-ignore
      this.setState({
        type: type,
        message: message,
        title: title,
        isOpen: true,
        topValue: 0
      })
      if (this.state.isOpen == false) {
        this.animate(1)
      }
      //@ts-ignore
      if (this.props.closeInterval > 1) {
        if (closeTimeoutId != null) {
          clearTimeout(closeTimeoutId)
        }
        closeTimeoutId = setTimeout(function () {
          //@ts-ignore
          this.onClose('automatic')
        }.bind(this), this.props.closeInterval)
      }
    } else {
      var delayInMilliSeconds = 0
      if (this.state.isOpen == true) {
        delayInMilliSeconds = 475
        this.dismiss()
      }
      var self = this
      setTimeout(function () {
        if (self.state.isOpen == false) {
          //@ts-ignore
          self.setState({
            type: type,
            message: message,
            title: title,
            isOpen: true,
            topValue: 0
          })
        }
        self.animate(1)
        //@ts-ignore
        if (self.props.closeInterval > 1) {
          closeTimeoutId = setTimeout(function () {
            self.onClose('automatic')
          }.bind(self), self.props.closeInterval)
        }
      }.bind(this), delayInMilliSeconds)
    }
  }
  dismiss(onDismiss?: Function, action?: string) {
    if (this.state.isOpen) {
      if (closeTimeoutId != null) {
        clearTimeout(closeTimeoutId)
      }
      this.animate(0)
      setTimeout(function () {
        //@ts-ignore
        if (this.state.isOpen) {
          //@ts-ignore
          this.setState({
            isOpen: false
          })
          //@ts-ignore
          if (this.props.updateStatusBar) {
            if (Platform.OS == 'android') {
              // @ts-ignore
              StatusBar.setBackgroundColor(this.props.inactiveStatusBarBackgroundColor, true)
            } else {
              // @ts-ignore
              StatusBar.setBarStyle(this.props.inactiveStatusBarStyle, true)
            }
          }
          if (onDismiss) {

            var data = {
              //@ts-ignore
              type: this.state.type,
              //@ts-ignore
              title: this.state.title,
              //@ts-ignore
              message: this.state.message,
              action: action // !!! How the alert was dismissed: automatic, programmatic, tap, pan or cancel
            }
            onDismiss(data)
          }
        }
      }.bind(this), (this.state.duration))
    }
  }
  dismissDirectly() {
    if (this.state.isOpen) {
      if (closeTimeoutId != null) {
        clearTimeout(closeTimeoutId)
      }
      this.setState({
        isOpen: false
      })
      if (this.props.updateStatusBar) {
        if (Platform.OS == 'android') {
          // @ts-ignore
          StatusBar.setBackgroundColor(this.props.inactiveStatusBarBackgroundColor, true)
        } else {
          // @ts-ignore
          StatusBar.setBarStyle(this.props.inactiveStatusBarStyle, true)
        }
      }
    }
  }
  onClose(action: string) {
    if (action == undefined) {
      action = 'programmatic'
    }
    this.dismiss(this.props.onClose, action)
  }
  onCancel() {
    this.dismiss(this.props.onCancel, 'cancel')
  }
  animate(toValue: number) {
    Animated.spring(
      this.state.animationValue, {
        toValue: toValue,
        // @ts-ignore
        duration: this.state.duration,
        friction: 9,
        useNativeDriver: true
      }
    ).start()
  }
  onLayoutEvent(event: any) {
    var { x, y, width, height } = event.nativeEvent.layout
    var actualStartDelta = this.state.startDelta
    var actualEndDelta = this.state.endDelta
    // Prevent it from going off screen.
    //@ts-ignore
    if (this.props.startDelta < 0) {
      var delta = 0 - height
      if (delta != this.props.startDelta) {
        actualStartDelta = delta
      }
    }
    //@ts-ignore
    else if (this.props.startDelta > WINDOW.height) {
      //@ts-ignore
      actualStartDelta = WINDOW.height + height
    }
    //@ts-ignore
    if (this.props.endDelta < 0) {
      actualEndDelta = 0
    }
    //@ts-ignore
    else if (this.props.endDelta > WINDOW.height) {
      actualEndDelta = WINDOW.height - height
    }
    //@ts-ignore
    var heightDelta = WINDOW.height - this.props.endDelta - height
    if (heightDelta < 0) {
      //@ts-ignore
      actualEndDelta = this.props.endDelta + heightDelta
    }
    if (actualStartDelta != this.state.startDelta || actualEndDelta != this.state.endDelta) {
      this.setState({
        startDelta: actualStartDelta,
        endDelta: actualEndDelta
      })
    }
  }
  validateType(type?: string) {
    //@ts-ignore
    if (type.length === 0 || type === null) {
      console.warn('Missing DropdownAlert type. Available types: info, warn, error or custom')
      return false
    }
    if (type != 'info' && type != 'warn' && type != 'error' && type != 'custom' && type != 'success') {
      console.warn('Invalid DropdownAlert type. Available types: info, warn, error, success, or custom')
      return false
    }
    return true
  }
  handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
    //@ts-ignore
    return this.props.panResponderEnabled
  }
  handleMoveShouldSetPanResponder(e: Object, gestureState: Object): boolean {
    // @ts-ignore
    return Math.abs(gestureState.dx) < this.props.sensitivity && Math.abs(gestureState.dy) >= this.props.sensitivity && this.props.panResponderEnabled
  }
  handlePanResponderMove(e: Object, gestureState: Object) {
    // @ts-ignore
    if (gestureState.dy < 0) {
      this.setState({
        // @ts-ignore
        topValue: gestureState.dy
      })
    }
  }
  handlePanResponderEnd(e: Object, gestureState: Object) {
    //@ts-ignore
    const delta = this.state.startDelta / 5;
    // @ts-ignore
    if (gestureState.dy < delta) {
      this.dismiss(this.props.onClose, 'pan')
    }
  }
  renderStatusBar(backgroundColor?: string, barStyle?: object, translucent?: boolean) {
    if (Platform.OS === 'android') {
      // @ts-ignore
      StatusBar.setBackgroundColor(backgroundColor, true)
      // @ts-ignore
      StatusBar.setTranslucent(translucent)
    } else if (Platform.OS === 'ios') {
      // @ts-ignore
      StatusBar.setBarStyle(barStyle, true)
    }
  }

  renderDropDown(isOpen: boolean) {
    if (isOpen == true) {
      var style = [Styles.defaultContainer, StyleSheet.flatten(this.props.containerStyle), { backgroundColor: Utils.color.white }];
      // @ts-ignore
      var backgroundColor = Utils.color.appGray;
      var activeStatusBarBackgroundColor = this.props.activeStatusBarBackgroundColor
      if (Platform.OS === 'android') {
        if (this.props.translucent) {
          // @ts-ignore
          style = [style, { paddingTop: StatusBar.currentHeight }]
        }
        if (this.state.type !== 'custom') {
          activeStatusBarBackgroundColor = backgroundColor
        }
      }
      if (this.props.updateStatusBar) {
        // @ts-ignore
        this.renderStatusBar(activeStatusBarBackgroundColor, this.props.activeStatusBarStyle, this.props.translucent)
      }
      return (
        <Animated.View
          // @ts-ignore
          ref={(ref) => this.mainView = ref}
          // @ts-ignore
          {...panResponder.panHandlers}
          style={{
            transform: [{
              //@ts-ignore
              translateY: this.state.animationValue.interpolate({
                inputRange: [0, 1],
                //@ts-ignore
                outputRange: [this.state.startDelta, this.state.endDelta]
              }),
            }],
            position: 'absolute',
            top: this.state.topValue,
            left: 0,
            right: 0,
            elevation: this.props.elevation,
            zIndex: 9999
          }}>
          <TouchableHighlight
            //@ts-ignore
            onPress={(this.props.showCancel) ? null : () => this.onClose('tap')}
            underlayColor={backgroundColor}
            disabled={!this.props.tapToCloseEnabled}
            onLayout={(event) => this.onLayoutEvent(event)}>
            <View style={style}>
              <View style={Styles.textContainer}>
                {this.state.type == "error" ?
                  <Text style={Styles.errorText}>{"Error"}</Text> :
                  <Text style={Styles.infoText}>{"Info"}</Text>}
                <Text style={Styles.messageText}>{this.state.message}</Text>
                
                <TouchableOpacity 
                    style={Styles.cancelBtnContainer}
                    activeOpacity={1} 
                    //@ts-ignore
                    onPress={() => this.onClose(undefined)}>
                
                  
                  <Image source={require('../images/icCancel.png')} 
                    style={{
                      tintColor: Utils.color.appGray,
                      height: Utils.Constant.vh * 0.017,
                      width: Utils.Constant.vw * 0.038
                    }}
                    resizeMethod="resize" resizeMode="contain" 
                  />
                 
                </TouchableOpacity>
              </View>
            </View>
          </TouchableHighlight>
        </Animated.View>
      )
    }
    return null
  }
  render() {
    return (
      this.renderDropDown(this.state.isOpen)
    )
  }
}

var Styles = StyleSheet.create({
  defaultContainer: {
    padding: 8,
    paddingTop: (Platform.OS === 'android') ? 0 : hp("5.3%"),
    flexDirection: 'row',
    shadowColor: 'rgba(0,0,0,0.13)',
    borderBottomWidth: 0.5,
    borderColor: Utils.color.appBorderColor,
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 1,
    elevation: 1,
    zIndex: 10000
  },
  textContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row'
  },
  errorText: {
    color: 'red',
    fontSize: Utils.Constant.vh * 0.020,
    //fontFamily: Constants.Fonts.SSPRO_SEMIBOLD
  },
  infoText: {
    color: '#2B73B6',
    fontSize: Utils.Constant.vh * 0.020,
    //fontFamily: Constants.Fonts.SSPRO_SEMIBOLD
  },
  messageText: {
    color: '#000',
    width: Utils.Constant.vw * 0.68,
    marginLeft: Utils.Constant.vw * 0.02,
    fontSize: Utils.Constant.vh * 0.020,
    //fontFamily: Constants.Fonts.SSPRO_REGULAR
  },
  cancelBtnContainer: {
    position: 'absolute',
    top: Utils.Constant.vh * 0.014,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: Utils.Constant.vh * 0.017,
    width: Utils.Constant.vw * 0.038
  }
})
