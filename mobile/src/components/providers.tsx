import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

/** Global Provider */
export const AppProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => <SafeAreaProvider>{children}</SafeAreaProvider>;
