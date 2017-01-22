/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Orientation from 'react-native-orientation'
import React, { Component } from 'react';
import { View, Text, Image, Dimensions, PixelRatio } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import Clue          from './clue.js'
import canvasScript        from './canvas-script.js'
import reactMixin from  'react-mixin'
import TimerMixin from 'react-timer-mixin';

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
    this.instructions = true
  }

  componentDidMount () {
    Orientation.lockToLandscapeLeft()
    this.setTimeout(this.removeInstructions, 5000)
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

  removeInstructions () {
      this.instructions = false
      this.forceUpdate()
  }

  render() {
    const { bodyPart, clue } = this.props
    let instructions = null
    if (this.instructions) {
      instructions = (<View style={ styles.instructions }>
          <Text>
            Draw the { bodyPart } of the beast!
          </Text>
        </View>)
    }

    return (
      <View style={ styles.container }>
        { instructions }

        <View style={ styles.canvas }>
          <WebViewBridge
            source={ require('./canvas.html') }
            ref='webviewbridge'
            onBridgeMessage = { this.onBridgeMessage.bind(this) }
            scalesPageToFit = { true }
            javaScriptEnabled={ true }
            injectedJavaScript={ injected }
            style={ styles.webview }
          />
        </View>
      </View>)
  }
}
reactMixin(Canvas.prototype, TimerMixin);

const styles = {
  container: {
    flex: 1
  },
  instructions : {
    zIndex: 1,
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    position: 'absolute'
  },
  canvas: {
    zIndex: -1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  webview: {
    flex: 1,
    zIndex: -1
  }
}