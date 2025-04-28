import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CarbonHomeScreen() {
  return (
    <ThemedView>
      <Link href='/carbon/simple'>
        <ThemedText>Simple</ThemedText>
      </Link>
    </ThemedView>
  );
}