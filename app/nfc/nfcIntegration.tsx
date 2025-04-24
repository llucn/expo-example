import { useEffect, useState } from 'react';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

import { ThemedText } from '@/components/ThemedText';

export default function NFCIntegrationScreen() {
  const [ value, setValue ] = useState('N/A');
  
  useEffect(() => {
    // Initialize NFC Manager
    NfcManager.start();

    // Add event listeners
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      console.log('Tag Discovered', tag);
      setValue(tag);
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
    <ThemedText>NFC Tag: {value}</ThemedText>
  );
}