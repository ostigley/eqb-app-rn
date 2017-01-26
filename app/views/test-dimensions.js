/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
var Orientation = require('react-native').NativeModules.Orientation
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Dimensions, PixelRatio, WebView } from 'react-native';
// import WebViewBridge from 'react-native-webview-bridge';

const injected =`
(function () {
  if (window.postMessage) {
    window.postMessage(JSON.stringify({action: 'Initiating', data: {}}))

    WebViewBridge.onMessage = function (action) {
      switch (action) {
        case 'handshake confirmation please':
          window.postMessage(JSON.stringify({
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
    console.log('message from test webview',incoming)
    switch (message['action']) {
      case 'Initiating':
        console.log('TestDimension WebViewBridge Link initiated')
        this.webview.postMessage('handshake confirmation please')
        break
      case 'Confirming':
        console.log('TestDimension Link confirmed')
        this.props.sendDimensions(message.data)
        break
    }
  }

  render() {
    
    return (
        <WebView
          source={ {html: '<!DOCTYPE html><html style="width:100%;"><head></head><body style="height:100%;width:100%;margin:0;padding:0"><h1>Hello World</h1></body></html>'} }
          ref='webviewbridge'
          onMessage = { this.onBridgeMessage.bind(this) }
          scalesPageToFit = { true }
          javaScriptEnabled={ true }
          injectedJavaScript={ '' }
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