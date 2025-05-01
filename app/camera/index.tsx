import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CameraHomeScreen() {
  return (
    <ThemedView>
      <Link href='/camera/codeScanner'>
        <ThemedText>Code Scanner</ThemedText>
      </Link>
    </ThemedView>
  );
}
