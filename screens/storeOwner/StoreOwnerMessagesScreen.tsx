import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import StoreOwnerTabBar from '../../components/StoreOwnerTabBar';
import StoreOwnerHeader from '../../components/StoreOwnerHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { getStoreOwnerMessageThreads } from '../../constants/mockData';

const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;

type Props = {
  storeId: string;
  activeTab: string;
  onTabPress: (tabId: string) => void;
  onNotificationsPress?: () => void;
  onSupportChatPress?: () => void;
  messageUnreadCount?: number;
};

export default function StoreOwnerMessagesScreen({
  storeId,
  activeTab,
  onTabPress,
  onNotificationsPress,
  onSupportChatPress,
  messageUnreadCount = 0,
}: Props) {
  const { t } = useLanguage();
  const threads = useMemo(() => getStoreOwnerMessageThreads(storeId), [storeId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <StoreOwnerHeader
          title={t('storeOwner.messagesTitle')}
          subtitle={t('storeOwner.messagesSub')}
          onNotificationsPress={onNotificationsPress}
          onTabPress={onTabPress}
          onSupportChatPress={onSupportChatPress}
          activeTab={activeTab}
        />

        <Text style={[styles.sectionLabel, { paddingHorizontal: SCREEN_HPAD }]}>
          {t('storeOwner.messagesActionTitle')}
        </Text>
        <Pressable
          style={[styles.compose, { marginHorizontal: SCREEN_HPAD }]}
          onPress={onSupportChatPress}
        >
          <Ionicons name="add-circle" size={22} color={Theme.colors.white} />
          <View style={styles.composeText}>
            <Text style={styles.composeTitle}>{t('storeOwner.newMessage')}</Text>
            <Text style={styles.composeSub}>{t('storeOwner.newMessageSub')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.9)" />
        </Pressable>

        <Pressable
          style={[styles.supportCard, { marginHorizontal: SCREEN_HPAD }]}
          onPress={onSupportChatPress}
        >
          <View style={styles.supportIcon}>
            <Ionicons name="headset-outline" size={22} color={Theme.colors.primary} />
          </View>
          <View style={styles.supportText}>
            <Text style={styles.supportTitle}>{t('storeOwner.supportChatTitle')}</Text>
            <Text style={styles.supportSub}>{t('storeOwner.supportChatSub')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Theme.colors.text.muted} />
        </Pressable>

        <Text style={[styles.section, { paddingHorizontal: SCREEN_HPAD }]}>{t('storeOwner.inbox')}</Text>

        {threads.map((th) => (
          <Pressable
            key={th.id}
            style={[styles.thread, { marginHorizontal: SCREEN_HPAD }]}
            onPress={onSupportChatPress}
          >
            <View style={styles.threadAvatar}>
              <Ionicons name="person-outline" size={20} color={Theme.colors.text.muted} />
            </View>
            <View style={styles.threadMid}>
              <View style={styles.threadTop}>
                <Text style={styles.threadName} numberOfLines={1}>
                  {th.customerLabel}
                </Text>
                <Text style={styles.threadTime}>{th.timeLabel}</Text>
              </View>
              <Text style={styles.threadPreview} numberOfLines={2}>
                {th.preview}
              </Text>
            </View>
            {th.unread ? <View style={styles.dot} /> : null}
          </Pressable>
        ))}
      </ScrollView>
      <StoreOwnerTabBar
        activeTab={activeTab}
        onTabPress={onTabPress}
        messageUnreadCount={messageUnreadCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { flex: 1 },
  scrollInner: { paddingBottom: 120, gap: 8 },
  sectionLabel: { fontSize: 13, fontWeight: '900', color: Theme.colors.text.muted, marginBottom: 6 },
  compose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary,
    marginBottom: 8,
  },
  composeText: { flex: 1, minWidth: 0 },
  composeTitle: { fontSize: 16, fontWeight: '900', color: Theme.colors.white },
  composeSub: { marginTop: 2, fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
    marginBottom: 8,
  },
  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: { flex: 1, minWidth: 0 },
  supportTitle: { fontSize: 15, fontWeight: '800', color: Theme.colors.text.primary },
  supportSub: { marginTop: 2, fontSize: 12, color: Theme.colors.text.muted, fontWeight: '600' },
  section: { marginTop: 12, marginBottom: 4, fontSize: 13, fontWeight: '800', color: Theme.colors.text.muted },
  thread: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.06)',
  },
  threadAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(42,63,78,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadMid: { flex: 1, minWidth: 0 },
  threadTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  threadName: { flex: 1, fontSize: 15, fontWeight: '800', color: Theme.colors.text.primary },
  threadTime: { fontSize: 12, fontWeight: '700', color: Theme.colors.text.muted },
  threadPreview: { marginTop: 4, fontSize: 13, color: Theme.colors.text.muted, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.primary },
});
