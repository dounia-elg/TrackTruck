import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
            {/* Navigation */}
            <nav className="bg-slate-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-amber-400">🚛 TrackTruck</span>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-amber-400 hover:text-amber-300 font-medium transition"
                            >
                                Se connecter
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition font-medium"
                            >
                                S'inscrire
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            Gérez votre flotte de camions en toute simplicité
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            TrackTruck vous aide à suivre vos véhicules, trajets, maintenance et chauffeurs en temps réel.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 transition text-lg font-medium shadow-lg"
                            >
                                Commencer gratuitement
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-white border-2 border-slate-700 text-slate-700 rounded-lg hover:bg-slate-50 transition text-lg font-medium"
                            >
                                Connexion
                            </Link>
                        </div>
                    </div>
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop"
                            alt="Camion sur la route"
                            className="rounded-2xl shadow-2xl border-4 border-slate-200"
                        />
                    </div>
                </div>
            </section>


        </div>
    );
}

export default Home;