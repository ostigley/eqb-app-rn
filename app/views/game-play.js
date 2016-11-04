import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
}                           from 'react-native';
import Orientation          from 'react-native-orientation'
import Canvas               from './canvas'
import Connecting           from  './connecting'
import Waiting              from './waiting'
import { connect }  from 'react-redux'
import * as controllerActions from '../controllers/game-actions'


class Game extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    const { level } = this.props
      if (level === 'waiting') {
        return (<Connecting styles={ styles.pendingText } />)
      } else if (level === null) {
        return <Waiting styles={ styles.pendingText } />
      } else {
        return (<Canvas />)
      }
  }
}

const mapStateToProps = state => {
  return {
    level: state.level,
    body: state.body,
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