import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

type DepartmentCardsProps = {
  onDepartmentPress?: (departmentId: string) => void;
};

export default function DepartmentCards({ onDepartmentPress }: DepartmentCardsProps) {
  const { rtlMirror } = useLanguage();
  // Major departments - user will add images for each
  const departments = [
    {
      id: 'cardiology',
      name: 'Cardiology',
      description: 'Heart & Vascular Care',
      image: require('../assets/departments/cardiology.png'),
    },
    {
      id: 'neurology',
      name: 'Neurology',
      description: 'Brain & Nervous System',
      image: require('../assets/departments/neurology.png'),
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics',
      description: 'Bone & Joint Care',
      image: require('../assets/departments/Orthopedics.png'),  
    },
    {
      id: 'gynecology',
      name: 'Gynecology',
      description: 'Women\'s Health',
      // Image will be added by user: require('../assets/departments/gynecology.png')
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      description: 'Child Healthcare',
      // Image will be added by user: require('../assets/departments/pediatrics.png')
    },
    {
      id: 'oncology',
      name: 'Oncology',
      description: 'Cancer Care',
      // Image will be added by user: require('../assets/departments/oncology.png')
    },
    {
      id: 'urology',
      name: 'Urology',
      description: 'Urinary System',
      // Image will be added by user: require('../assets/departments/urology.png')
    },
    {
      id: 'emergency',
      name: 'Emergency',
      description: '24/7 Emergency Care',
      // Image will be added by user: require('../assets/departments/emergency.png')
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Departments</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {departments.map((dept) => (
          <Pressable
            key={dept.id}
            onPress={() => onDepartmentPress?.(dept.id)}
            style={({ pressed }) => [
              styles.cardWrapper,
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${dept.name} - ${dept.description}`}
          >
            <BlurView intensity={20} tint="light" style={styles.cardBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              
              {/* Department Image */}
              <View style={styles.imageContainer}>
                {dept.image ? (
                  <Image
                    source={dept.image}
                    style={styles.departmentImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="medical" size={40} color={Theme.colors.primary} />
                  </View>
                )}
              </View>
              
              <View style={styles.greyTint} />
              
              {/* Bottom Section Tint */}
              <View style={styles.bottomTint} />
              
              {/* Department Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.departmentName} numberOfLines={1}>
                  {dept.name}
                </Text>
                <Text style={styles.description} numberOfLines={1}>
                  {dept.description}
                </Text>
              </View>
              
              {/* Arrow Icon */}
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color={Theme.colors.primary} style={rtlMirror} />
              </View>
            </BlurView>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A3F4E',
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  scrollView: {
    paddingLeft: Theme.spacing.lg,
  },
  scrollContent: {
    paddingRight: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  cardWrapper: {
    width: 160,
    marginRight: Theme.spacing.sm,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardBlur: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  departmentImage: {
    width: '100%',
    height: '100%',
  },
  greyTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    pointerEvents: 'none',
  },
  bottomTint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%', // Bottom section
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Theme.spacing.md,
    zIndex: 2,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A3F4E',
    marginBottom: Theme.spacing.xs / 2,
  },
  description: {
    fontSize: 10,
    fontWeight: '400',
    color: '#2A3F4E',
    opacity: 0.8,
    lineHeight: 14,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: Theme.spacing.md,
    right: Theme.spacing.md,
    zIndex: 3,
  },
});
