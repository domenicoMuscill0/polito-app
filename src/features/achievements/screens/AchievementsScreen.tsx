import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { OverviewList } from '@lib/ui/components/OverviewList';
import { Section } from '@lib/ui/components/Section';
import { SectionHeader } from '@lib/ui/components/SectionHeader';
import { useTheme } from '@lib/ui/hooks/useTheme';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
// Ensure you have this component
import { AddAchievementsForm } from '../components/AddAchievementsForm';
// Ensure you have this component
import { ShineAnimation } from '../components/ShineAnimation';
import SlidingDrawer from '../components/SlidingDrawer';

export interface Achievement {
  title: string;
  description: string;
  achieved: boolean;
  image?: string;
}

export interface Title {
  name: string;
  achievements: Achievement[];
  community: boolean;
}

const titles: Title[] = [
  {
    name: 'Perfectionist',
    achievements: [
      { title: 'Flawless', description: 'Get 30 cum laude', achieved: false },
      { title: 'Ez', description: 'Get three 30 (or above)', achieved: true },
      {
        title: 'Bad habits are hard to die',
        description: 'Get 30 (or above) in three exam sessions',
        achieved: false,
      },
    ],
    community: false,
  },
  {
    name: 'Analyst',
    achievements: [
      {
        title: "From here it's all downhill",
        description: 'Pass Calculus 1',
        achieved: true,
      },
      { title: '3D', description: 'Pass Calculus 2', achieved: true },
    ],
    community: false,
  },
  {
    name: 'Reporter',
    achievements: [
      {
        title: 'On the other side',
        description: 'Send a CPD feedback',
        achieved: false,
      },
      {
        title: '5 stars',
        description: 'Answer to customer satisfaction questionary',
        achieved: true,
      },
      { title: 'Good boy', description: 'Compile 3 surveys', achieved: true },
    ],
    community: false,
  },
  {
    name: 'Interstellar',
    achievements: [
      {
        title: 'Hang in there!',
        description: 'Pass Structural Mechanics',
        achieved: true,
      },
      { title: 'MK42', description: 'Pass Machine Mechanics', achieved: true },
      { title: 'Mach 1', description: 'Pass Propulsion', achieved: true },
      { title: 'Icarus', description: 'Pass Flight Mechanics', achieved: true },
      {
        title: 'R2 - D2',
        description: 'Pass Aerospace Cabin Systems',
        achieved: true,
      },
    ],
    community: true,
  },
  // Add more titles and achievements as needed
];

export const AchievementsScreen = () => {
  const { t } = useTranslation();
  const { fontSizes, colors } = useTheme();
  const achievementsPreference = usePreferencesContext().achievementsVisibility;
  const [showAll, setShowAll] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleShowMore = () => setShowAll(!showAll);
  const toggleCommunity = () => setShowCommunity(!showCommunity);

  const addAchievement = (achievement: Achievement, selectedTitle: string) => {
    const title = titles.find(ti => ti.name === selectedTitle);
    if (title) {
      // Call the LLM to create the callback from the description
      // Ensure the achievement can be set by the user (i.e. the user would be granted the achievement)
      title.achievements.push(achievement);
      setIsDrawerOpen(false);
      Alert.alert('Success', 'Achievement saved successfully!');
    } else {
      Alert.alert('Error', 'Selected title not found.');
    }
  };

  const sortedTitles = [...titles].sort((t1, t2) => {
    const t1Acquired = t1.achievements.every(a => a.achieved);
    const t2Acquired = t2.achievements.every(a => a.achieved);
    return t1Acquired && !t2Acquired
      ? -1
      : !t1Acquired && t2Acquired
      ? 1
      : t1.name.localeCompare(t2.name);
  });

  const renderTitles = (filterFn: (title: Title) => boolean) =>
    sortedTitles.filter(filterFn).map((title, index) => {
      const titleAcquired = title.achievements.every(a => a.achieved);
      return (
        <View
          key={index}
          style={[
            styles.titleSection,
            titleAcquired && styles.acquiredTitleBanner,
          ]}
        >
          {titleAcquired && <ShineAnimation />}
          <Text
            style={[
              styles.title,
              titleAcquired
                ? styles.acquiredTitleText
                : styles.notAcquiredTitle,
            ]}
          >
            {title.name}
          </Text>
          <View style={styles.separator} />
          {title.achievements
            .filter(a => a.achieved)
            .map((achievement, subindex) => (
              <View key={subindex} style={styles.listItem}>
                <View style={styles.achievementText}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      titleAcquired
                        ? styles.acquiredAchievementText
                        : styles.achieved,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  <Text
                    style={[
                      styles.description,
                      titleAcquired
                        ? styles.acquiredAchievementText
                        : styles.achieved,
                    ]}
                  >
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          {showAll &&
            title.achievements
              .filter(a => !a.achieved)
              .map((achievement, subindex) => (
                <View key={subindex} style={styles.listItem}>
                  <View style={styles.achievementText}>
                    <Text style={[styles.achievementTitle, styles.notAchieved]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.description, styles.notAchieved]}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              ))}
        </View>
      );
    });

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView>
        <View style={styles.container}>
          {achievementsPreference === 'none' ? (
            <Text style={{ color: 'gray', textAlign: 'center', margin: 20 }}>
              You have disabled all achievements. To enable them go to Settings{' '}
              {'>'} Achievements {'>'} All
            </Text>
          ) : (
            <>
              <Section>
                <SectionHeader title={t('achievements.screen.global.title')} />
                {achievementsPreference !== 'community' ? (
                  <>
                    <OverviewList indented>
                      {renderTitles((ti: Title) => !ti.community)}
                    </OverviewList>
                    <Button
                      title={showAll ? 'See Less' : 'See More'}
                      onPress={handleShowMore}
                    />
                  </>
                ) : (
                  <Text
                    style={{ color: 'gray', textAlign: 'center', margin: 20 }}
                  >
                    You have disabled global achievements. To enable them go to
                    Settings {'>'} Achievements {'>'} Global
                  </Text>
                )}
              </Section>
              <Section>
                <TouchableOpacity
                  style={styles.sectionHeaderContainer}
                  onPress={toggleCommunity}
                >
                  <Text
                    style={{
                      fontSize: fontSizes.lg,
                      color: colors.title,
                      fontWeight: 'bold',
                    }}
                  >
                    {t('achievements.screen.community.title')}
                  </Text>
                  <FontAwesomeIcon
                    icon={showCommunity ? faChevronDown : faChevronRight}
                    size={fontSizes['2xl']}
                    color="black"
                  />
                </TouchableOpacity>
                {achievementsPreference !== 'global'
                  ? showCommunity && (
                      <>
                        <OverviewList indented>
                          {renderTitles((ti: Title) => ti.community)}
                        </OverviewList>
                        <Button
                          title="Add Achievement"
                          onPress={() => setIsDrawerOpen(!isDrawerOpen)}
                        />
                        <SlidingDrawer
                          isOpen={isDrawerOpen}
                          onClose={() => setIsDrawerOpen(false)}
                        >
                          <AddAchievementsForm
                            onSave={addAchievement}
                            titles={titles.map(title => title.name)}
                          />
                        </SlidingDrawer>
                      </>
                    )
                  : showCommunity && (
                      <Text
                        style={{
                          color: 'gray',
                          textAlign: 'center',
                          margin: 20,
                        }}
                      >
                        You have disabled community achievements. To enable them
                        go to Settings {'>'} Achievements {'>'} Community
                      </Text>
                    )}
              </Section>
            </>
          )}
          <View style={styles.footer} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  acquiredTitleBanner: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: 'black',
    borderColor: '#FFD700', // Gold border color
    borderWidth: 5,
    boxShadow: '0 4px 8px rgba(255, 215, 0, 0.4)', // Gold shadow effect
  },
  acquiredTitleText: {
    color: 'white',
    paddingStart: 8,
  },
  notAcquiredTitle: {
    color: 'black',
    paddingStart: 8,
  },
  acquiredAchievementText: {
    color: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementText: {
    marginLeft: 8,
  },
  container: {
    paddingVertical: 0,
  },
  achievementTitle: {
    fontSize: 18,
  },
  description: {
    fontSize: 14,
  },
  achieved: {
    color: 'black',
  },
  notAchieved: {
    color: '#d3d3d3',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingStart: 0,
  },
  footer: {
    height: 100,
  },
});
