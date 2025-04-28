import { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowRightIcon from '@carbon/icons/es/arrow--right/20';
import {
  Text as CarbonText, 
  TextProps as CarbonTextProps, 
  TextInput as CarbonTextInput, 
  TextInputProps as CarbonTextInputProps,
  Button as CarbonButton, 
  ButtonProps as CarbonButtonProps, 
  CarbonIcon
} from '@carbon/react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SimpleScreen() {
  const [ text, setText ] = useState('');

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={styles.container}
        style={styles.view}
      >
        <CarbonText 
          text='At Vero Eos et Accusamus' 
          type='heading-05' 
        />
        <CarbonTextInput 
          label='Consectetur Adipiscing Elit'
          helperText='Lorem ipsum dolor sit amet'
          value={text} 
          onChangeText={setText} 
          placeholder={'Sunt in culpa qui officia deserunt mollit anim id est laborum'} 
        />
        <CarbonButton 
          text='Nulla Pariatur'
          icon={ArrowRightIcon}
          onPress={() => console.log(text)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const padding = 10; // default padding

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  // centers elements horizontally and vertically
  screen: {
    width: width < height ? undefined : '50%',
    maxWidth: width < height ? 600 : undefined,
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  // contains the entire prompt; stretches horizontally to match parent
  prompt: {
    flexDirection: 'column', 
    alignItems: 'center', 
    width: '100%', 
    padding
  },
  input: {
    width: '100%', 
    marginTop: padding
  },
  button: {
    marginTop: padding, 
    width: '100%', 
    maxWidth: 400
  },
  view: {
    padding: 16, 
    paddingTop: 8, 
    flex: 1
  },
  container: {
    flexGrow: 1, 
    paddingBottom: 64
  },
  baseSpacing: {
    marginTop: 16
  },
  loginButton: {
    marginTop: 32, 
    marginBottom: 32
  },
});