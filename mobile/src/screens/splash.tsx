import React from 'react';
import {Text} from 'react-native';
import {Logo} from '@/components/logo';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {View} from 'lucide-react-native';

export default function Splash() {
  const {styles} = useStyles(stylesheet);

  return (
    <SafeAreaView style={styles.container}>
      <Logo size={100} />
      <Text style={styles.title}>Welcome to Quicker!</Text>
      {/* bottom copy right */}
      <View style={styles.bottomContainer}>
        <Text style={styles.copyText}>Made by: Aashish Panchal</Text>
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontSize: 15,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: theme.spaces.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyText: {
    fontFamily: theme.fonts.regular,
    fontSize: 10,
    color: theme.colors.text,
  },
}));
