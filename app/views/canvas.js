/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Orientation from 'react-native-orientation'
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import canvasScript        from './canvas-script.js'
import reactMixin from  'react-mixin'
import TimerMixin from 'react-timer-mixin';

const injected =` (function () {
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
          var clueData = "replaceClue"
          initDraw(clueData)
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
    ctx.clearRect(0,0,ctx.width,ctx.height)
  }
}());`

export default class Canvas extends Component {
  constructor (props) {
    Orientation.lockToLandscapeLeft()
    super(props)
    this.state = {
      instructions: true,
      time: 7
    }
    this.startTimeRemaining()
  }

  componentDidMount () {
    this.startInstructionCountDown()
  }

  startTimeRemaining () {
    this.interval = this.setInterval( this.updateTimeRemaining, 1000)
  }

  updateTimeRemaining () {
    const { time } = this.state
    this.setState({ time: time - 1 })

    if (this.state.time === 0) {
      this.getCanvasData()
    }
  }

  startInstructionCountDown() {
    this.setTimeout(() => this.removeInstructions(), 5000)
  }

  removeInstructions() {
    this.setState({ instructions: false })
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
        break
      case 'canvas data':
        this.props.sendDrawing(message.data)
        break;
    }
  }

  getCanvasData () {
    this.clearInterval(this.interval)
    const { webviewbridge } = this.refs;
    webviewbridge.sendToBridge('{"message": "extract data"}')
  }

  render() {
    const {time} = this.state
    const { bodyPart, clue } = this.props
    let instructions = null

    if (this.state.instructions) {
      instructions = (<View style={ styles.instructions }>
          <Text>
            Draw the { bodyPart } of the beast!
          </Text>
        </View>)
    }
    const updatedScript = injected.replace('replaceClue', clue)
    return (
      <View style={ styles.container }>
        { instructions }
        <View style= { styles.timerContainer }>
          <Text style={ styles.timer }>
            {time}
          </Text>
        </View>
        <View style={ styles.canvas }>
          <WebViewBridge
            source={ require('./canvas.html') }
            ref='webviewbridge'
            onBridgeMessage = { this.onBridgeMessage.bind(this) }
            scalesPageToFit = { true }
            javaScriptEnabled={ true }
            injectedJavaScript={ updatedScript }
            style={ styles.webview }
          />
        </View>
      </View>)
  }
}
reactMixin(Canvas.prototype, TimerMixin);

const width = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height
const height = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width


const styles = {
  container: {
    flex: 1
  },
  instructions : {
    zIndex: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    position: 'absolute'
  },
  timer : {
    zIndex: 1,
    flex: 1,
    fontSize: 30,
  },
  timerContainer: {
    zIndex: 1,
    position: 'absolute',
    right: 0
  },
  canvas: {
    zIndex: -1,
    width: width,
    height: height,
  },
  webview: {
    flex: 1,
    zIndex: -1
  }
}