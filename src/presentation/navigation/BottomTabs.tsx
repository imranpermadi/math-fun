import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, fontSize, radius } from '../theme';
import { MateriScreen } from '../screens/materi/MateriScreen';
import { BankSoalScreen } from '../screens/bank-soal/BankSoalScreen';
import { GamesScreen } from '../screens/games/GamesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

export type RootTabParamList = {
  Materi: undefined;
  BankSoal: undefined;
  Games: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TABS = [
  { name: 'Materi', label: 'Materi', emoji: '📖', color: colors.sky, component: MateriScreen },
  { name: 'BankSoal', label: 'Bank Soal', emoji: '📝', color: colors.secondary, component: BankSoalScreen },
  { name: 'Games', label: 'Games', emoji: '🎮', color: colors.pink, component: GamesScreen },
  { name: 'Profile', label: 'Profil', emoji: '👤', color: colors.purple, component: ProfileScreen },
] as const;

function TabIcon({ emoji, color, focused }: { emoji: string; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && { backgroundColor: color, transform: [{ translateY: -6 }] }]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '800', fontSize: fontSize.title - 4 },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: fontSize.tab, fontWeight: '700' },
        tabBarStyle: styles.bar,
      }}
    >
      {TABS.map((t) => (
        <Tab.Screen
          key={t.name}
          name={t.name}
          component={t.component}
          options={{
            title: t.label === 'Materi' ? 'Math Fun ✨' : t.label,
            tabBarLabel: t.label,
            tabBarIcon: ({ focused }) => <TabIcon emoji={t.emoji} color={t.color} focused={focused} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 76,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    position: 'absolute',
    elevation: 12,
  },
  iconWrap: { width: 48, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 26 },
});
