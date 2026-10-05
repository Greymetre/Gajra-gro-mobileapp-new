import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { MechanicCategoryGuide } from '../../../interfaces/auth.interface';
import ShineOverlay from '../ShineOverlay';

// Categories best first, with the colours used in the CRM / SFA
const CATEGORIES = ['Platinum', 'Diamond', 'Gold', 'Silver', 'Bronze'];
const COLOURS: { [category: string]: string } = {
  Platinum: '#475569',
  Diamond: '#2563eb',
  Gold: '#ca8a04',
  Silver: '#8b95a5',
  Bronze: '#c2410c',
};
const ICONS: { [category: string]: string } = {
  Platinum: 'trophy',
  Diamond: 'diamond',
  Gold: 'medal',
  Silver: 'ribbon',
  Bronze: 'star',
};
// Filled badge on the home screen: gradient, icon colour (Platinum gets gold like on the SFA dashboard)
const BADGES: { [category: string]: { colours: string[]; icon: string } } = {
  Platinum: { colours: ['#0d0d0f', '#2b2b30', '#4a4a52'], icon: '#f5c518' },
  Diamond: { colours: ['#2f63b3', '#3b73c4', '#6aa5ea'], icon: '#ffffff' },
  Gold: { colours: ['#a8670c', '#ca8a04', '#f2c14e'], icon: '#ffffff' },
  Silver: { colours: ['#6b7484', '#8b95a5', '#c3c9d3'], icon: '#ffffff' },
  Bronze: { colours: ['#8a2e0c', '#c2410c', '#e07a3f'], icon: '#ffffff' },
};
const UNCLASSIFIED_BADGE = { colours: ['#6b7280', '#9ca3af'], icon: '#ffffff' };
const colourOf = (category?: string | null) => (category && COLOURS[category]) || '#64748b';
const number = (n?: number) => Math.round(n || 0).toLocaleString('en-IN');

// Mechanic category chip on the home screen; a tap opens what the level means and how to reach the next one
export default function MechanicCategory({ guide }: { guide?: MechanicCategoryGuide }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  if (!guide) return null;

  const current = guide.current;
  const colour = colourOf(current);
  const nextColour = colourOf(guide.next);

  const requirementText = (r: MechanicCategoryGuide['requirements'][number]) => {
    switch (r.type) {
      case 'firstScan':
        return t('category.reqFirstScan');
      case 'points':
        return t('category.reqPoints', { needed: number(r.needed), target: number(r.target) });
      case 'everyMonth':
        return t('category.reqEveryMonth', { done: r.done, target: r.target });
      case 'everyQuarter':
        return t('category.reqEveryQuarter', { done: r.done, target: r.target });
      default:
        return '';
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.badgeWrap, { shadowColor: colour, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
        accessibilityRole="button"
        accessibilityLabel={t('category.title')}>
        <LinearGradient
          colors={(current && BADGES[current]?.colours) || UNCLASSIFIED_BADGE.colours}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}>
          <ShineOverlay interval={2200} duration={1800} />
          <View style={styles.badgeIcon}>
            <Ionicons
              name={current ? ICONS[current] : 'help'}
              size={20}
              color={(current && BADGES[current]?.icon) || UNCLASSIFIED_BADGE.icon}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.badgeCaption}>{t('category.level')}</Text>
            <Text style={styles.badgeText} numberOfLines={1}>
              {current ? `${current} ${t('category.mechanic')}` : t('category.notClassified')}
            </Text>
            {guide.next ? (
              <Text style={styles.badgeNext} numberOfLines={1}>
                {t('category.nextMilestone', { next: guide.next })}
              </Text>
            ) : null}
          </View>
          <View style={styles.badgeView}>
            <Text style={styles.badgeViewText}>{t('category.view')}</Text>
            <Ionicons name="chevron-forward" size={14} color="#111827" />
          </View>
        </LinearGradient>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>{t('category.title')}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color="#374151" />
              </Pressable>
            </View>

            {/* Current level */}
            <View style={[styles.currentCard, { backgroundColor: colour + '14', borderColor: colour + '40' }]}>
              <View style={[styles.currentIcon, { backgroundColor: colour }]}>
                <Ionicons name={current ? ICONS[current] : 'help'} size={22} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.currentLabel}>{t('category.yourLevel')}</Text>
                <Text style={[styles.currentName, { color: colour }]}>
                  {current || t('category.notClassified')}
                </Text>
                {guide.period ? <Text style={styles.period}>{guide.period}</Text> : null}
              </View>
            </View>

            {current ? (
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{number(guide.points)}</Text>
                  <Text style={styles.statLabel}>{t('category.points12')}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{guide.activeMonths}/12</Text>
                  <Text style={styles.statLabel}>{t('category.monthsScanned')}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{guide.activeQuarters}/4</Text>
                  <Text style={styles.statLabel}>{t('category.quartersScanned')}</Text>
                </View>
              </View>
            ) : null}

            {/* Next level */}
            {guide.next ? (
              <View style={styles.nextCard}>
                <Text style={styles.nextTitle}>
                  {t('category.toReach')}{' '}
                  <Text style={{ color: nextColour, fontWeight: '800' }}>{guide.next}</Text>
                </Text>
                {guide.requirements.map((r, index) => {
                  const progress =
                    r.type === 'points' && r.target
                      ? Math.min(1, (r.target - (r.needed || 0)) / r.target)
                      : r.type === 'everyMonth' || r.type === 'everyQuarter'
                        ? Math.min(1, (r.done || 0) / (r.target || 1))
                        : 0;
                  return (
                    <View key={index} style={styles.req}>
                      <View style={[styles.reqDot, { backgroundColor: nextColour }]}>
                        <Text style={styles.reqDotText}>{index + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reqText}>{requirementText(r)}</Text>
                        {r.type !== 'firstScan' ? (
                          <View style={styles.track}>
                            <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: nextColour }]} />
                          </View>
                        ) : null}
                      </View>
                    </View>
                  );
                })}
                <Text style={styles.hint}>{t('category.rollingHint')}</Text>
              </View>
            ) : (
              <View style={[styles.nextCard, { alignItems: 'center' }]}>
                <Ionicons name="trophy" size={28} color={COLOURS.Platinum} />
                <Text style={[styles.nextTitle, { textAlign: 'center', marginTop: 6 }]}>{t('category.topLevel')}</Text>
                <Text style={[styles.hint, { textAlign: 'center' }]}>{t('category.keepScanning')}</Text>
              </View>
            )}

            {/* All levels */}
            <Text style={styles.ladderTitle}>{t('category.howLevels')}</Text>
            {CATEGORIES.map((category) => {
              const on = category === current;
              return (
                <View
                  key={category}
                  style={[styles.level, on && { borderColor: COLOURS[category], backgroundColor: COLOURS[category] + '0f' }]}>
                  <View style={[styles.levelIcon, { backgroundColor: COLOURS[category] + '1f' }]}>
                    <Ionicons name={ICONS[category]} size={16} color={COLOURS[category]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.levelName, { color: COLOURS[category] }]}>
                      {category}
                      {on ? <Text style={styles.youTag}>{'  '}{t('category.you')}</Text> : null}
                    </Text>
                    <Text style={styles.levelRule}>{t(`category.rule${category}`)}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  badgeWrap: {
    alignSelf: 'stretch',
    marginTop: 14,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 12,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badgeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  badgeCaption: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' },
  badgeText: { fontSize: 17, fontWeight: '800', color: 'white', marginTop: 1 },
  badgeNext: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  badgeView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'white',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badgeViewText: { fontSize: 13, fontWeight: '800', color: '#111827' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '88%',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginVertical: 10 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  currentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  currentIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  currentLabel: { fontSize: 12, color: '#6B7280' },
  currentName: { fontSize: 22, fontWeight: '800' },
  period: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  stat: { flex: 1, backgroundColor: '#F7F7F8', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2, textAlign: 'center' },
  nextCard: { marginTop: 14, padding: 14, borderRadius: 16, backgroundColor: '#FFF9EC', borderWidth: 1, borderColor: '#F7D185' },
  nextTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 10 },
  req: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  reqDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  reqDotText: { color: 'white', fontSize: 12, fontWeight: '800' },
  reqText: { fontSize: 14, color: '#1F2937', lineHeight: 20 },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.08)', marginTop: 6, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  hint: { fontSize: 12, color: '#6B7280', lineHeight: 17 },
  ladderTitle: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 18, marginBottom: 8 },
  level: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#EEF0F3', marginBottom: 8 },
  levelIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  levelName: { fontSize: 14, fontWeight: '800' },
  youTag: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  levelRule: { fontSize: 12, color: '#4B5563', marginTop: 1 },
});
