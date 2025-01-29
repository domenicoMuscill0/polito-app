import React from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';

interface Gifs {
  [key: string]: Source; // 'any' can be replaced with the specific type if known
}

const gifs: Gifs = {
  fallback: require('../../../assets/gifs/background_fallback.gif'),
  universe: require('../../../assets/gifs/background_universe.gif'),
  tree: require('../../../assets/gifs/background_tree.gif'),
  diamond: require('../../../assets/gifs/background_diamond.gif'),
};

interface GifAnimationProps {
  gifName: string;
}

export const GifAnimation: React.FC<GifAnimationProps> = ({ gifName }) => {
  return (
    <View style={styles.container}>
      <FastImage
        style={styles.gif}
        source={gifs[gifName]}
        resizeMode={FastImage.resizeMode.stretch}
        onError={() => console.error('Failed to load GIF')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Add background color for debugging
  },
  gif: {
    width: '100%',
    height: '100%',
    borderWidth: 1, // Add border for debugging
    borderColor: 'red',
  },
});
