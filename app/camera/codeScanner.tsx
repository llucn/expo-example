import {useIsFocused} from '@react-navigation/core';
import {router, useLocalSearchParams} from 'expo-router';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Linking, Pressable, StyleSheet, View} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {Camera, useCameraDevice, useCodeScanner} from 'react-native-vision-camera';
import IonIcon from 'react-native-vector-icons/Ionicons';

import type {CameraPermissionStatus, Code} from 'react-native-vision-camera';

import {useIsForeground} from '@/hooks/useIsForeground';
import {deleteCallback} from '@/utils/navigationHelper';

export default function CodeScannerScreen() {
  const {callbackHandle} = useLocalSearchParams();
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined');
  const device = useCameraDevice('back');

  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const [torch, setTorch] = useState(false);

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') await Linking.openSettings();

    setCameraPermissionStatus(permission);
  }, []);

  const onCodeScanned = useCallback((codes: Code[]) => {
    const value = codes[0]?.value;
    // const callback = getCallback(callbackHandle);
    console.log(`onCodeScanned callback(${value})`);
    // callback(value);
    deleteCallback(callbackHandle);
    router.back();
  }, []);

  const back = () => {
    deleteCallback(callbackHandle);
    router.back();
  };

  useEffect(() => {
    requestCameraPermission();

    return () => {
      deleteCallback(callbackHandle);
    };
  }, []);

	const codeScanner = useCodeScanner({
		codeTypes: [
			'code-128',
			'code-39',
			'code-93',
			'codabar',
			'ean-13',
			'ean-8',
			'itf',
			'upc-e',
			'upc-a',
			'qr',
			'pdf-417',
			'aztec',
			'data-matrix',
		],
		onCodeScanned,
	});

	return (
		<View style={styles.container}>
			{device && cameraPermissionStatus === 'granted' && (
				<Camera
					style={StyleSheet.absoluteFill}
					device={device}
					isActive={isActive}
					codeScanner={codeScanner}
					torch={torch ? 'on' : 'off'}
					enableZoomGesture
				/>
			)}

			<View style={styles.rightButtonRow}>
        <Pressable style={styles.button} onPress={() => setTorch(!torch)}>
          <IonIcon name={torch ? 'flash' : 'flash-off'} color='white' size={24} />
				</Pressable>
			</View>

			<View style={styles.backButton}>
        <Pressable style={styles.button} onPress={back}>
          <IonIcon name='chevron-back' color='white' size={35} />
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
	button: {
		marginBottom: 15,
		width: 40,
		height: 40,
		borderRadius: 40 / 2,
		backgroundColor: 'rgba(140, 140, 140, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	rightButtonRow: {
		position: 'absolute',
		right: StaticSafeAreaInsets.safeAreaInsetsRight + 15,
		top: StaticSafeAreaInsets.safeAreaInsetsTop + 15,
	},
	backButton: {
		position: 'absolute',
		left: StaticSafeAreaInsets.safeAreaInsetsLeft + 15,
		top: StaticSafeAreaInsets.safeAreaInsetsTop + 15,
	},
});