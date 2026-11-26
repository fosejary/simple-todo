import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, View, StyleProp, ViewStyle } from 'react-native';
import ReorderableList, {
  reorderItems,
  useIsActive,
  useReorderableDrag,
  type ReorderableListReorderEvent,
} from 'react-native-reorderable-list';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { TodoItem, type RowPosition } from '@/components/molecules/TodoItem';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Spacing } from '@/constants/theme';
import { Todo } from '@/lib/types';

export interface TodoSection {
  key: string;
  title?: string;
  data: Todo[];
  showDate?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  action?: { label: string; onPress: () => void };
}

type Row =
  | { type: 'header'; key: string; section: TodoSection }
  | { type: 'todo'; key: string; todo: Todo; showDate: boolean; position: RowPosition };

interface TodoSectionListProps {
  sections: TodoSection[];
  onPressTodo: (id: string) => void;
  hideCategory?: boolean;
  /** Key of the one section whose rows can be long-pressed and dragged. */
  reorderSectionKey?: string;
  onReorder?: (orderedIds: string[]) => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function positionOf(index: number, count: number): RowPosition {
  if (count === 1) return 'single';
  if (index === 0) return 'first';
  if (index === count - 1) return 'last';
  return 'middle';
}

function buildRows(sections: TodoSection[]): Row[] {
  const out: Row[] = [];
  for (const section of sections) {
    if (section.data.length === 0) continue;
    if (section.title) out.push({ type: 'header', key: `h-${section.key}`, section });
    if (section.collapsible && section.collapsed) continue;
    section.data.forEach((todo, i) =>
      out.push({
        type: 'todo',
        key: todo.id,
        todo,
        showDate: !!section.showDate,
        position: positionOf(i, section.data.length),
      })
    );
  }
  return out;
}

function SectionHeaderFor({ section }: { section: TodoSection }) {
  return (
    <SectionHeader
      title={section.title!}
      count={section.data.length}
      collapsible={section.collapsible}
      collapsed={section.collapsed}
      onToggle={section.onToggle}
      action={section.action}
    />
  );
}

/** Static rendering for the small sections around the draggable one. */
function StaticRows({
  rows,
  onPressTodo,
  hideCategory,
}: {
  rows: Row[];
  onPressTodo: (id: string) => void;
  hideCategory: boolean;
}) {
  return (
    <>
      {rows.map((r) =>
        r.type === 'header' ? (
          <SectionHeaderFor key={r.key} section={r.section} />
        ) : (
          <TodoItem
            key={r.key}
            todo={r.todo}
            onPress={onPressTodo}
            showDate={r.showDate}
            position={r.position}
            hideCategory={hideCategory}
          />
        )
      )}
    </>
  );
}

const DraggableRow = memo(function DraggableRow({
  todo,
  position,
  onPressTodo,
  hideCategory,
}: {
  todo: Todo;
  position: RowPosition;
  onPressTodo: (id: string) => void;
  hideCategory: boolean;
}) {
  const drag = useReorderableDrag();
  const active = useIsActive();
  const startDrag = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    drag();
  }, [drag]);
  return (
    <TodoItem
      todo={todo}
      onPress={onPressTodo}
      position={position}
      hideCategory={hideCategory}
      onLongPress={startDrag}
      active={active}
    />
  );
});

export function TodoSectionList({
  sections,
  onPressTodo,
  hideCategory = false,
  reorderSectionKey,
  onReorder,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
}: TodoSectionListProps) {
  const listProps = {
    keyboardShouldPersistTaps: 'handled' as const,
    keyboardDismissMode: 'on-drag' as const,
    showsVerticalScrollIndicator: false,
    contentContainerStyle: [{ paddingBottom: Spacing.xl }, contentContainerStyle],
  };

  const reorderIndex = sections.findIndex((s) => s.key === reorderSectionKey);
  const reorderSection = reorderIndex >= 0 ? sections[reorderIndex] : undefined;
  const canReorder =
    !!reorderSection && !!onReorder && reorderSection.data.length > 1 && !reorderSection.collapsed;

  const rows = useMemo(() => buildRows(sections), [sections]);
  const before = useMemo(
    () => (canReorder ? buildRows(sections.slice(0, reorderIndex)) : []),
    [sections, canReorder, reorderIndex]
  );
  const after = useMemo(
    () => (canReorder ? buildRows(sections.slice(reorderIndex + 1)) : []),
    [sections, canReorder, reorderIndex]
  );

  const renderRow = useCallback(
    ({ item }: { item: Row }) =>
      item.type === 'header' ? (
        <SectionHeaderFor section={item.section} />
      ) : (
        <TodoItem
          todo={item.todo}
          onPress={onPressTodo}
          showDate={item.showDate}
          position={item.position}
          hideCategory={hideCategory}
        />
      ),
    [onPressTodo, hideCategory]
  );

  const reorderData = reorderSection?.data ?? [];
  const renderDraggable = useCallback(
    ({ item, index }: { item: Todo; index: number }) => (
      <DraggableRow
        todo={item}
        position={positionOf(index, reorderData.length)}
        onPressTodo={onPressTodo}
        hideCategory={hideCategory}
      />
    ),
    [onPressTodo, hideCategory, reorderData.length]
  );

  const handleReorder = useCallback(
    ({ from, to }: ReorderableListReorderEvent) => {
      if (from === to) return;
      onReorder?.(reorderItems(reorderData, from, to).map((t) => t.id));
    },
    [onReorder, reorderData]
  );

  if (!canReorder || !reorderSection) {
    return (
      <FlatList
        data={rows}
        keyExtractor={(r) => r.key}
        renderItem={renderRow}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        {...listProps}
      />
    );
  }

  return (
    <ReorderableList
      data={reorderData}
      keyExtractor={(t) => t.id}
      renderItem={renderDraggable}
      onReorder={handleReorder}
      shouldUpdateActiveItem
      // The row draws its own lift (shadow + scale); keep it opaque so rows below don't show through.
      cellAnimations={{ opacity: 1 }}
      ListHeaderComponent={
        <View>
          {ListHeaderComponent}
          <StaticRows rows={before} onPressTodo={onPressTodo} hideCategory={hideCategory} />
          {reorderSection.title ? <SectionHeaderFor section={reorderSection} /> : null}
        </View>
      }
      ListFooterComponent={
        <View>
          <StaticRows rows={after} onPressTodo={onPressTodo} hideCategory={hideCategory} />
          {ListFooterComponent}
        </View>
      }
      {...listProps}
    />
  );
}
