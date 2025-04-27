import { useEffect, useState } from 'react';
import { Button, Pressable } from 'react-native';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import { useOutlet, getOutlet } from 'reconnect.js';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import NfcPromptAndroid from '@/components/NfcPromptAndroid';
import NfcProxy from '@/utils/NfcProxy';

export default function PromptScreen() {
  const [ enabled, setEnabled ] = useState(false);
  const [ value, setValue ] = useState({});

  useEffect(() => {
    async function init() {
      const value = await NfcProxy.isEnabled();
      setEnabled(value);
    }
    init();
  }, []);

  useOutlet('androidPrompt', {
    visible: false,
    message: '',
  });

  const scanTag = async () => {
    const tag = await NfcProxy.readTag();
    setValue(tag);
  };

  return (
    <ThemedView>
      <ThemedText>Enabled: {JSON.stringify(enabled)}</ThemedText>
      <Button title='SCAN NFC TAG' onPress={scanTag}/>
      <ThemedText>Tag Detail: {JSON.stringify(value)}</ThemedText>
      <NfcPromptAndroid />
    </ThemedView>
  );
}