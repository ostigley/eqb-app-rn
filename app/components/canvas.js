/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { View, WebView } from 'react-native';


export default class Canvas extends Component {
  render() {
    return (
      <View>
        <WebView
          source={ require('./canvas.html') }
          scalesPageToFit={ true }
          style={ {
            width: 370,
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
