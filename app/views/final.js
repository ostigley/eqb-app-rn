import React, { Component } from 'react';
import { Image, Text, ScrollView, Dimensions } from 'react-native';
var Orientation = require('react-native').NativeModules.Orientation

const Final = ({ finalImage }) => {
  Orientation.lockToPortrait()

  const width = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width
  const height = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height

  const styles = {
    image: {
      flex: 1,
      overflow: 'visible',
      borderColor: 'red',
      borderWidth: 5,
      width: width,
      height: height
    },
    container: {
      flex: 1
    }
  }


  return (
    <ScrollView>
      <Image
        style={ styles.image }
        source={ { uri: 'https://upload.wikimedia.org/wikipedia/commons/6/63/African_elephant_warning_raised_trunk.jpg' } }
        resizeMethod={ 'auto' }
        resizeMode={ 'cover' } />
    </ScrollView>)
}

export default Final

