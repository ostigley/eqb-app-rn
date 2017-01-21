import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
}                           from 'react-native';
import Canvas               from './canvas'
import Final                from './final'
import Connecting           from  './connecting'
import Waiting              from './waiting'
import { connect }  from 'react-redux'
import Orientation from 'react-native-orientation'

import * as controllerActions from '../controllers/game-actions'

class Game extends Component {
  constructor (props) {
    super(props)
    console.log('game play', this.props)
  }

  componentDidMount () {
    if (this.props.level && this.props.level.current == 4 ) {
      Orientation.lockToPortrait()
    }
  }

  render() {
    const { level, sendDrawing, body, part } = this.props
      if (level === 'waiting') {
        return (<Connecting styles={ styles.pendingText } />)
      } else if (!level) {
        return (<Waiting styles={ styles.pendingText } />)
      } else if (level == 4) {
        return (<Final finalImage={ body.final }/>)
      } else {
        return (
          <Canvas
            bodyPart={ part }
            sendDrawing={ sendDrawing }
            clue={ body.clue }
          />)
      }
  }
}

const mapStateToProps = state => {
  return {
    level: state.level,
    body: state.body,
    part: state.part
  }
}

export const GameContainer = connect(
  mapStateToProps,
  controllerActions
)(Game)

const styles = StyleSheet.create({
  pendingText: {
    marginTop: 10,
  }
})