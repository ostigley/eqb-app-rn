import React, { Component } from 'react';
import { Image, Text } from 'react-native';

const Final = ({finalImage}) => {
	return <Image
	style={ styles }
	source={ {uri: finalImage } }
	resizeMode={'stretch'} />
}

export default Final

const styles = {
  flex: 1
}