/* eslint-disable complexity */
import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';

import Constants from 'expo-constants';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
} from 'react-native';
import GalleryScreen from './GalleryScreen';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { createReceipt } from '../src/tools/firebase';

import { Ionicons, MaterialIcons, Foundation } from '@expo/vector-icons';
import { StateContext } from '../state';
import CurrentReceipt from './CurrentReceipt';
import LoadingScreen from './LoadingScreen';
import LoadScreen from './LoadScreen';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight',
};

export default class ReceiptScreen extends React.Component {
  static contextType = StateContext;

  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    newPhotos: false,
    permissionsGranted: false,
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    showGallery: false,
    showMoreOptions: false,
    loading: false,
    receiptId: '',
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === 'granted' });
  }

  componentDidMount() {
    FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + 'photos'
    ).catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleView = () =>
    this.setState({ showGallery: !this.state.showGallery, newPhotos: false });

  toggleMoreOptions = () =>
    this.setState({ showMoreOptions: !this.state.showMoreOptions });

  toggleFlash = () =>
    this.setState({ flash: flashModeOrder[this.state.flash] });

  setRatio = ratio => this.setState({ ratio });

  toggleFocus = () =>
    this.setState({ autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on' });

  setFocusDepth = depth => this.setState({ depth });

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({
        onPictureSaved: this.onPictureSaved,
        base64: true,
      });
      console.log('took photo');
    }
  };

  handleMountError = ({ message }) => console.error(message);

  sendToTaggun = async photo => {
    console.log('sending to taggun...');
    this.setState({ loading: true });
    const body = {
      image: photo.base64,
      filename: 'example.jpg',
      contentType: 'image/jpeg',
    };
    try {
      const response = await axios.post(
        'https://api.taggun.io/api/receipt/v1/verbose/encoded',
        body,
        {
          headers: {
            apikey: Constants.manifest.extra.taggunApiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      let theDate = response.data.date.data;
      console.log(JSON.stringify(response.data.amounts));

      // let theIndex = theDate.indexOf('2');
      // let newDate = theDate.slice(theIndex);
      // theDate = await newDate;
      const email = this.context[0].currentUser.email;

      let payees = {};
      payees[email] = true;
      console.log('payees in receipt screen', payees);
      const receipt = {
        date: theDate,
        restaurant: response.data.merchantName.data,
        subtotal: '',
        tip: 0,
        tax: '',
        total: '',
        owner: email,
        payees,
        open: true,
      };
      const receiptItems = [];
      for (let i = 0; i < response.data.amounts.length; i++) {
        let data = response.data.amounts[i].text;

        if (data.includes('Tax') || data.includes('tax')) {
          receipt.tax = Number(response.data.amounts[i].data) * 100;
        }
        if (data[0] === 't' || 'T') {
          receipt.total = Math.ceil(
            Number(response.data.amounts[i].data) * 100
          );
        }
        if (data.includes('Sub') || data.includes('sub')) {
          receipt.subtotal = Number(response.data.amounts[i].data) * 100;
        }
        if (
          !data.includes('Tax') &&
          !data.includes('Sub') &&
          !data.includes('TOTAL')
        ) {
          let theIdx = await data.indexOf('@');
          receiptItems.push({
            amount: data.slice(data.length - 5, data.length),
            name: data.slice(2, theIdx - 1),
            payees,
          });
        }
      }
      let receiptId = await createReceipt(
        receipt,
        receiptItems,
        this.context[0].currentUser
      );
      this.setState({ receiptId: receiptId });
      this.props.navigation.navigate('CurrentReceipt', {
        receiptId: this.state.receiptId,
      });
      // this.props.navigation.navigate('ReceiptForm', {
      //   receiptId: this.state.receiptId,
      // });
      this.setState({ loading: false });
      return;
    } catch (error) {
      console.log('hit an error');
      console.error(error);
    }
  };

  onPictureSaved = async photo => {
    this.sendToTaggun(photo);

    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`,
    });
    this.setState({ newPhotos: true });
  };

  collectPictureSizes = async () => {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(
        this.state.ratio
      );
      let pictureSizeId = 0;
      if (Platform.OS === 'ios') {
        pictureSizeId = pictureSizes.indexOf('High');
      } else {
        pictureSizeId = pictureSizes.length - 1;
      }
      this.setState({
        pictureSizes,
        pictureSizeId,
        pictureSize: pictureSizes[pictureSizeId],
      });
    }
  };

  previousPictureSize = () => this.changePictureSize(1);
  nextPictureSize = () => this.changePictureSize(-1);

  changePictureSize = direction => {
    let newId = this.state.pictureSizeId + direction;
    const length = this.state.pictureSizes.length;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length - 1;
    }
    this.setState({
      pictureSize: this.state.pictureSizes[newId],
      pictureSizeId: newId,
    });
  };

  renderGallery() {
    return <GalleryScreen onPress={this.toggleView.bind(this)} />;
  }

  renderNoPermissions = () => (
    <View style={styles.noPermissions}>
      <Text style={{ color: 'white' }}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>
  );

  renderTopBar = () => <View style={styles.topBar} />;

  renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
        <MaterialIcons
          name={flashIcons[this.state.flash]}
          size={32}
          color="white"
        />
      </TouchableOpacity>
      <View style={{ flex: 0.4 }}>
        <TouchableOpacity
          onPress={this.takePicture}
          style={{ alignSelf: 'center' }}
        >
          <Ionicons name="ios-radio-button-on" size={70} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.bottomButton} onPress={this.toggleView}>
        <View>
          <Foundation name="thumbnails" size={30} color="white" />
          {this.state.newPhotos && <View style={styles.newPhotosDot} />}
        </View>
      </TouchableOpacity>
    </View>
  );

  renderMoreOptions = () => (
    <View style={styles.options}>
      <View style={styles.pictureSizeContainer}>
        <Text style={styles.pictureQualityLabel}>Picture quality</Text>
        <View style={styles.pictureSizeChooser}>
          <TouchableOpacity
            onPress={this.previousPictureSize}
            style={{ padding: 6 }}
          >
            <Ionicons name="md-arrow-dropleft" size={14} color="white" />
          </TouchableOpacity>
          <View style={styles.pictureSizeLabel}>
            <Text style={{ color: 'white' }}>{this.state.pictureSize}</Text>
          </View>
          <TouchableOpacity
            onPress={this.nextPictureSize}
            style={{ padding: 6 }}
          >
            <Ionicons name="md-arrow-dropright" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderCamera = () => (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.camera}
        onCameraReady={this.collectPictureSizes}
        type={this.state.type}
        flashMode={this.state.flash}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        pictureSize={this.state.pictureSize}
        onMountError={this.handleMountError}
      >
        {this.renderTopBar()}
        {this.renderBottomBar()}
      </Camera>

      {this.state.showMoreOptions && this.renderMoreOptions()}
    </View>
  );

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    const content = this.state.showGallery
      ? this.renderGallery()
      : cameraScreenContent;
    if (!this.state.loading && !this.state.receiptId) return content;
    else if (this.state.loading) return <LoadScreen />;
    // else if (this.state.receiptId) {
    //   this.props.navigation.navigate('CurrentReceipt', {
    //     receiptId: this.state.receiptId,
    //   });
    // return (
    //   <CurrentReceipt
    //     receiptId={this.state.receiptId}
    //     navigation={this.props.navigation}
    //   />
    // );
    else {
      return <Text>error</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },

  bottomBar: {
    paddingBottom: ifIphoneX ? 25 : 5,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    flex: 0.12,
    flexDirection: 'row',
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    flex: 0.3,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPhotosDot: {
    position: 'absolute',
    top: 0,
    right: -5,
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: '#4630EB',
  },
  options: {
    position: 'absolute',
    bottom: 80,
    left: 30,
    width: 200,
    height: 160,
    backgroundColor: '#000000BA',
    borderRadius: 4,
    padding: 10,
  },
  detectors: {
    flex: 0.5,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pictureSizeContainer: {
    flex: 0.5,
    alignItems: 'center',
    paddingTop: 10,
  },
  pictureSizeChooser: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  row: {
    flexDirection: 'row',
  },
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: 15,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
