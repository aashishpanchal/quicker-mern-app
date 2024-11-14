import '@/unistyle';
import React from 'react';
import {StatusBar} from 'react-native';
import {Navigation} from './navigation';
import {AppProviders} from './components/providers';

export default function App() {
  return (
    <AppProviders>
      <Navigation />
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
    </AppProviders>
  );
}
