import {useEffect, useState} from 'react';
import {AppState} from 'react-native';

import type {AppStateStatus} from 'react-native';

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === 'active');
    };

    const listener = AppState.addEventListener('change', onChange);
    return () => listener.remove();
  }, [setIsForeground]);

  return isForeground;
};