import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Grade } from '../../../domain/enums';
import {
  AttemptHistoryItem,
  AttemptStats,
  GameScoreSummary,
} from '../../../domain/repositories/AttemptRepository';
import { attemptRepository } from '../../../core/di/container';
import { SoundService } from '../../../core/sound/SoundService';
import { useAppStore } from '../../stores/useAppStore';
import { GAMES } from '../../games/registry';
import { colors, fontSize, radius, spacing } from '../../theme';

const AVATARS = ['🧒', '👧', '🧕', '👦', '🧑', '👶'];

export function ProfileScreen() {
  const { name, age, avatar, grade, stars, updateProfile, setGrade } = useAppStore();

  const [activeTab, setActiveTab] = useState<'games' | 'attempts'>('games');
  const [gameScores, setGameScores] = useState<GameScoreSummary[]>([]);
  const [attempts, setAttempts] = useState<AttemptHistoryItem[]>([]);
  const [stats, setStats] = useState<AttemptStats>({ total: 0, correct: 0, accuracy: 0 });

  // Edit Modal State
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAge, setEditAge] = useState(age);
  const [editAvatar, setEditAvatar] = useState(avatar);
  const [editGrade, setEditGrade] = useState<Grade>(grade);

  const loadData = async () => {
    try {
      const [scores, history, statData] = await Promise.all([
        attemptRepository.getGameScoreSummaries(),
        attemptRepository.getAttemptHistory(30),
        attemptRepository.getAttemptStats(),
      ]);
      setGameScores(scores);
      setAttempts(history);
      setStats(statData);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadData();
  }, [stars]);

  const openEdit = () => {
    SoundService.tap();
    setEditName(name);
    setEditAge(age);
    setEditAvatar(avatar);
    setEditGrade(grade);
    setEditModal(true);
  };

  const saveEdit = async () => {
    SoundService.correct();
    await updateProfile({
      name: editName.trim() || 'Sahabat Kecil',
      age: editAge,
      avatar: editAvatar,
      grade: editGrade,
    });
    setGrade(editGrade);
    setEditModal(false);
    loadData();
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Profile Card Header */}
      <Animated.View entering={FadeIn} style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{avatar}</Text>
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeBadgeText}>KLS {grade}</Text>
          </View>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileAge}>
            {age} Tahun · Siswa SD Kelas {grade}
          </Text>
          <View style={styles.starRow}>
            <Text style={styles.starBadge}>⭐ {stars} Bintang Pahala</Text>
          </View>
        </View>

        <Pressable style={styles.editBtn} onPress={openEdit}>
          <Text style={styles.editBtnText}>✏️ Edit</Text>
        </Pressable>
      </Animated.View>

      {/* Stats Summary Card */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Soal Dikerjakan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={[styles.statNumber, { color: colors.primaryDark }]}>{stats.correct}</Text>
          <Text style={styles.statLabel}>Soal Benar</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={[styles.statNumber, { color: colors.secondary }]}>{stats.accuracy}%</Text>
          <Text style={styles.statLabel}>Akurasi</Text>
        </View>
      </View>

      {/* Tabs Selector: Skor Mini Game vs Riwayat Soal */}
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => {
            SoundService.tap();
            setActiveTab('games');
          }}
          style={[styles.tabBtn, activeTab === 'games' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'games' && styles.tabBtnTextActive]}>
            🎮 Skor Mini Game
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            SoundService.tap();
            setActiveTab('attempts');
          }}
          style={[styles.tabBtn, activeTab === 'attempts' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'attempts' && styles.tabBtnTextActive]}>
            📝 Riwayat Soal
          </Text>
        </Pressable>
      </View>

      {/* Tab 1: Skor Mini Game */}
      {activeTab === 'games' && (
        <View style={styles.gameList}>
          {GAMES.map((g) => {
            const scoreItem = gameScores.find((s) => s.gameId === g.id);
            const best = scoreItem?.bestScore ?? 0;
            const played = scoreItem?.timesPlayed ?? 0;

            return (
              <View key={g.id} style={styles.gameCard}>
                <View style={[styles.gameIconBox, { backgroundColor: g.color }]}>
                  <Text style={styles.gameEmoji}>{g.emoji}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.gameTitle}>{g.title}</Text>
                  <Text style={styles.gameConcept}>{g.concept}</Text>
                  <Text style={styles.gamePlayed}>Dimainkan: {played} kali</Text>
                </View>

                <View style={styles.scorePill}>
                  <Text style={styles.scorePillLabel}>Skor Terbaik</Text>
                  <Text style={styles.scorePillValue}>{best} ⭐</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Tab 2: Riwayat Soal */}
      {activeTab === 'attempts' && (
        <View style={styles.attemptsList}>
          {attempts.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📜</Text>
              <Text style={styles.emptyTitle}>Belum Ada Soal Dikerjakan</Text>
              <Text style={styles.emptyDesc}>
                Ayo coba kerjakan latihan di Bank Soal atau Materi untuk mencatat nilaimu di sini!
              </Text>
            </View>
          ) : (
            attempts.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.attemptCard,
                  item.isCorrect ? styles.attemptCorrect : styles.attemptWrong,
                ]}
              >
                <View style={styles.attemptTop}>
                  <Text style={styles.attemptTopic}>{item.operation}</Text>
                  <Text
                    style={[
                      styles.attemptStatus,
                      { color: item.isCorrect ? colors.primaryDark : '#E63946' },
                    ]}
                  >
                    {item.isCorrect ? '✅ Benar' : '❌ Salah'}
                  </Text>
                </View>

                <Text style={styles.attemptQuestion}>{item.questionText}</Text>

                <View style={styles.attemptFooter}>
                  <Text style={styles.attemptAnswer}>
                    Jawabanmu: <Text style={{ fontWeight: '900' }}>{item.userAnswer ?? '-'}</Text>
                  </Text>
                  <Text style={styles.attemptCorrectAnswer}>
                    Kunci: <Text style={{ fontWeight: '900' }}>{item.correctAnswer}</Text>
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Edit Profile Modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profil Sahabat</Text>

            {/* Avatar Selector */}
            <Text style={styles.inputLabel}>Pilih Avatar Karakter:</Text>
            <View style={styles.avatarPicker}>
              {AVATARS.map((av) => (
                <Pressable
                  key={av}
                  onPress={() => {
                    SoundService.pop();
                    setEditAvatar(av);
                  }}
                  style={[styles.avatarOption, editAvatar === av && styles.avatarOptionSelected]}
                >
                  <Text style={styles.avatarOptText}>{av}</Text>
                </Pressable>
              ))}
            </View>

            {/* Name Input */}
            <Text style={styles.inputLabel}>Nama Lengkap / Panggilan:</Text>
            <TextInput
              style={styles.textInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Masukkan namamu..."
              placeholderTextColor={colors.textMuted}
            />

            {/* Age Stepper */}
            <Text style={styles.inputLabel}>Umur Anak:</Text>
            <View style={styles.stepperRow}>
              <Pressable
                onPress={() => {
                  SoundService.tap();
                  setEditAge((a) => Math.max(5, a - 1));
                }}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </Pressable>
              <Text style={styles.ageValue}>{editAge} Tahun</Text>
              <Pressable
                onPress={() => {
                  SoundService.tap();
                  setEditAge((a) => Math.min(12, a + 1));
                }}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </Pressable>
            </View>

            {/* Grade Selector */}
            <Text style={styles.inputLabel}>Kelas Sekolah Dasar:</Text>
            <View style={styles.gradeRow}>
              {[Grade.One, Grade.Two, Grade.Three].map((g) => (
                <Pressable
                  key={g}
                  onPress={() => {
                    SoundService.tap();
                    setEditGrade(g);
                  }}
                  style={[styles.gradeBtn, editGrade === g && styles.gradeBtnActive]}
                >
                  <Text
                    style={[
                      styles.gradeBtnText,
                      editGrade === g && styles.gradeBtnTextActive,
                    ]}
                  >
                    Kelas {g}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.modalActionRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setEditModal(false)}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>Simpan Profil ✅</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120, gap: spacing.md },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: '#EFE6D5',
    gap: 12,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF7DC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  avatarText: { fontSize: 38 },
  gradeBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  gradeBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  infoCol: { flex: 1, gap: 2 },
  profileName: { fontSize: 20, fontWeight: '900', color: colors.text },
  profileAge: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  starRow: { marginTop: 4 },
  starBadge: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B45309',
    backgroundColor: '#FFFBEA',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editBtnText: { fontSize: 13, fontWeight: '800', color: colors.text },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  statCol: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '900', color: colors.text },
  statLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#E5E7EB' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#EBE5D8',
    borderRadius: radius.pill,
    padding: 4,
    gap: 6,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.primary },
  tabBtnText: { fontSize: 14, fontWeight: '800', color: colors.text },
  tabBtnTextActive: { color: '#fff' },
  gameList: { gap: 10 },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  gameIconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameEmoji: { fontSize: 28 },
  gameTitle: { fontSize: 15, fontWeight: '900', color: colors.text },
  gameConcept: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  gamePlayed: { fontSize: 11, fontWeight: '700', color: colors.primaryDark, marginTop: 2 },
  scorePill: {
    backgroundColor: '#FFF7DC',
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  scorePillLabel: { fontSize: 10, fontWeight: '800', color: '#8B5E34' },
  scorePillValue: { fontSize: 16, fontWeight: '900', color: '#8B5E34', marginTop: 1 },
  attemptsList: { gap: 10 },
  attemptCard: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
    gap: 6,
  },
  attemptCorrect: { borderColor: '#A7F3D0', backgroundColor: '#F0FDF4' },
  attemptWrong: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  attemptTop: { flexDirection: 'row', justifyContent: 'space-between' },
  attemptTopic: { fontSize: 12, fontWeight: '800', color: colors.textMuted },
  attemptStatus: { fontSize: 13, fontWeight: '900' },
  attemptQuestion: { fontSize: 14, fontWeight: '700', color: colors.text },
  attemptFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  attemptAnswer: { fontSize: 12, color: colors.textMuted },
  attemptCorrectAnswer: { fontSize: 12, color: colors.primaryDark },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
  emptyDesc: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  modalTitle: { fontSize: 20, fontWeight: '900', color: colors.text, textAlign: 'center', marginBottom: 4 },
  inputLabel: { fontSize: 13, fontWeight: '800', color: colors.textMuted, marginTop: 4 },
  avatarPicker: { flexDirection: 'row', justifyContent: 'space-between' },
  avatarOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionSelected: {
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: '#B45309',
  },
  avatarOptText: { fontSize: 24 },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 24, fontWeight: '900', color: colors.text },
  ageValue: { fontSize: 18, fontWeight: '900', color: colors.text, minWidth: 80, textAlign: 'center' },
  gradeRow: { flexDirection: 'row', gap: 10 },
  gradeBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  gradeBtnActive: { backgroundColor: colors.primary },
  gradeBtnText: { fontSize: 14, fontWeight: '800', color: colors.text },
  gradeBtnTextActive: { color: '#fff' },
  modalActionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '800', color: colors.text },
  saveBtn: {
    flex: 1.4,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  saveBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

