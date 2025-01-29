import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Button, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

interface SlidingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SlidingDrawer: React.FC<SlidingDrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  return (
    <Animated.View
      style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
    >
      {children}
      <Button title="Close" onPress={onClose} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.8,
    height: '100%',
    backgroundColor: 'white',
    padding: 16,
    elevation: 5,
  },
});

export default SlidingDrawer;
