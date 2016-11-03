/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Orientation from 'react-native-orientation'
import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';

const injected = `
(function () {
  if (WebViewBridge) {
    WebViewBridge.send(JSON.stringify({action: 'Initiating', data: {}}))

    WebViewBridge.onMessage = function (action) {
      switch (action) {
        case 'handshake confirmation please':
          WebViewBridge.send(JSON.stringify({
            action: 'Confirming', data: {}
          }))
          break
        case 'extract data':
          deliverCanvas()
          break
      }
    };
  }

  function deliverCanvas () {
    const canvas = document.querySelector('canvas')
    WebViewBridge.send(JSON.stringify({
      action: 'canvas data',
      data: canvas.toDataURL()
    }))
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,950,300)
  }

}());
`

export default class Canvas extends Component {
  componentDidMount () {
    Orientation.lockToLandscapeLeft()
  }

  onBridgeMessage(incoming) {
    message = JSON.parse(incoming)
    const { webviewbridge } = this.refs;
    switch (message['action']) {
      case 'Initiating':
        console.log('WebViewBridge Link initiated')
        webviewbridge.sendToBridge('handshake confirmation please')
        break
      case 'Confirming':
        console.log('Link confirmed')
        this.componentDidMount()
        break
      case 'canvas data':
        console.log(message.data)
        break
      default:
      console.log('Unknown message recieved')
      console.log(message['action'])
      console.log(message['data'])
    }
  }

  getCanvasData () {
    console.log('finished')
    const { webviewbridge } = this.refs;
    webviewbridge.sendToBridge('extract data')
  }

  render() {
    return (
      <ScrollView>
        <WebViewBridge
          source={ require('./canvas.html') }
          ref='webviewbridge'
          onBridgeMessage = { this.onBridgeMessage.bind(this) }
          scalesPageToFit = { true }
          javaScriptEnabled={ true }
          injectedJavaScript={ injected }
          style={ styles.webview }
        />
        <View style={ styles.buttonParent }>
          <Text
            onPress={ () => this.getCanvasData() }
            style={ styles.button }>
              I'm Finished
          </Text>
        </View>
      </ScrollView>
    )
  }
}

const styles = {
  webview: {
    width: 650,
    height: 220,
    backgroundColor: 'blue'
  },
  buttonParent: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    height: 50,
    width: 150,
    textAlign: 'center',
    paddingTop: 15
  }
}
