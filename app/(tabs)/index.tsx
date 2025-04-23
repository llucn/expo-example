import { Image, Pressable, Button } from 'react-native';
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
        <ThemedText><Link href={'/camera'}>camera</Link></ThemedText>
        <ThemedText><Link href={'/nfc'}>nfc</Link></ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
