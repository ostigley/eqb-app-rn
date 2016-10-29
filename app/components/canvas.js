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
    WebViewBridge.send(JSON.stringify({message: 'Initiating', data: {}}));

    WebViewBridge.onMessage = function (message) {
      if (message === "handshake confirmation please") {
        WebViewBridge.send(JSON.stringify({message: 'Confirming', data: {}}));
      } else {
        // other things here regarding canvas
        document.querySelector('#test').innerHTML = "Time to go HOOOOOOME?"
      }
    };

  }
}());
`

export default class Canvas extends Component {
  componentDidMount () {
    Orientation.lockToLandscapeLeft()
    const { webviewbridge } = this.refs;
    webviewbridge.sendToBridge("");
  }

  onBridgeMessage(data) {
    data = JSON.parse(data)
    const { webviewbridge } = this.refs;
    switch (data["message"]) {
      case "Initiating":
        console.log('WebViewBridge Link initiated')
        webviewbridge.sendToBridge("handshake confirmation please");
        break;
      case "Confirming":
        console.log("Link confirmed");
        this.componentDidMount()
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
