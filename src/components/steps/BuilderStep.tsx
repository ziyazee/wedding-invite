import type { SectionType, TemplateId, WeddingDetails } from '../../types';
import SortableSectionList from '../builder/SortableSectionList';
import TemplateRenderer from '../templates/TemplateRenderer';
import Button from '../ui/Button';

interface BuilderStepProps {
  details: WeddingDetails;
  templateId: TemplateId;
  sectionsOrder: SectionType[];
  onReorder: (order: SectionType[]) => void;
  onSave: () => void;
  onBack: () => void;
  saving: boolean;
}

const FIXED_LAYOUT_TEMPLATES: TemplateId[] = ['sacred-garden'];

export default function BuilderStep({
  details,
  templateId,
  sectionsOrder,
  onReorder,
  onSave,
  onBack,
  saving,
}: BuilderStepProps) {
  const isFixedLayout = FIXED_LAYOUT_TEMPLATES.includes(templateId);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        {isFixedLayout ? 'Preview Your Invitation' : 'Arrange Your Sections'}
      </h2>
      <p className="text-gray-500 mb-8 text-center">
        {isFixedLayout
          ? 'This template uses a beautifully crafted fixed layout.'
          : 'Drag and drop to reorder the sections of your invitation.'}
      </p>

      <div className={`grid grid-cols-1 ${isFixedLayout ? '' : 'lg:grid-cols-2'} gap-8`}>
        {!isFixedLayout && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Section Order
            </h3>
            <SortableSectionList sections={sectionsOrder} onReorder={onReorder} />
          </div>
        )}

        <div className={isFixedLayout ? 'max-w-lg mx-auto w-full' : ''}>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Live Preview
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm max-h-[600px] overflow-y-auto">
            <TemplateRenderer
              templateId={templateId}
              details={details}
              sectionsOrder={sectionsOrder}
              showSplash={false}
              previewMode={true}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 max-w-lg mx-auto">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save & Preview →'}
        </Button>
      </div>
    </div>
  );
}
