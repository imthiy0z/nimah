import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';

type ChatScreenProps = {
  onBack?: () => void;
};

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatScreen({ onBack }: ChatScreenProps) {
  const { t, locale, rtlMirror } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        text: t('chat.welcome'),
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, [locale, t]);

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputText('');

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: t('chat.autoReply'),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  }, [inputText, t]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <BlurView intensity={22} tint="light" style={styles.backButtonBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <Ionicons name="arrow-back" size={20} color="#2A3F4E" style={rtlMirror} />
            </BlurView>
          </Pressable>

          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>{t('chat.headerTitle')}</Text>
            <Text style={styles.headerSubtitle}>{t('chat.headerSub')}</Text>
          </View>

          <Pressable
            style={styles.callButton}
            accessibilityRole="button"
            accessibilityLabel={t('chat.call')}
          >
            <BlurView intensity={22} tint="light" style={styles.callButtonBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <Ionicons name="call-outline" size={20} color="#2A3F4E" />
            </BlurView>
          </Pressable>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
              ]}
            >
              <BlurView
                intensity={20}
                tint="light"
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <LinearGradient
                  colors={
                    message.isUser
                      ? ['rgba(249, 115, 22, 0.2)', 'rgba(249, 115, 22, 0.1)']
                      : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
                <View style={styles.greyTint} />
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </BlurView>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <BlurView intensity={20} tint="light" style={styles.inputBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.greyTint} />
            <View style={styles.inputContent}>
              <TextInput
                style={styles.textInput}
                placeholder={t('chat.placeholder')}
                placeholderTextColor="rgba(42, 63, 78, 0.5)"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <Pressable
                style={styles.sendButton}
                onPress={handleSend}
                accessibilityRole="button"
                accessibilityLabel={t('chat.sendA11y')}
              >
                <Ionicons name="send" size={20} color={Theme.colors.primary} />
              </Pressable>
            </View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: Theme.spacing.md,
  },
  backButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#293F4D',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  callButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  messageWrapper: {
    marginBottom: Theme.spacing.md,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  aiBubble: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  greyTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    pointerEvents: 'none',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#2A3F4E',
  },
  aiMessageText: {
    color: '#2A3F4E',
  },
  inputContainer: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
    backgroundColor: Theme.colors.white,
  },
  inputBlur: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#2A3F4E',
    maxHeight: 100,
    paddingVertical: Theme.spacing.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

