import { useState } from 'react';
import { TextInput, SafeAreaView, StyleSheet } from 'react-native';
import { createWebView, bridge } from "@webview-bridge/react-native";

import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

// Register functions in the bridge object in your React Native code
export const appBridge = bridge({
  async regard(name: string) {
    return `Hello, ${name}`;
  },
});

// Export the bridge type to be used in the web application
export type AppBridge = typeof appBridge;

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  debug: true, // Enable console.log visibility in the native WebView
});

export default function TabTwoScreen() {
  const color = useThemeColor({}, 'text');
  const [ uri, setUri ] = useState<string>("http://192.168.10.1");
  const [ text, setText ] = useState<string>(uri);

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
        source={{
          uri
        }}
        style={{ height: "100%", flex: 1, width: "100%" }}
      />
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