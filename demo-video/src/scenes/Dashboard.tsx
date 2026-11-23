import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';
import { Sidebar } from './DashboardShell';

const MetricCard: React.FC<{ label: string; value: string; sub: string; delay: number }> = ({ label, value, sub, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: 12, padding: '20px 24px',
      boxShadow: '0 2px 12px #00000008', flex: 1,
      opacity: interpolate(frame, [delay * fps, (delay + 0.4) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      translate: `0px ${interpolate(frame, [delay * fps, (delay + 0.4) * fps], [15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
    }}>
      <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage }}>{value}</div>
      <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#4CAF50', marginTop: 4 }}>{sub}</div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      <Sidebar activeTab="Dashboard" />

      {/* Main content */}
      <div style={{ position: 'absolute', left: 226, top: 30, right: 40 }}>
        {/* Header */}
        <div style={{
          marginBottom: 20,
          opacity: interpolate(frame, [0.2 * fps, 0.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: theme.champagne, textTransform: 'uppercase' }}>Your Dashboard</div>
          <div style={{ fontSize: 28, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage, marginTop: 4 }}>Welcome back, Elegant Cards</div>
        </div>

        {/* Metrics row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <MetricCard label="Total Orders" value="247" sub="↑ 18% this month" delay={0.5} />
          <MetricCard label="Revenue" value="₹3.2L" sub="↑ 24% this month" delay={0.65} />
          <MetricCard label="This Week" value="12" sub="3 published today" delay={0.8} />
          <MetricCard label="Templates" value="18" sub="All active" delay={0.95} />
        </div>

        {/* Recent orders table */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 12, padding: 20,
          boxShadow: '0 2px 12px #00000008',
          opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [1.2 * fps, 1.8 * fps], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage, marginBottom: 16 }}>Recent Orders</div>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 12, padding: '8px 0', borderBottom: `1px solid ${theme.sage}11`, fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, textTransform: 'uppercase', letterSpacing: 1 }}>
            <div>Couple</div><div>Template</div><div>Date</div><div>Status</div><div>Amount</div>
          </div>
          {/* Rows */}
          {[
            ['Arjun & Bhavana', 'Embroidered Garden', 'Nov 10', 'Published', '₹1,500'],
            ['Rahul & Priya', 'Majestic', 'Nov 9', 'Published', '₹1,800'],
            ['Vikram & Meera', 'Raabta', 'Nov 8', 'Draft', '₹1,200'],
            ['Karan & Ananya', 'Royal Grace', 'Nov 7', 'Published', '₹2,000'],
          ].map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 12,
              padding: '10px 0', borderBottom: `1px solid ${theme.sage}08`,
              fontSize: 13, fontFamily: 'Inter, sans-serif', color: theme.darkText,
              opacity: interpolate(frame, [(1.5 + i * 0.15) * fps, (1.9 + i * 0.15) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <div style={{ fontWeight: 500 }}>{row[0]}</div>
              <div style={{ color: theme.warmBrown }}>{row[1]}</div>
              <div style={{ color: theme.warmBrown }}>{row[2]}</div>
              <div><span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, backgroundColor: row[3] === 'Published' ? '#4CAF5015' : '#FF980015', color: row[3] === 'Published' ? '#4CAF50' : '#FF9800' }}>{row[3]}</span></div>
              <div style={{ fontWeight: 500 }}>{row[4]}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
