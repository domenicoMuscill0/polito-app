import { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

interface Star {
  id: number;
  x: number;
  y: number;
  z: number;
}

export const ShineAnimation = ({
  speedFactor = 0.05,
  starColor = [255, 255, 255],
  starCount = 5000,
}) => {
  const { width, height } = Dimensions.get('window');
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const createStars = (count: number) => {
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          id: i,
          x: getRandomInt(1600) - 800,
          y: getRandomInt(900) - 450,
          z: getRandomInt(1000),
        });
      }
      return stars;
    };

    starsRef.current = createStars(starCount);

    const moveStars = (distance: number) => {
      starsRef.current.forEach((star: Star) => {
        star.z -= distance;
        if (star.z <= 1) star.z += 1000;
      });
    };

    let prevTime = Date.now();

    const tick = () => {
      const now = Date.now();
      const elapsed = now - prevTime;
      prevTime = now;

      moveStars(elapsed * speedFactor);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [speedFactor, starCount]);

  const renderStars = () => {
    const cx = width / 2;
    const cy = height / 2;
    const starElements = starsRef.current.map((star: Star) => {
      const x = cx + star.x / (star.z * 0.001);
      const y = cy + star.y / (star.z * 0.001);
      const d = star.z / 1000.0;
      const b = 1 - d * d;
      if (x < 0 || x >= width || y < 0 || y >= height) return null;
      return (
        <Circle
          key={star.id}
          cx={x}
          cy={y}
          r="1"
          fill={`rgba(${starColor[0]},${starColor[1]},${starColor[2]},${b})`}
        />
      );
    });
    return starElements;
  };

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%">
        <Rect x="0" y="0" width="100%" height="100%" fillOpacity={0} />
        {renderStars()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
