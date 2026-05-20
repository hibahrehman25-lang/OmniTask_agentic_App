import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// SwiftUI style animated button wrapper
const AnimatedUploadButton = ({ onPress, icon, label, isRTL, color }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={{ flex: 1 }}
    >
      <Animated.View style={[
        styles.uploadButtonAnimated,
        isRTL && styles.rtlButton,
        { transform: [{ scale }] }
      ]}>
        <View style={[styles.iconWrapper, { backgroundColor: color + '15' }]}>
          {icon}
        </View>
        <Text style={[styles.uploadBtnLabel, { color }]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../config/theme';
import { useLanguage } from '../i18n/LanguageContext';
import OmniTaskLogo from '../components/OmniTaskLogo';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import ParticleBackground from '../components/ParticleBackground';

// High-Fidelity English sample texts to inject
const SAMPLE_TEXTS = {
  en: [
    "Monthly sales report Q4: Lahore region orders dropped 30% compared to Q3. Customer complaints increased by 45%. Three competitor stores opened in the same locality. Revenue impact: Rs 2.5 million at risk. Customer satisfaction score dropped from 4.2 to 2.8 out of 5.",
    "Breaking: Government announces 15% fuel price increase effective immediately. Transport companies report rising operational costs. Delivery operations across Punjab region affected. Last-mile delivery costs expected to rise by 18-22%.",
    "New import tariff of 25% announced on electronics. Smartphones and laptops affected from next month. Retailers report pre-announcement panic buying surge of 340%.",
    "Q3 market analysis: E-commerce sector grew 67% YoY. Mobile payments up 120%. Top 3 competitors launched loyalty programs. Customer acquisition cost increased 34% industry-wide."
  ],
  ur: [
    "ماہانہ سیلز رپورٹ Q4: لاہور ریجن کے آرڈرز میں Q3 کے مقابلے میں 30 فیصد کمی آئی۔ کسٹمرز کی شکایات میں 45 فیصد اضافہ ہوا۔ اسی علاقے میں تین حریف اسٹورز کھل گئے۔ ریونیو پر اثر: 2.5 ملین روپے خطرے میں ہیں۔ کسٹمر کی اطمینان کا سکور 5 میں سے 4.2 سے کم ہو کر 2.8 رہ گیا۔",
    "بریکنگ: حکومت نے فوری طور پر ایندھن کی قیمتوں میں 15 فیصد اضافے کا اعلان کر دیا۔ ٹرانسپورٹ کمپنیوں نے آپریشنل اخراجات بڑھنے کی اطلاع دی۔ پنجاب ریجن میں ڈیلیوری آپریشنز متاثر ہوئے۔ آخری میل کی ترسیل کے اخراجات میں 18-22 فیصد اضافے کا امکان ہے۔",
    "الیکٹرانکس پر 25 فیصد نئے امپورٹ ٹیرف کا اعلان کر دیا گیا۔ اسمارٹ فونز اور لیپ ٹاپس اگلے ماہ سے متاثر ہوں گے۔ ریٹیلرز نے اعلان سے قبل گھبراہٹ میں خریداری میں 340 فیصد اضافے کی اطلاع دی ہے۔",
    "Q3 مارکیٹ تجزیہ: ای کامرس کے شعبے میں سال بہ سال 67 فیصد اضافہ ہوا۔ موبائل ادائیگیوں میں 120 فیصد اضافہ ہوا۔ سرفہرست 3 حریفوں نے وفاداری پروگرام شروع کیے۔ کسٹمر کے حصول کی لاگت میں صنعت بھر میں 34 فیصد اضافہ ہوا۔"
  ]
};

export default function InputScreen({ onNavigateToProcessing }) {
  const { t, isRTL, rtlText, rtlRow, currentLang } = useLanguage();
  const [text, setText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null); // { name, base64, type }

  const handlePickDocument = async (mimeType, fileType) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: mimeType,
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        let base64;

        if (Platform.OS === 'web') {
          // Fallback to fetch and FileReader on Web because FileSystem.readAsStringAsync crashes
          const response = await fetch(file.uri);
          const blob = await response.blob();
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result;
              resolve(dataUrl.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else {
          base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        setAttachedFile({
          name: file.name,
          base64: base64,
          type: fileType,
        });
      }
    } catch (err) {
      console.warn('Document picking failed', err);
      Alert.alert('File Picker Error', err.message || 'Failed to attach the document. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissions', 'Photo library access is required to attach images.');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const img = res.assets[0];
        let base64;

        if (Platform.OS === 'web') {
          const response = await fetch(img.uri);
          const blob = await response.blob();
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else {
          base64 = await FileSystem.readAsStringAsync(img.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        const name = img.uri.substring(img.uri.lastIndexOf('/') + 1) || 'image.jpg';

        setAttachedFile({
          name: name,
          base64: base64,
          type: 'image',
        });
      }
    } catch (err) {
      console.warn('Image picker failed', err);
      Alert.alert('Image Picker Error', err.message || 'Failed to attach the photo. Please try again.');
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  const handleSampleTap = (index) => {
    const samplesArr = SAMPLE_TEXTS[currentLang] || SAMPLE_TEXTS['en'];
    setText(samplesArr[index]);
  };

  const handleAnalyzePress = () => {
    if (!text.trim() && !attachedFile) {
      Alert.alert('Input Required', 'Please enter some text content or attach a document first.');
      return;
    }
    // Proceed to Processing view carrying input context
    onNavigateToProcessing({
      text: text,
      file: attachedFile ? attachedFile.base64 : null,
      fileType: attachedFile ? attachedFile.type : null,
    });
  };

  const hasContent = text.trim().length > 0 || attachedFile !== null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.heroGradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ParticleBackground />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Hero Text headers matching specification */}
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>{t('tagline')}</Text>
              <Text style={styles.urSubline}>{t('urTagline')}</Text>
            </View>

            {/* Glass TextInput Card */}
            <GlassCard style={styles.inputCard}>
              <TextInput
                style={[styles.textInput, rtlText, isRTL && styles.rtlInputFont]}
                multiline
                placeholder={t('inputPlaceholder')}
                placeholderTextColor={COLORS.textMuted}
                value={text}
                onChangeText={setText}
                underlineColorAndroid="transparent"
              />
              <Text style={styles.charCounter}>{text.length} ch</Text>
            </GlassCard>

            {/* Selected File Chip Indicator */}
            {attachedFile && (
              <View style={[styles.fileChip, rtlRow]}>
                <Ionicons
                  name={
                    attachedFile.type === 'image'
                      ? 'image-outline'
                      : 'document-text-outline'
                  }
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.fileName} numberOfLines={1}>
                  {attachedFile.name}
                </Text>
                <TouchableOpacity onPress={handleRemoveFile}>
                  <Ionicons name="close-circle" size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            )}

            {/* 2x2 File Upload Grid */}
            <View style={styles.uploadGrid}>
              <View style={[styles.gridRow, rtlRow]}>
                <AnimatedUploadButton
                  isRTL={isRTL}
                  color={COLORS.primaryDark}
                  label={t('uploadPdf')}
                  icon={<Ionicons name="document-outline" size={24} color={COLORS.primaryDark} />}
                  onPress={() => handlePickDocument('application/pdf', 'pdf')}
                />
                <AnimatedUploadButton
                  isRTL={isRTL}
                  color={COLORS.secondary}
                  label={t('uploadDocx')}
                  icon={<Ionicons name="document-text-outline" size={24} color={COLORS.secondary} />}
                  onPress={() =>
                    handlePickDocument(
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'docx'
                    )
                  }
                />
              </View>
              <View style={[styles.gridRow, rtlRow]}>
                <AnimatedUploadButton
                  isRTL={isRTL}
                  color={COLORS.success}
                  label={t('uploadCsv')}
                  icon={<Ionicons name="grid-outline" size={24} color={COLORS.success} />}
                  onPress={() =>
                    handlePickDocument(
                      'text/comma-separated-values,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'csv'
                    )
                  }
                />
                <AnimatedUploadButton
                  isRTL={isRTL}
                  color={COLORS.warning}
                  label={t('uploadImage')}
                  icon={<Ionicons name="image-outline" size={24} color={COLORS.warning} />}
                  onPress={handlePickImage}
                />
              </View>
            </View>

            {/* Try dynamic sample chips */}
            <View style={styles.samplesContainer}>
              <Text style={[styles.samplesHeader, rtlText]}>{t('trySample')}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.samplesScroll, isRTL && styles.rtlRow]}
              >
                {t('samples').map((sampleLabel, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.sampleChip}
                    onPress={() => handleSampleTap(index)}
                  >
                    <Text style={styles.sampleText}>{sampleLabel}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Analyze CTA Trigger */}
            <View style={styles.ctaWrapper}>
              <GradientButton
                title={t('analyzeBtn')}
                onPress={handleAnalyzePress}
                disabled={!hasContent}
                shouldPulse={hasContent}
              />
            </View>

            {/* Hero metrics stat footer banner */}
            <View style={[styles.footerBanner, rtlRow]}>
              <View style={styles.footerItem}>
                <Text style={styles.footerVal}>{t('statsAnalyzed').split(' ')[0]}</Text>
                <Text style={styles.footerLabel}>{t('statsAnalyzed').split(' ')[1]}</Text>
              </View>
              <View style={styles.footerLine} />
              <View style={styles.footerItem}>
                <Text style={styles.footerVal}>{t('statsAgents').split(' ')[0]}</Text>
                <Text style={styles.footerLabel}>{t('statsAgents').split(' ')[1]}</Text>
              </View>
              <View style={styles.footerLine} />
              <View style={styles.footerItem}>
                <View style={styles.liveWrapper}>
                  <View style={styles.pulsingGreen} />
                  <Text style={styles.footerVal}>{t('statsLive')}</Text>
                </View>
                <Text style={styles.footerLabel}>Sync</Text>
              </View>
            </View>

            {/* Space to prevent navigation overlap */}
            <View style={{ height: 120 }} />

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.textPrimary,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  urSubline: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
    fontFamily: 'NotoNastaliqUrdu',
    textAlign: 'center',
    marginTop: 4,
  },
  inputCard: {
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  textInput: {
    minHeight: 140,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Inter',
    textAlignVertical: 'top',
    padding: SPACING.xs,
  },
  rtlInputFont: {
    fontFamily: 'NotoNastaliqUrdu',
    fontSize: 12,
  },
  charCounter: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: 4,
    marginRight: 4,
    fontFamily: 'Inter',
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(165, 91, 75, 0.2)', // Terracotta translucent
    borderWidth: 0.5,
    borderColor: 'rgba(220, 160, 109, 0.3)', // Peach border
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  fileName: {
    fontSize: 11,
    color: COLORS.primaryDark,
    maxWidth: 200,
    fontFamily: 'Inter',
  },
  uploadGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  gridRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  uploadButtonAnimated: {
    flex: 1,
    height: 80,
    backgroundColor: 'rgba(33, 15, 55, 0.5)', // Dark purple translucent
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(165, 91, 75, 0.4)', // Terracotta translucent
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#a55b4b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rtlButton: {
    flexDirection: 'row-reverse',
  },
  uploadBtnLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: COLORS.textSecondary,
  },
  samplesContainer: {
    marginBottom: SPACING.xl,
  },
  samplesHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontFamily: 'Inter',
  },
  samplesScroll: {
    gap: SPACING.sm,
    paddingRight: SPACING.md,
  },
  sampleChip: {
    backgroundColor: 'rgba(79, 28, 81, 0.5)', // Plum transparent
    borderWidth: 0.5,
    borderColor: 'rgba(220, 160, 109, 0.2)', // Peach translucent
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#dca06d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  sampleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  ctaWrapper: {
    marginBottom: SPACING.xl,
  },
  footerBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 0.5,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
  },
  footerVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    fontFamily: 'Inter',
  },
  footerLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  footerLine: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  liveWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pulsingGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
});
