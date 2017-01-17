import React, { Component } from 'react';
import { Image, Text } from 'react-native';

const Clue = ({styles, clue}) => {
	if (clue === '') {
		return <Text>No clue</Text>
	} else {
		return <Image
			style={ styles }
			source={ {uri: clue } }
			resizeMode={'stretch'} />
	}
}

export default Clue