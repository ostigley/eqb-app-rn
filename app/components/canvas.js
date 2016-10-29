/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Orientation from 'react-native-orientation'
import React, { Component } from 'react';
import { View, WebView } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';

const injected = `
  (function () {
          console.log(WebViewBridge, "webview bridge")
          WebViewBridge.onMessage = function (reactNativeData) {
            WebViewBridge.send("got the message")
            // var jsonData = JSON.parse(reactNativeData);
            // WebViewBridge.send(dataToSend);
          };
      }())
`

export default class Canvas extends Component {
  componentDidMount () {
    Orientation.lockToLandscapeLeft()

    this.refs.webviewbridge.sendToBridge('Hello World')
  }

  onBridgeMessage(webviewData) {
    Alert.alert(webviewData);
  }



  render() {
    return (
      <View>
        <WebViewBridge
          source={ require('./canvas.html') }
          ref="webviewbridge"
          onBridgeMessage ={this.onBridgeMessages}
          scalesPageToFit={ true }
          injectedJavascript={injected}
          style={ {
            width: 650,
            backgroundColor: 'blue'
          } }
        />
      </View>
    )
  }
}
