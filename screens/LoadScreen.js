import React, { Component } from 'react';
import { Container, Content, Spinner, Text } from 'native-base';
export default class SpinnerExample extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Spinner large color="green" />
          <Text center>one moment...</Text>
        </Content>
      </Container>
    );
  }
}
