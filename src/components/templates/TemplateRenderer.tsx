import type { TemplateProps, TemplateId } from '../../types';
import ClassicElegant from './ClassicElegant';
import ModernMinimal from './ModernMinimal';
import FloralGarden from './FloralGarden';
import SacredGarden from './sacred-garden/SacredGarden';

interface TemplateRendererProps extends TemplateProps {
  templateId: TemplateId;
}

const TEMPLATE_MAP: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  'classic-elegant': ClassicElegant,
  'modern-minimal': ModernMinimal,
  'floral-garden': FloralGarden,
  'sacred-garden': SacredGarden,
};

export default function TemplateRenderer({ templateId, ...props }: TemplateRendererProps) {
  const Template = TEMPLATE_MAP[templateId];
  return <Template {...props} />;
}
