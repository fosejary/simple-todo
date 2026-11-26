import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Platform, Alert, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, TextInput } from '@/components/atoms/AppText';
import { Icon } from '@/components/atoms/Icon';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/constants/theme';
import { Category, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/types';
import { useTodoStore } from '@/stores/todoStore';

type Tab = 'icon' | 'color';

interface CategoryEditorProps {
  category: Category | null;
  visible: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export function CategoryEditor({ category, visible, onClose, onDeleted }: CategoryEditorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const categories = useTodoStore((s) => s.categories);
  const addCategory = useTodoStore((s) => s.addCategory);
  const updateCategory = useTodoStore((s) => s.updateCategory);
  const deleteCategory = useTodoStore((s) => s.deleteCategory);

  const isEdit = category !== null;
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('assignment');
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
  const [tab, setTab] = useState<Tab>('icon');

  useEffect(() => {
    if (visible) {
      setTab('icon');
      if (category) {
        setName(category.name);
        setIcon(category.icon || 'assignment');
        setColor(category.color);
      } else {
        setName('');
        setIcon('assignment');
        setColor(CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length]);
      }
    }
  }, [category, visible]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (isEdit && category) {
      updateCategory(category.id, { name: trimmed, icon, color });
    } else {
      addCategory(trimmed, color, icon);
    }
    onClose();
  };

  const handleDelete = () => {
    if (!category) return;
    const doDelete = () => {
      deleteCategory(category.id);
      onClose();
      onDeleted?.();
    };
    if (Platform.OS === 'web') {
      if (window.confirm(t('category.deleteConfirmMessage', { name: category.name }))) doDelete();
    } else {
      Alert.alert(t('category.deleteConfirmTitle'), t('category.deleteConfirmMessage', { name: category.name }), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {isEdit ? t('categoryEditor.edit') : t('categoryEditor.new')}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Icon name="x" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Preview */}
          <View style={[styles.preview, { backgroundColor: colors.surfaceSunken }]}>
            <MaterialIcons name={icon as any} size={24} color={color} />
            <Text style={[styles.previewName, { color: name.trim() ? colors.textPrimary : colors.textDisabled }]}>
              {name.trim() || t('categoryEditor.namePlaceholder')}
            </Text>
          </View>

          {/* Name input */}
          <View style={[styles.inputRow, { backgroundColor: colors.surfaceVariant }]}>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              value={name}
              onChangeText={setName}
              placeholder={t('categoryEditor.namePlaceholder')}
              placeholderTextColor={colors.textDisabled}
            />
          </View>

          {/* Tab switcher */}
          <View style={[styles.tabBar, { borderBottomColor: colors.divider }]}>
            <Pressable
              onPress={() => setTab('icon')}
              style={[styles.tab, tab === 'icon' && { borderBottomColor: colors.textPrimary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.tabText, { color: tab === 'icon' ? colors.textPrimary : colors.textTertiary }]}>
                {t('categoryEditor.icon')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab('color')}
              style={[styles.tab, tab === 'color' && { borderBottomColor: colors.textPrimary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.tabText, { color: tab === 'color' ? colors.textPrimary : colors.textTertiary }]}>
                {t('categoryEditor.color')}
              </Text>
            </Pressable>
          </View>

          {/* Tab content */}
          <View style={styles.tabContent}>
            {tab === 'icon' ? (
              <View style={styles.grid}>
                {CATEGORY_ICONS.map((ic) => (
                  <Pressable
                    key={ic}
                    onPress={() => setIcon(ic)}
                    style={[
                      styles.gridItem,
                      {
                        backgroundColor: icon === ic ? colors.surfaceVariant : 'transparent',
                        borderColor: icon === ic ? color : 'transparent',
                        borderWidth: icon === ic ? 1.5 : 0,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={ic as any}
                      size={20}
                      color={icon === ic ? color : colors.textSecondary}
                    />
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.grid}>
                {CATEGORY_COLORS.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setColor(c)}
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: c,
                        borderColor: color === c ? colors.textPrimary : 'transparent',
                        borderWidth: color === c ? 2.5 : 0,
                      },
                    ]}
                  >
                    {color === c && <Icon name="check" size={14} color="#FFFFFF" />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {isEdit && (
              <Pressable onPress={handleDelete} style={[styles.deleteBtn, { backgroundColor: colors.errorContainer }]}>
                <Icon name="trash-2" size={18} color={colors.error} />
              </Pressable>
            )}
            <Pressable
              onPress={handleSave}
              disabled={!name.trim()}
              style={[styles.saveBtn, { backgroundColor: name.trim() ? colors.primary : colors.surfaceVariant }]}
            >
              <Text style={[styles.saveBtnText, { color: name.trim() ? colors.onPrimary : colors.textTertiary }]}>{isEdit ? t('categoryEditor.save') : t('detail.add')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,26,24,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 360,
    borderRadius: Radius.sheet - 4,
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.control + 2,
    marginBottom: Spacing.sm,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  inputRow: {
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    marginBottom: Spacing.sm,
  },
  input: {
    fontSize: 15,
    padding: 0,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  tabContent: {
    minHeight: 140,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
