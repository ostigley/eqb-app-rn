
var Orientation = require('react-native').NativeModules.Orientation
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import canvasScript        from './canvas-script.js'
import reactMixin from  'react-mixin'
import TimerMixin from 'react-timer-mixin';

const injected =`(function () {
    if (window.WebViewBridge) {
      WebViewBridge.send(JSON.stringify({"action": 'Initiating'}));

      WebViewBridge.onMessage = function (action) {
        switch(JSON.parse(action)['message']) {
          case 'handshake confirmation please':
            WebViewBridge.send(JSON.stringify( {"action": 'Confirming'} ));
            break;
          case 'dimensions':
            var dimensions = JSON.parse(action)['dimensions'];
            var canvas = '${canvasScript}'.replace('replaceWidth', dimensions['width']);
            canvas = canvas.replace('replaceHeight', dimensions['height']);
            document.querySelector('body').innerHTML = canvas;
            var clueData = "replaceClue";
            initDraw(clueData);
            break;
          case 'extract data':
            deliverCanvas();
            break;
          default:
            break;
        }
      }
    }

    function initDraw (clue) {
      var canvas = document.querySelector("#mycanvas");
      canvas.addEventListener("touchstart", handleStart, false);
      canvas.addEventListener("touchmove", handleMove, false);


      var ctx = canvas.getContext("2d");
      if (clue !== '') {
        var clueImage = new Image;
        clueImage.onload = function () {
          ctx.drawImage(clueImage, 0,0);
        };
        clueImage.src = clue;
      }
      ctx.strokeStyle= "black";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";

      var touch = {x: 0, y: 0};

      function handleMove(evt) {
        evt.preventDefault();
        var touched = evt.changedTouches[0];
        newX = touched.pageX - canvas.offsetLeft;
        newY = touched.pageY - canvas.offsetTop;
        ctx.lineTo(touch.x, touch.y);
        ctx.stroke();
        touch.x = newX;
        touch.y = newY;
      }

      function handleStart(evt) {
        evt.preventDefault();
        var touched = evt.changedTouches[0];
        touch.x = touched.pageX - canvas.offsetLeft;
        touch.y = touched.pageY - canvas.offsetTop;
        ctx.beginPath();
        ctx.moveTo(touch.x, touch.y);
      };

    };
    function deliverCanvas () {
      const canvas = document.querySelector('canvas');
      WebViewBridge.send(JSON.stringify({ action: 'canvas data', data: canvas.toDataURL() }));
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,ctx.width,ctx.height);
    };
  })();`

export default class Canvas extends Component {
  constructor (props) {
    Orientation.lockToLandscapeLeft()
    super(props)
    this.state = {
      instructions: true,
      time: 8
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
    const {time, instructions } = this.state
    this.setState({
      instructions: instructions,
      time: time - 1
    })

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
    } else {
      instructions = <View></View>
    }
    const updatedScript = injected.replace('replaceClue', clue)
    return (
      <View>
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

var {width, height} = Dimensions.get('window')
width = width > height ? width : Dimensions.get('window').height
height = height < width ? height : Dimensions.get('window').width


const styles = {
  container: {
    flex: 1
  },
  instructions : {
    zIndex: 1,
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
    flex: 1,
    zIndex: 0,
    width: width,
    height: height
  },
  webview: {
    flex: 1,
    zIndex: -1
  }
}