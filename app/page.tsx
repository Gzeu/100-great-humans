import { listAgents } from '../src/agents';

export default async function HomePage() {
  const agents = listAgents();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            100 Great Humans
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Advanced multi-modal agent persona library for the 100 most influential humans in history
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">📊 Dataset</h2>
              <p className="text-gray-700">
                <strong>{agents.length}</strong> historical figures
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">🚀 TypeScript SDK</h2>
              <p className="text-gray-700">
                Ready for Node.js & Next.js integration
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">🐍 Python Library</h2>
              <p className="text-gray-700">
                8 advanced skills with learning system
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">🌐 FastAPI Server</h2>
              <p className="text-gray-700">
                Production-ready REST API
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://github.com/Gzeu/100-great-humans" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
