import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { format } from 'date-fns';
import { useTodoStore, type ImportItem } from '@/stores/todoStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { Category, StreakData, Todo, UserSettings } from '@/lib/types';

// Format id predates the Sunlist rename; keep it so every existing backup still restores.
const FORMAT = 'simpletodo-backup';
const VERSION = 1;

export interface BackupFile {
  format: typeof FORMAT;
  version: number;
  exportedAt: string;
  data: { todos: Todo[]; categories: Category[]; streaks: Record<string, StreakData> };
  settings: UserSettings;
}

export interface BackupSummary {
  todos: number;
  categories: number;
  exportedAt: string;
}

function buildBackup(): BackupFile {
  const { todos, categories, streaks } = useTodoStore.getState();
  const { theme } = useSettingsStore.getState();
  return {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    // Soft-deleted items are pending purge; leave them out of the file.
    data: { todos: todos.filter((t) => !t.is_deleted), categories, streaks },
    settings: { theme },
  };
}

/** Writes a JSON backup and opens the share sheet (save to Drive, send to self, …). */
export async function exportBackup(dialogTitle: string): Promise<void> {
  const json = JSON.stringify(buildBackup(), null, 2);
  const name = `Sunlist-backup-${format(new Date(), 'yyyyMMdd-HHmm')}.json`;

  if (Platform.OS === 'web') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(json);
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle, UTI: 'public.json' });
}

export class BackupError extends Error {}

function parseBackup(text: string): BackupFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new BackupError('not-json');
  }
  const b = parsed as Partial<BackupFile>;
  if (
    !b ||
    b.format !== FORMAT ||
    typeof b.version !== 'number' ||
    b.version > VERSION ||
    !b.data ||
    !Array.isArray(b.data.todos) ||
    !Array.isArray(b.data.categories)
  ) {
    throw new BackupError('invalid');
  }
  const todos = b.data.todos.filter(
    (t): t is Todo => !!t && typeof t.id === 'string' && typeof t.title === 'string'
  );
  return {
    format: FORMAT,
    version: b.version,
    exportedAt: typeof b.exportedAt === 'string' ? b.exportedAt : '',
    data: {
      todos: todos.map((t) => ({ ...t, subtasks: Array.isArray(t.subtasks) ? t.subtasks : [] })),
      categories: b.data.categories.filter((c): c is Category => !!c && typeof c.id === 'string'),
      streaks: b.data.streaks && typeof b.data.streaks === 'object' ? b.data.streaks : {},
    },
    settings: b.settings?.theme ? { theme: b.settings.theme } : { theme: 'system' },
  };
}

/** Lets the user pick a backup file. Returns null if they cancel. */
export async function pickBackup(): Promise<{ backup: BackupFile; summary: BackupSummary } | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'text/plain', '*/*'],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  const text =
    Platform.OS === 'web' && asset.file ? await asset.file.text() : await new File(asset.uri).text();
  const backup = parseBackup(text);
  return {
    backup,
    summary: {
      todos: backup.data.todos.length,
      categories: backup.data.categories.length,
      exportedAt: backup.exportedAt,
    },
  };
}

/** Replaces everything on this device with the backup's contents. */
export function restoreBackup(backup: BackupFile): void {
  useTodoStore.getState().replaceAll(backup.data);
  useSettingsStore.getState().updateSetting('theme', backup.settings.theme);
}

/**
 * Turns pasted text into tasks: one per line. Understands common list and
 * checklist prefixes ("- ", "• ", "1. ", "[ ]", "- [x]") from other apps' exports.
 */
export function parseTaskLines(text: string): ImportItem[] {
  const items: ImportItem[] = [];
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    line = line.replace(/^(?:[-*•·▪◦]|\d+[.)])\s+/, '');
    let completed = false;
    const box = line.match(/^\[( |x|X|✓|✔)\]\s*/);
    if (box) {
      completed = box[1] !== ' ';
      line = line.slice(box[0].length);
    } else if (/^[☐□]\s*/.test(line)) {
      line = line.replace(/^[☐□]\s*/, '');
    } else if (/^[☑✅✔✓]\s*/.test(line)) {
      completed = true;
      line = line.replace(/^[☑✅✔✓]\s*/, '');
    }
    line = line.trim();
    if (line) items.push({ title: line.slice(0, 500), completed });
  }
  return items;
}
