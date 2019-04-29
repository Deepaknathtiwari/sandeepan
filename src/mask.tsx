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

    constructor(props: Props) {
        super(props);

    }
    componentDidMount() {

    }

    render() {

        return (
            // Determines shape of the mask
            <View style={styles.container}>
                
                <MaskedViewIOS
                    style={{ flex: 1, flexDirection: 'row', height: '100%' }}
                    maskElement={
                        <View
                            style={{
                                // Transparent background because mask is based off alpha channel.
                                backgroundColor: 'transparent',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: 60,
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}>
                                Basic Mask
                        </Text>
                        </View>
                    }>
                    {/* Shows behind the mask, you can put anything here, such as an image */}
                    <View style={{ flex: 1, height: '100%', backgroundColor: '#324376' }} />
                    <View style={{ flex: 1, height: '100%', backgroundColor: '#F5DD90' }} />
                    <View style={{ flex: 1, height: '100%', backgroundColor: '#F76C5E' }} />
                </MaskedViewIOS>
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
