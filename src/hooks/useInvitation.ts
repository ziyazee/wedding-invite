import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { slugify, appendSuffix } from '../lib/slugify';
import type { Invitation, SectionType, TemplateId, WeddingDetails } from '../types';

const STORAGE_KEY = 'invitecraft_invitations';

function getLocalInvitations(): Invitation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalInvitations(invitations: Invitation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations));
}

export function useInvitation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchById = useCallback(async (id: string): Promise<Invitation | null> => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      const all = getLocalInvitations();
      setLoading(false);
      return all.find((inv) => inv.id === id) || null;
    }

    const { data, error: err } = await supabase!
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();
    setLoading(false);
    if (err) { setError(err.message); return null; }
    return data as Invitation;
  }, []);

  const fetchBySlug = useCallback(async (slug: string): Promise<Invitation | null> => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      const all = getLocalInvitations();
      setLoading(false);
      return all.find((inv) => inv.slug === slug) || null;
    }

    const { data, error: err } = await supabase!
      .from('invitations')
      .select('*')
      .eq('slug', slug)
      .single();
    setLoading(false);
    if (err) { setError(err.message); return null; }
    return data as Invitation;
  }, []);

  const checkSlugAvailable = useCallback(async (slug: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      const all = getLocalInvitations();
      return !all.some((inv) => inv.slug === slug);
    }

    const { data } = await supabase!
      .from('invitations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    return !data;
  }, []);

  const create = useCallback(async (params: {
    details: WeddingDetails;
    templateId: TemplateId;
    sectionsOrder: SectionType[];
  }): Promise<Invitation | null> => {
    setLoading(true);
    setError(null);

    let slug = slugify(params.details.groomName, params.details.brideName);
    const available = await checkSlugAvailable(slug);
    if (!available) slug = appendSuffix(slug);

    if (!isSupabaseConfigured) {
      const invitation: Invitation = {
        id: crypto.randomUUID(),
        slug,
        event_type: 'wedding',
        template_id: params.templateId,
        sections_order: params.sectionsOrder,
        details: params.details,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const all = getLocalInvitations();
      all.push(invitation);
      saveLocalInvitations(all);
      setLoading(false);
      return invitation;
    }

    const { data, error: err } = await supabase!
      .from('invitations')
      .insert({
        slug,
        event_type: 'wedding',
        template_id: params.templateId,
        sections_order: params.sectionsOrder,
        details: params.details,
      })
      .select()
      .single();

    setLoading(false);
    if (err) { setError(err.message); return null; }
    return data as Invitation;
  }, [checkSlugAvailable]);

  return { fetchById, fetchBySlug, create, checkSlugAvailable, loading, error };
}
