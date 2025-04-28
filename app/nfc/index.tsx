import { useEffect } from 'react';
import { Button } from 'react-native';
import { Link } from 'expo-router';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

async function readNdef() {
  try {
    // register for the NFC tag with NDEF in it
    await NfcManager.requestTechnology(NfcTech.Ndef);
    // the resolved tag object will contain `ndefMessage` property
    const tag = await NfcManager.getTag();
    console.warn('Tag found', tag);
  } catch (ex) {
    console.warn('Oops!', ex);
  } finally {
    // stop the nfc scanning
    NfcManager.cancelTechnologyRequest();
  }
}

async function writeNdef({type, value}: {type: any, value: any}) {
  let result = false;

  try {
    // STEP 1
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const bytes = Ndef.encodeMessage([Ndef.textRecord('Hello NFC')]);

    if (bytes) {
      await NfcManager.ndefHandler // STEP 2
        .writeNdefMessage(bytes); // STEP 3
      result = true;
    }
  } catch (ex) {
    console.warn(ex);
  } finally {
    // STEP 4
    NfcManager.cancelTechnologyRequest();
  }

  return result;
}

async function readMifare() {
  let mifarePages: any[] = [];

  try {
    // STEP 1
    let reqMifare = await NfcManager.requestTechnology(
      NfcTech.MifareUltralight,
    );

    const readLength = 60;
    const mifarePagesRead = await Promise.all(
      [...Array(readLength).keys()].map(async (_, i) => {
        const pages = await NfcManager.mifareUltralightHandlerAndroid // STEP 2
          .mifareUltralightReadPages(i * 4); // STEP 3
        mifarePages.push(pages);
      }),
    );
  } catch (ex) {
    console.warn(ex);
  } finally {
    // STEP 4
    NfcManager.cancelTechnologyRequest();
  }

  return mifarePages;
}

export default function NfcHomeScreen() {
  useEffect(() => {
    // Pre-step, call this before any NFC operations
    NfcManager.start();

    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  return (
    <ThemedView>
      <Button title='Read Mifare' onPress={() => console.log(readMifare())}/>
      <Button title='Read NDEF' onPress={() => readNdef()} />
      <Button title='Write NDEF' onPress={() => writeNdef({type: 'type', value: 'value'})} />
      <Link href='/nfc/nfcIntegration'>
        <ThemedText>NFC Integration</ThemedText>
      </Link>
      <Link href='/nfc/prompt'>
        <ThemedText>NFC Prompt</ThemedText>
      </Link>
    </ThemedView>
  );
}
