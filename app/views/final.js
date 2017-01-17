import React, { Component } from 'react';
import { Image, Text } from 'react-native';

const Final = ({finalImage}) => {
	return <Image
	style={ {width: 900,height: 600} }
	source={ {uri: finalImage } }
	resizeMode={'stretch'} />
}

export default Final