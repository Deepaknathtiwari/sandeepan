/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { MaskedViewIOS, StyleSheet, View, Animated, Image, Easing, Text } from 'react-native';

type Props = {};
export default class App extends Component<Props> {
    private spinValue: any;
    private animatedValue: any;
    constructor(props: Props) {
        super(props);
        this.spinValue = new Animated.Value(0);
        this.animatedValue = new Animated.Value(0)
    }
    componentDidMount() {
        this.spin();
        this.animate();
    }
    spin() {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 600,
                easing: Easing.linear
            }
        ).start(() => this.spin())
    }
    animate() {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }
    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        const marginLeft = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 300]
        })
        const rotateX = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '180deg', '0deg']
        })
        return (
            <View style={styles.container}>

                <Animated.Image
                    style={{
                        width: 227,
                        height: 200,
                        transform: [{ rotate: spin }]
                    }}
                    source={{ uri: 'https://s3.amazonaws.com/media-p.slid.es/uploads/alexanderfarennikov/images/1198519/reactjs.png' }}
                />
                <Animated.View
                    style={{
                        marginLeft,
                        height: 30,
                        width: 40,
                        backgroundColor: 'red'
                    }} />
                <Animated.View
                    style={{
                        transform: [{ rotateX }],
                        marginTop: 50,
                        height: 30,
                        width: 40,
                        backgroundColor: 'black'
                    }}>
                    <Text style={{ color: 'white' }}>Hello from TransformX</Text>
                </Animated.View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});
