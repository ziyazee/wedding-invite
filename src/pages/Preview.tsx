import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInvitation } from '../hooks/useInvitation';
import type { Invitation } from '../types';
import TemplateRenderer from '../components/templates/TemplateRenderer';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const { fetchById } = useInvitation();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchById(id).then((data) => {
      setInvitation(data);
      setLoading(false);
    });
  }, [id, fetchById]);

  if (loading) return <LoadingSpinner className="min-h-screen" />;
  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invitation not found</h2>
          <Link to="/" className="text-gray-600 hover:text-gray-900 underline">Go home</Link>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/invite/${invitation.slug}`;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Your Invitation is Ready!</h1>
          <p className="text-gray-500">Share the link below with your guests.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 block">
            Shareable Link
          </label>
          <div className="flex gap-3">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button onClick={handleCopy} size="sm">
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <TemplateRenderer
            templateId={invitation.template_id}
            details={invitation.details}
            sectionsOrder={invitation.sections_order}
            slug={invitation.slug}
            showSplash={false}
            previewMode={true}
          />
        </div>

        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="secondary">Create Another Invitation</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
