import ArrowLeftIcon from '@carbon/icons/es/arrow--left/32';
import ArrowRightIcon from '@carbon/icons/es/arrow--right/20';
import FlashIcon from '@carbon/icons/es/flash/32';
import FlashOffIcon from '@carbon/icons/es/flash--off/32';
import {useIsFocused} from '@react-navigation/core';
import {router, useLocalSearchParams} from 'expo-router';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Linking, Pressable, StyleSheet, View} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {Camera, useCameraDevice, useCodeScanner} from 'react-native-vision-camera';
import {Button as CarbonButton, ButtonProps, ButtonProps as CarbonButtonProps, CarbonIcon} from '@carbon/react-native';

import type {CameraPermissionStatus, Code} from 'react-native-vision-camera';

import {useIsForeground} from '@/hooks/useIsForeground';
import {deleteCallback, getCallback} from '@/utils/navigationHelper';

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
				<Pressable style={styles.buttonContainer}>
          <CarbonButton
            disableDesignPadding
            text=''
            onPress={() => setTorch(!torch)}
			      style={styles.button}
            icon={torch ? FlashIcon : FlashOffIcon}
			      kind='tertiary'
		      />
				</Pressable>
			</View>

			<View style={styles.backButton}>
				<Pressable style={styles.buttonContainer}>
          <CarbonButton
            disableDesignPadding
            text=''
            onPress={back}
			      style={styles.button}
            icon={ArrowLeftIcon}
			      kind='tertiary'
		      />
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
	buttonContainer: {
		marginBottom: 15,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		borderWidth: 0,
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