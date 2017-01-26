/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
var Orientation = require('react-native').NativeModules.Orientation
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Dimensions, PixelRatio } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';

const injected =`
(function () {
  if (WebViewBridge) {
    WebViewBridge.send(JSON.stringify({action: 'Initiating', data: {}}))

    WebViewBridge.onMessage = function (action) {
      switch (action) {
        case 'handshake confirmation please':
          WebViewBridge.send(JSON.stringify({
            action: 'Confirming', data: { height: window.innerHeight, width: window.innerWidth }
          }))
          break
      }
    };
  }
}());`


export default class TestDimensions extends Component {
  constructor (props) {
    super(props)
  }

  onBridgeMessage(incoming) {
    message = JSON.parse(incoming)
    const { webviewbridge } = this.refs;
    switch (message['action']) {
      case 'Initiating':
        console.log('TestDimension WebViewBridge Link initiated')
        webviewbridge.sendToBridge('handshake confirmation please')
        break
      case 'Confirming':
        console.log('TestDimension Link confirmed')
        this.props.sendDimensions(message.data)
        break
    }
  }

  render() {
    var Orientation = require('react-native').NativeModules.Orientation
    Orientation.lockToLandscapeLeft()
    debugger
    return (
        <WebViewBridge
          source={ require('./canvas.html') }
          ref='webviewbridge'
          onBridgeMessage = { this.onBridgeMessage.bind(this) }
          scalesPageToFit = { true }
          javaScriptEnabled={ true }
          injectedJavaScript={ injected }
          style={ styles.webview }
        />
    )
  }
}

const styles = {
  webview: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    zIndex: 0,
    opacity: 0,

  }
}