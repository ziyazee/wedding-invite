import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInvitation } from '../hooks/useInvitation';
import type { Invitation } from '../types';
import TemplateRenderer from '../components/templates/TemplateRenderer';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function PublicInvite() {
  const { slug } = useParams<{ slug: string }>();
  const { fetchBySlug } = useInvitation();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchBySlug(slug).then((data) => {
      if (!data) setNotFound(true);
      else {
        setInvitation(data);
        document.title = `${data.details.groomName} & ${data.details.brideName} — Wedding Invitation`;
      }
      setLoading(false);
    });
  }, [slug, fetchBySlug]);

  useEffect(() => {
    if (!invitation) return;
    const meta = document.querySelector('meta[property="og:title"]');
    if (!meta) {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:title');
      tag.content = `${invitation.details.groomName} & ${invitation.details.brideName} — Wedding Invitation`;
      document.head.appendChild(tag);
    }
  }, [invitation]);

  if (loading) return <LoadingSpinner className="min-h-screen" />;

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Invitation Not Found</h2>
          <p className="text-gray-500">This invitation may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  if (!invitation) return null;

  return (
    <div className="min-h-screen">
      <TemplateRenderer
        templateId={invitation.template_id}
        details={invitation.details}
        sectionsOrder={invitation.sections_order}
        slug={invitation.slug}
        showSplash={true}
      />
    </div>
  );
}
