import { SG } from './styles';
import { RoseCluster, GoldDivider } from './decorations';

interface SplashScreenProps {
  onOpen: () => void;
  animating: boolean;
}

export default function SplashScreen({ onOpen, animating }: SplashScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{
        backgroundColor: SG.bg,
        animation: animating ? 'splashExit 800ms ease-in-out forwards' : undefined,
      }}
    >
      <style>{`
        @keyframes splashExit {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-100%); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="text-center" style={{ animation: 'fadeInUp 1s ease-out' }}>
        <RoseCluster className="mx-auto mb-6 opacity-80" />

        <GoldDivider className="mb-6" />

        <h1
          className="text-5xl md:text-7xl mb-4"
          style={{ fontFamily: SG.fontScript, color: SG.gold }}
        >
          The Sacred Garden
        </h1>

        <p
          className="text-sm tracking-[0.3em] uppercase mb-10"
          style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
        >
          A Wedding Invitation
        </p>

        <GoldDivider className="mb-10" />

        <button
          onClick={onOpen}
          className="px-8 py-3 rounded-full border-2 text-sm tracking-[0.2em] uppercase transition-all hover:scale-105"
          style={{
            borderColor: SG.gold,
            color: SG.gold,
            fontFamily: SG.fontBody,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          Tap to Open
        </button>
      </div>
    </div>
  );
}
