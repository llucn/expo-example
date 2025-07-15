import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Location from 'expo-location';
import { LocationObject, LocationAccuracy } from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LocationHomeScreen() {
  const [ location, setLocation ] = useState<LocationObject | undefined>();
  const [ errorMsg, setErrorMsg ] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      } else {
        let isLocationServicesEnabled = await Location.hasServicesEnabledAsync();
        let locationProviderStatus = await Location.getProviderStatusAsync();
        console.log(`loc enable: ${JSON.stringify(isLocationServicesEnabled)}, loc status: ${JSON.stringify(locationProviderStatus)}`);

        if (isLocationServicesEnabled) {
          // Get loc
          let loc = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
          if (loc.coords !== null) {
            console.log(`loc: ${JSON.stringify(loc)}`);
            setLocation(loc);
            // deviceSvc.setLocation(loc.coords.latitude, loc.coords.longitude);
          }

          // Watch loc
          await Location.watchPositionAsync({
            accuracy: LocationAccuracy.High,
            distanceInterval: 1,
            timeInterval: 30000}, (newLoc) => {
              console.log(`new loc: ${JSON.stringify(newLoc)}`);
              setLocation(newLoc);
              // deviceSvc.setLocation(newLoc.coords.latitude, newLoc.coords.longitude);
          });
        }
      }
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <ThemedView>
      <ThemedText>Lat: {location?.coords?.latitude}</ThemedText>
      <ThemedText>Lon: {location?.coords?.longitude}</ThemedText>
      <ThemedText>{text}</ThemedText>
    </ThemedView>
  );
}