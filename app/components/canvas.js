/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Orientation from 'react-native-orientation'
import React, { Component } from 'react';
import { View, WebView, Alert } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';

const injected = `
            WebViewBridge.send("Sending from Webview")
`

export default class Canvas extends Component {
  componentDidMount () {
    Orientation.lockToLandscapeLeft()
    // this.refs.webviewbridge.sendToBridge('Hello World')
  }

  onBridgeMessage(data) {
    Alert.alert('Alert Box', data, {text: 'Ok', onPress: () => console.log('OK Pressed!')});
  }

  render() {
    return (
      <View>
        <WebViewBridge
          source={ require('./canvas.html') }
          ref="webviewbridge"
          onBridgeMessage = { this.onBridgeMessage.bind(this) }
          scalesPageToFit = { true }
          injectedJavaScript={ injected }
          style={ {
            width: 650,
            height: 100,
            backgroundColor: 'blue'
          } }
        />
      </View>
    )
  }
}
