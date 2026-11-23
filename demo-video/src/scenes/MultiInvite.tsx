import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';
import { Sidebar } from './DashboardShell';

const invitations: { name: string; events: { label: string; checked: boolean }[]; link: string }[] = [
  { name: 'Wedding Invitation', events: [{ label: 'Wedding Ceremony', checked: true }, { label: 'Mehendi', checked: false }, { label: 'Sangeet', checked: false }], link: '/arjun-bhavana-4821' },
  { name: 'Mehendi Invitation', events: [{ label: 'Wedding Ceremony', checked: false }, { label: 'Mehendi', checked: true }, { label: 'Sangeet', checked: false }], link: '/arjun-bhavana-mehendi' },
  { name: 'Full Celebration', events: [{ label: 'Wedding Ceremony', checked: true }, { label: 'Mehendi', checked: true }, { label: 'Sangeet', checked: true }], link: '/arjun-bhavana-full' },
];

export const MultiInvite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      <Sidebar activeTab="Orders" />

      <div style={{ position: 'absolute', left: 226, top: 30, right: 40, bottom: 30, padding: '0 20px' }}>
        {/* Header */}
        <div style={{
          marginBottom: 20,
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: theme.champagne, textTransform: 'uppercase' }}>Arjun & Bhavana · Order #1247</div>
          <div style={{ fontSize: 24, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage, marginTop: 4 }}>Configure Invitations</div>
          <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginTop: 4 }}>Create separate invitations from this order — each gets its own shareable link</div>
        </div>

        {/* Invitation cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {invitations.map((inv, i) => (
            <div key={inv.name} style={{
              backgroundColor: '#fff', borderRadius: 14, padding: '20px 24px',
              boxShadow: '0 2px 14px #00000008',
              display: 'flex', alignItems: 'center', gap: 24,
              opacity: interpolate(frame, [(0.6 + i * 0.5) * fps, (1 + i * 0.5) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              translate: `0px ${interpolate(frame, [(0.6 + i * 0.5) * fps, (1 + i * 0.5) * fps], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
            }}>
              {/* Invitation name */}
              <div style={{ minWidth: 180 }}>
                <div style={{ fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage }}>{inv.name}</div>
                <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginTop: 4 }}>
                  {inv.events.filter(e => e.checked).length} event{inv.events.filter(e => e.checked).length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Event checkboxes */}
              <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                {inv.events.map(ev => (
                  <div key={ev.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      backgroundColor: ev.checked ? theme.sage : '#fff',
                      border: ev.checked ? 'none' : `2px solid ${theme.sage}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: '#fff', fontWeight: 700,
                    }}>
                      {ev.checked && '✓'}
                    </div>
                    <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: ev.checked ? theme.darkText : '#aaa' }}>{ev.label}</div>
                  </div>
                ))}
              </div>

              {/* Link preview */}
              <div style={{
                padding: '6px 14px', borderRadius: 7, backgroundColor: `${theme.sage}08`,
                fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.sage, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 12 }}>🔗</span>
                shaadiinvites.in{inv.link}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{
          marginTop: 24, display: 'flex', alignItems: 'center', gap: 8,
          opacity: interpolate(frame, [3 * fps, 3.5 * fps], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: `${theme.sage}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💡</div>
          <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, fontStyle: 'italic' }}>
            Each invitation gets its own shareable link — share only what's relevant to each guest
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
