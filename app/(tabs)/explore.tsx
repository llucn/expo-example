import { useState, useRef } from 'react';
import { TextInput, SafeAreaView, StyleSheet } from 'react-native';
import { createWebView, type BridgeWebView, bridge, postMessageSchema } from "@webview-bridge/react-native";
import { z } from "zod";
import { Ndef } from 'react-native-nfc-manager';
import { useOutlet, getOutlet } from 'reconnect.js';

import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { randomStringId, deleteCallback, navigateWithCallback } from '@/utils/navigationHelper';
import NfcProxy from '@/utils/NfcProxy';
import NfcPromptAndroid from '@/components/NfcPromptAndroid';

// Register functions in the bridge object in your React Native code
export const appBridge = bridge({
  async getColorScheme() {
    return 'light';
  },
  async scanCode() {
    return new Promise<string | undefined>((resolve) => {
      const id = navigateWithCallback({
        pathname: '/camera/codeScanner',
        params: {},
        callback: (value) => {
          console.log('callback:', value);
          postMessage('scanCodeResult', {id, value});
          // deleteCallback(id);
        },
      });
      resolve(id);
    });
  },
  async supportNfc() {
    return NfcProxy.isEnabled();
  },
  async readNfcTag() {
    return new Promise<string | undefined>((resolve) => {
      const id = randomStringId();
      NfcProxy.readTag().then(tag => {
        console.log('read tag', tag.ndefMessage[0].payload);
        if (tag && tag.ndefMessage) {
          const ndef = Array.isArray(tag.ndefMessage) && tag.ndefMessage.length > 0 ? tag.ndefMessage[0] : null;
          const text = Ndef.text.decodePayload(ndef.payload);
          const msg = {id, value: text};
          console.log('read tag', msg);
          postMessage('readNfcTagResult', msg);
        }
      });
      resolve(id);
    });
  },
});

export const appSchema = postMessageSchema({
  scanCodeResult: {
    validate: (val) => {
      return z.object({ 
        id: z.string(), 
        value: z.string() 
      }).parse(val);
    },
  },
  readNfcTagResult: {
    validate: (val) => {
      return z.object({ 
        id: z.string(), 
        value: z.string() 
      }).parse(val);
    },
  },
});

// export type AppPostMessageSchema = typeof appSchema;
// Export the bridge type to be used in the web application
// export type AppBridge = typeof appBridge;

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  postMessageSchema: appSchema,
  debug: true, // Enable console.log visibility in the native WebView
  fallback: (method) => {
    console.warn(`Method '${method}' not found in native`);
  },
});

export default function TabTwoScreen() {
  const color = useThemeColor({}, 'text');
  const [ uri, setUri ] = useState<string>("http://192.168.10.152:3000");
  const [ text, setText ] = useState<string>(uri);
  const webviewRef = useRef<BridgeWebView>(null);

  useOutlet('androidPrompt', {
    visible: false,
    message: '',
  });

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <ThemedView>
        <TextInput 
          style={{...styles.input, color}}
          value={text} 
          onChangeText={s => setText(s)} 
          keyboardType='url'
          autoCapitalize='none'
          onBlur={() => setUri(text)}
        />
      </ThemedView>
      <WebView
        ref={webviewRef}
        source={{
          uri
        }}
        style={{ height: "100%", flex: 1, width: "100%" }}
      />
      <NfcPromptAndroid/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});