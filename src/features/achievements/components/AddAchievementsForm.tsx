import React, { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface Achievement {
  title: string;
  description: string;
  achieved: boolean;
  image?: string;
}

interface AchievementFormProps {
  onSave: (achievement: Achievement, titleName: string) => void;
  titles: string[];
}

export const AddAchievementsForm: React.FC<AchievementFormProps> = ({
  onSave,
  titles,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(titles[0]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Title is required.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Description is required.');
      return;
    }

    const newAchievement: Achievement = {
      title,
      description,
      achieved: false,
      image,
    };
    onSave(newAchievement, selectedTitle);
    // Reset the form
    setTitle('');
    setDescription('');
    setImage('');
    setSelectedTitle(titles[0]);
    Alert.alert('Success', 'Achievement saved successfully!');
  };

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSelectTitle = (t: string) => {
    setSelectedTitle(t);
    setIsDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleDropdownToggle} style={styles.dropdown}>
        <Text>{selectedTitle}</Text>
      </TouchableOpacity>
      {isDropdownVisible && (
        <ScrollView style={styles.dropdownMenu}>
          {titles.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectTitle(item)}
              style={styles.dropdownItem}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Save Achievement" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  dropdownMenu: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  dropdownItem: {
    padding: 12,
  },
});
