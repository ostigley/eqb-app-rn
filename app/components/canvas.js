/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Orientation from 'react-native-orientation'
import React, { Component } from 'react';
import { View, WebView } from 'react-native';


export default class Canvas extends Component {
  componentDidMount () {
    Orientation.lockToLandscapeLeft()
  }

  render() {
    return (
      <View>
        <WebView
          source={ require('./canvas.html') }
          scalesPageToFit={ true }
          style={ {
            width: 650,
            backgroundColor: 'blue'
          } }
        />
      </View>
    );
  }
}

        // <WebView
        //   source={{uri: 'https://github.com/facebook/react-native'}}
        //   style={{marginTop: 20}}
        // />
