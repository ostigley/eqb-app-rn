import React, { Component } from 'react';
import { Image } from 'react-native';

const Clue = ({styles, clue}) => {
	if (clue === '') {
		return null
	} else {
		<Image
			style={ styles }
			source={ {uri: clue } }
			resizeMode={'stretch'} />
	}
}

export default Clue