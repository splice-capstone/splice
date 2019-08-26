import React from 'react';
import { Container } from 'native-base';
import { PacmanIndicator } from 'react-native-indicators';

export default class LoadScreen extends React.Component {
  render() {
    return (
      <Container
        style={{
          backgroundColor: '#3D9970',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PacmanIndicator color="white" size={70} />
      </Container>
    );
  }
}
