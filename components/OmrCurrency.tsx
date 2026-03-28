import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { OMR_CODE, OMR_ICON_ASPECT } from '../constants/currency';
import { useLanguage } from '../contexts/LanguageContext';

const OMR_ICON = require('../assets/omr-symbol.png');

export type OmrCurrencyProps = {
  amount: number;
  variant?: 'full' | 'short';
  iconSize?: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  /** Tints the mark (e.g. white on dark UI, brand color on colored text). */
  iconTintColor?: string;
};

export default function OmrCurrency({
  amount,
  variant = 'full',
  iconSize = 16,
  textStyle,
  containerStyle,
  iconTintColor,
}: OmrCurrencyProps) {
  const { isRtl } = useLanguage();
  const iconW = iconSize * OMR_ICON_ASPECT;
  const suffix = variant === 'full' ? ` ${OMR_CODE}` : '';
  const label = `${OMR_CODE} ${amount.toFixed(2)}`;

  return (
    <View
      style={[
        styles.row,
        isRtl ? styles.rowRtl : styles.rowLtr,
        containerStyle,
      ]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Image
        source={OMR_ICON}
        style={[
          styles.icon,
          { width: iconW, height: iconSize },
          iconTintColor != null ? { tintColor: iconTintColor } : null,
        ]}
        contentFit="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={[styles.amount, styles.amountBidi, textStyle]}>
        {` ${amount.toFixed(2)}${suffix}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Lock flex direction so Arabic (app RTL) places the mark on the correct side */
  row: {
    alignItems: 'center',
  },
  rowLtr: {
    direction: 'ltr',
    flexDirection: 'row',
  },
  rowRtl: {
    direction: 'ltr',
    flexDirection: 'row-reverse',
  },
  icon: {},
  amount: {},
  amountBidi: {
    writingDirection: 'ltr',
  },
});
