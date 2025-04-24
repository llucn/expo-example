import { useEffect, useState } from 'react';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NFCIntegrationScreen() {
  const [ value, setValue ] = useState<string>('N/A');
  const [ payload, setPayload ] = useState<number[]>([]);
  
  useEffect(() => {
    // Initialize NFC Manager
    NfcManager.start();

    // Add event listeners
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      console.log('Tag Discovered', tag);
      setValue(JSON.stringify(tag));
      if (tag.ndefMessage && tag.ndefMessage[0]) {
        setPayload(tag.ndefMessage[0].payload);
      }
      NfcManager.setAlertMessageIOS('NFC Tag Discovered');
      NfcManager.unregisterTagEvent().catch(() => 0);
    });

    // Enable NFC reading
    NfcManager.registerTagEvent();

    // Clean up
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch(() => 0);
      // NfcManager.stop();
    };
  }, []);

  return (
    <ThemedView>
      <ThemedText>NFC Tag: {JSON.stringify(value)}</ThemedText>
      <ThemedText>Payload: {String.fromCharCode(...payload)}</ThemedText>
    </ThemedView>
  );
}