import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Button from 'terra-button/lib/Button';
import Card from 'terra-card/lib/Card';
import ApplicationMenuName from 'terra-application-name/lib/ApplicationMenuName';
import Image from 'terra-image';
import img from './cerner.png';

import Input from 'terra-form-input';

import Login from './login';



class App extends Component {
  render() {
    return (
      <div style={{ border: '1px solid lightGray', backgroundColor: '#2481ca', width: '100%', height: '50px', position: 'relative', }} >
        <ApplicationMenuName title="Cernchain" accessory={<Image src={img} height="80px" width="80px" isFluid />} />
        <div style={{ backgroundColor: '#55d851', width: '100%', height: '5px', position: 'relative', margin: 'auto' }} />
      </div>
    );
  }
}

export default App;
