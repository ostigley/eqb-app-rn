import { Text, StyleSheet } from 'react-native'
import React    from 'react'
const Spinner = () =>
  <Text style={ styles.spin } >
    Finding some doodlers for you...
  </Text>


export default Spinner

const styles = StyleSheet.create({
  spin: {
    marginTop: 10,
  }
})