/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Orientation from 'react-native-orientation'
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Dimensions, PixelRatio } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import Clue          from './clue.js'
import canvasScript        from './canvas-script.js'

const injected = `(function () {
  if (WebViewBridge) {

    WebViewBridge.send(JSON.stringify({action: 'Initiating'}));

    WebViewBridge.onMessage = function (action) {
      switch(JSON.parse(action)['message']) {
        case 'handshake confirmation please':
          WebViewBridge.send(JSON.stringify( {action: 'Confirming'} ))
          break;
        case 'dimensions':
          var dimensions = JSON.parse(action)['dimensions']
          var canvas = '${canvasScript}'.replace('replaceWidth', dimensions['width'])
          canvas = canvas.replace('replaceHeight', dimensions['height'])
          document.querySelector('body').innerHTML = canvas
          initDraw()
          break;
        case 'extract data':
          deliverCanvas()
          break;
        default:
          break;
      }

    }
  }

  function deliverCanvas () {
    const canvas = document.querySelector('canvas')
    WebViewBridge.send(JSON.stringify({
      action: 'canvas data',
      data: canvas.toDataURL()
    }))
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
  }

}());`


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

  onBridgeMessage(message) {
    message = JSON.parse(message)
    const { webviewbridge } = this.refs;
    switch (message['action']) {
      case 'Initiating':
        console.log('WebViewBridge Link initiated')
        webviewbridge.sendToBridge('{"message": "handshake confirmation please"}')
        break
      case 'Confirming':
        const {width, height} = this.props.dimensions
        console.log('Link confirmed')
        webviewbridge.sendToBridge(`{"message": "dimensions", "dimensions": {"width": ${width} , "height": ${height} }}`)
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
    width: Dimensions.get('window').width,
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
    width: Dimensions.get('window').width,
    height: 30,
    overflow: 'visible'
  }
}