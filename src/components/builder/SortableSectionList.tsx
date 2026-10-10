import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import type { SectionType } from '../../types';
import SortableSection from './SortableSection';

interface SortableSectionListProps {
  sections: SectionType[];
  onReorder: (sections: SectionType[]) => void;
}

export default function SortableSectionList({ sections, onReorder }: SortableSectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.indexOf(active.id as SectionType);
      const newIndex = sections.indexOf(over.id as SectionType);
      onReorder(arrayMove(sections, oldIndex, newIndex));
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <SortableSection key={section} id={section} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
