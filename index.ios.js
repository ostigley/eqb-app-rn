import React, { Component } from 'react'
import { AppRegistry }      from 'react-native'
import App                  from './app/app'
const HiddenDoodleApp = () => <App/>

AppRegistry.registerComponent('HiddenDoodleApp', () => HiddenDoodleApp);
