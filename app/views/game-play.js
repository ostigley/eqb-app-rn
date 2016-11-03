import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
}                           from 'react-native';
import Orientation          from 'react-native-orientation'
import Canvas               from './canvas'
import Spinner              from  './spinner'
import { connect }  from 'react-redux'
import * as controllerActions from '../controllers/game-actions'


class Game extends Component {
  constructor (props) {
    super(props)
    console.log('props from game container', this.props)
  }

  render() {
      console.log(this.state)
      if (this.props.level === 'waiting') {
        return (<Spinner />)
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

