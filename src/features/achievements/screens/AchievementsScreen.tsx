import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  BackHandler,
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
import { GifAnimation } from '@lib/ui/components/GifAnimation';
import { OverviewList } from '@lib/ui/components/OverviewList';
import { Section } from '@lib/ui/components/Section';
import { SectionHeader } from '@lib/ui/components/SectionHeader';
import { useTheme } from '@lib/ui/hooks/useTheme';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { AddAchievementsForm } from '../components/AddAchievementsForm';
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
  gif_name?: string;
}

export interface Proposal {
  title: string;
  description: string;
  likes: number;
}

const titles: Title[] = [
  {
    name: 'Perfectionist',
    achievements: [
      {
        title: 'Flawless',
        description: 'Get 30 cum laude',
        achieved: false,
      },
      {
        title: 'Ez',
        description: 'Get three 30 (or above)',
        achieved: true,
      },
      {
        title: 'Bad habits are hard to die',
        description: 'Get 30 (or above) in three exam sessions',
        achieved: true,
      },
    ],
    community: false,
    gif_name: 'diamond',
  },
  {
    name: 'Veteran',
    achievements: [
      {
        title: 'I am the danger',
        description: 'Pass Chemistry I',
        achieved: false,
      },
      {
        title: "From here it's all downhill",
        description: 'Pass Calculus 1',
        achieved: true,
      },
    ],
    community: true,
  },
  {
    name: 'Analyst',
    achievements: [
      {
        title: 'Top Notch',
        description: 'Pass Calculus 1 with 25 or above',
        achieved: true,
      },
      {
        title: '3D',
        description: 'Pass Calculus 2 with 25 or above',
        achieved: true,
      },
    ],
    community: false,
  },
  {
    name: 'Reporter',
    achievements: [
      {
        title: 'On the other side',
        description: 'Send a CPD feedback',
        achieved: true,
      },
      {
        title: '5 stars',
        description: 'Answer to customer satisfaction questionary',
        achieved: true,
      },
      {
        title: 'Good boy',
        description: 'Compile 3 surveys',
        achieved: true,
      },
    ],
    community: false,
    gif_name: 'tree',
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
    gif_name: 'universe',
  },
  // Add more titles and achievements as needed
];

// TODO adjust styles names and handle components rendering on click in conformity with the codebase

export const AchievementsScreen = () => {
  const { t } = useTranslation();
  const { fontSizes, colors } = useTheme();
  const achievementsPreference = usePreferencesContext().achievementsVisibility;
  const [showAll, setShowAll] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);

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

  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);

  useEffect(() => {
    const onBackPress = () => {
      if (selectedTitle) {
        setSelectedTitle(null);
        return true; // Prevent default behavior (going back)
      }
      return false; // Allow default behavior
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [selectedTitle]);

  const renderTitles = (filterFn: (title: Title) => boolean) =>
    sortedTitles.filter(filterFn).map((title, index) => {
      const titleAcquired = title.achievements.every(a => a.achieved);

      const handlePress = () => {
        setSelectedTitle(title);
      };

      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.titleSection,
            titleAcquired
              ? styles.acquiredTitleBanner
              : styles.notAcquiredTitleBanner,
          ]}
          onPress={handlePress}
        >
          {titleAcquired && (
            <GifAnimation gifName={title.gif_name || 'fallback'} />
          )}
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
                      styles.achievementTitleCool,
                      titleAcquired
                        ? styles.acquiredAchievementText
                        : styles.achieved,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  <Text
                    style={[
                      styles.descriptionCool,
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
                    <Text
                      style={[styles.achievementTitleCool, styles.notAchieved]}
                    >
                      {achievement.title}
                    </Text>
                    <Text style={[styles.descriptionCool, styles.notAchieved]}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              ))}
        </TouchableOpacity>
      );
    });

  if (selectedTitle) {
    return (
      <View style={styles.container}>
        <Text style={styles.detailTitle}>{selectedTitle.name}</Text>
        {selectedTitle.achievements.map((achievement, index) => (
          <View
            key={index}
            style={[
              styles.achievement,
              achievement.achieved ? styles.completed : styles.uncompleted,
            ]}
          >
            <Text
              style={
                achievement.achieved
                  ? styles.achievementTitleCool
                  : styles.achievementTitlePlain
              }
            >
              {achievement.title}
            </Text>
            <Text
              style={
                achievement.achieved
                  ? styles.descriptionCool
                  : styles.descriptionPlain
              }
            >
              {achievement.description}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => setSelectedTitle(null)}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
                            onSave={achievement => {
                              const newProposal = {
                                title: achievement.title,
                                description: achievement.description,
                                likes: 0,
                              };
                              setProposals(prev => [...prev, newProposal]);
                              setIsDrawerOpen(false);
                              Alert.alert(
                                'Submitted!',
                                'Your proposal is up for voting!',
                              );
                            }}
                            titles={titles.map(title => title.name)} // isProposal={true} // Add this prop if your form needs to adjust its UI
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
              <Section>
                <SectionHeader title="Community Proposals" />
                <OverviewList indented>
                  {proposals.map((proposal, index) => (
                    <View key={index} style={styles.proposalItem}>
                      <Text style={styles.proposalTitle}>{proposal.title}</Text>
                      <Text style={styles.proposalDesc}>
                        {proposal.description}
                      </Text>
                      <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => {
                          setProposals(prev =>
                            prev.map((p, i) =>
                              i === index ? { ...p, likes: p.likes + 1 } : p,
                            ),
                          );
                        }}
                      >
                        <Text>❤️ {proposal.likes}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </OverviewList>
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
    borderColor: '#FFD700', // Gold border color
    borderWidth: 3,
    boxShadow: '0 4px 8px rgba(255, 215, 0, 0.4)', // Gold shadow effect
  },
  notAcquiredTitleBanner: {
    padding: 0,
    backgroundColor: '#9C9B9B',
    borderColor: '#524D47', // Dark grey border color for unacquired titles
    borderWidth: 3,
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
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  achieved: {
    color: 'black',
  },
  notAchieved: {
    color: '#d3d3d3',
  },
  achievement: {
    padding: 15,
    marginVertical: 1,
  },
  completed: {
    borderWidth: 2,
    borderRadius: 0,
    borderColor: '#FFD700',
    backgroundColor: '#3C3B40',
  },
  uncompleted: {
    borderWidth: 1,
    borderRadius: 0,
    borderColor: 'black',
    backgroundColor: '#57575A',
  },
  achievementTitleCool: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C8C28A',
  },
  descriptionCool: {
    fontSize: 14,
    color: '#7A7561',
  },
  achievementTitlePlain: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  descriptionPlain: {
    fontSize: 14,
    color: '#7A7977',
  },
  backButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
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
  proposalItem: {
    padding: 16,
    marginVertical: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  proposalDesc: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
});
