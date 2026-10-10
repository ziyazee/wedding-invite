import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <h1 className="font-[Playfair_Display] text-2xl font-bold text-gray-900">InviteCraft</h1>
        <Link
          to="/create"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Get Started
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <p className="text-sm tracking-[0.25em] uppercase text-rose-400 font-medium mb-4">
            Wedding Invitation Builder
          </p>
          <h2 className="font-[Playfair_Display] text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Beautiful invitations,
            <br />
            <span className="text-rose-500">in minutes</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Choose a template, fill in your details, customize the layout, and share a
            stunning invitation with a single link.
          </p>
          <Link
            to="/create"
            className="inline-block bg-gray-900 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
          >
            Create Your Invitation
          </Link>

          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-medium text-gray-900 mb-1">Pick a Template</h3>
              <p className="text-sm text-gray-500">Three elegant designs to choose from</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✏️</div>
              <h3 className="font-medium text-gray-900 mb-1">Customize</h3>
              <p className="text-sm text-gray-500">Drag and drop sections to your liking</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔗</div>
              <h3 className="font-medium text-gray-900 mb-1">Share</h3>
              <p className="text-sm text-gray-500">One link your guests will love</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
