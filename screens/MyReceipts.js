import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Container, Content } from 'native-base';
import { useStateValue } from '../state';
import { getMyReceipts } from '../src/tools/firebase/index';
import MyReceiptsCard from './MyReceiptsCard';

const MyReceipts = props => {
  const [{ currentUser }, dispatch] = useStateValue();
  const [myRecps, setMyReceipts] = useState([]);

  useEffect(() => {
    getMyReceipts(currentUser.email).then(data => {
      setMyReceipts(data);
    });
  }, []);

  return myRecps.length > 0 && Array.isArray(myRecps) ? (
    <Container>
      <Content>
        {myRecps.map(recData => {
          return (
            <MyReceiptsCard
              key={recData.id}
              recptsData={recData}
              navigation={props.navigation}
            />
          );
        })}
      </Content>
    </Container>
  ) : (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3D9970" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyReceipts;
