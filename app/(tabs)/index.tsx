import { Image } from 'react-native';
import { Link } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
        />
      }>
      <ThemedView>
        <ThemedText><Link href={'/camera'}>Camera</Link></ThemedText>
        <ThemedText><Link href={'/carbon'}>Carbon</Link></ThemedText>
        <ThemedText><Link href={'/nfc'}>NFC</Link></ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
