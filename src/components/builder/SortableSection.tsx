import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SectionType } from '../../types';
import { SECTION_LABELS } from '../../constants/sections';

interface SortableSectionProps {
  id: SectionType;
}

export default function SortableSection({ id }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 ${
        isDragging ? 'shadow-lg opacity-90 z-10' : 'shadow-sm'
      }`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 touch-none"
        {...attributes}
        {...listeners}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="7" cy="5" r="1.5" />
          <circle cx="13" cy="5" r="1.5" />
          <circle cx="7" cy="10" r="1.5" />
          <circle cx="13" cy="10" r="1.5" />
          <circle cx="7" cy="15" r="1.5" />
          <circle cx="13" cy="15" r="1.5" />
        </svg>
      </button>
      <span className="text-sm font-medium text-gray-700">{SECTION_LABELS[id]}</span>
    </div>
  );
}
