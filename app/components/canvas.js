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
(function () {
  if (WebViewBridge) {

    WebViewBridge.onMessage = function (message) {
        WebViewBridge.send("got the message inside webview");
    };

    WebViewBridge.send("hello from webview");
  }
}());
`

export default class Canvas extends Component {
  componentDidMount () {
    Orientation.lockToLandscapeLeft()
  }

  onBridgeMessage(message) {
    const { webviewbridge } = this.refs;
    console.log(message)
    switch (message) {
      case "hello from webview":
        console.log('received initial message')
        webviewbridge.sendToBridge("hello from react-native");
        break;
      case "got the message inside webview":
        console.log("we have got a message from webview! yeah");
        break;
    }
  }

  render() {
    return (
      <View>
        <WebViewBridge
          source={ require('./canvas.html') }
          ref="webviewbridge"
          onBridgeMessage = { this.onBridgeMessage.bind(this) }
          scalesPageToFit = { true }
          javaScriptEnabled={true}
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
