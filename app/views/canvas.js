/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Orientation from 'react-native-orientation'
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import Clue          from './clue.js'

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
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    Orientation.lockToLandscapeLeft()
  }

  componentWillUnmount () {
    Orientation.lockToPortrait()
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
        console.log('canvas data', message.data.length)
        this.props.sendDrawing(message.data)
        break
    }
  }

  getCanvasData () {
    const { webviewbridge } = this.refs;
    webviewbridge.sendToBridge('extract data')
  }

  render() {
    const { bodyPart, clue } = this.props
    console.log(Dimensions.get('window').width)
    return (
      <ScrollView>
        <Text>
          Draw the { bodyPart } of the beast!
        </Text>

        <Clue
          styles={ styles.clue }
          clue={ clue } />

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
    width: Dimensions.get('window').width*0.99,
    height: 220,
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
  },
  clue: {
    width: Dimensions.get('window').width*0.99,
    height: 30,
    overflow: 'visible'
  }
}