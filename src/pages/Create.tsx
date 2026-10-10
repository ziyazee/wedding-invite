import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFlow } from '../hooks/useCreateFlow';
import { useInvitation } from '../hooks/useInvitation';
import type { WeddingDetails, TemplateId } from '../types';
import StepIndicator from '../components/ui/StepIndicator';
import EventTypeStep from '../components/steps/EventTypeStep';
import DetailsForm from '../components/steps/DetailsForm';
import TemplatePicker from '../components/steps/TemplatePicker';
import BuilderStep from '../components/steps/BuilderStep';

export default function Create() {
  const navigate = useNavigate();
  const { state, setEventType, setDetails, setTemplate, setSectionsOrder, goBack } = useCreateFlow();
  const { create, loading } = useInvitation();
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    if (!state.templateId || !state.details.groomName) return;
    setSaveError(null);
    const invitation = await create({
      details: state.details as WeddingDetails,
      templateId: state.templateId,
      sectionsOrder: state.sectionsOrder,
    });
    if (invitation) {
      navigate(`/preview/${invitation.id}`);
    } else {
      setSaveError('Failed to save invitation. Please try again.');
    }
  }

  function handleTemplateSelect(id: TemplateId) {
    setTemplate(id);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <StepIndicator currentStep={state.currentStep} />

        {saveError && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {saveError}
          </div>
        )}

        {state.currentStep === 0 && (
          <EventTypeStep onSelect={setEventType} />
        )}

        {state.currentStep === 1 && (
          <DetailsForm
            initial={state.details}
            onSubmit={setDetails}
            onBack={goBack}
          />
        )}

        {state.currentStep === 2 && (
          <TemplatePicker
            selected={state.templateId}
            onSelect={handleTemplateSelect}
            onBack={goBack}
          />
        )}

        {state.currentStep === 3 && state.templateId && (
          <BuilderStep
            details={state.details as WeddingDetails}
            templateId={state.templateId}
            sectionsOrder={state.sectionsOrder}
            onReorder={setSectionsOrder}
            onSave={handleSave}
            onBack={goBack}
            saving={loading}
          />
        )}
      </div>
    </div>
  );
}
