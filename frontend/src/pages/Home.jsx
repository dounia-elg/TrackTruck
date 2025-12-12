import { Link } from 'react-router-dom';
import { FaTruck, FaArrowRight } from 'react-icons/fa';
import truckHero from '../assets/truckHero.jpg';

function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <FaTruck className="text-white text-lg" />
                            </div>
                            <span className="text-2xl font-bold text-black">TrackTruck</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <Link
                                to="/login"
                                className="px-5 py-2 text-gray-700 hover:text-black font-medium transition"
                            >
                                Connexion
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                            >
                                Commencer
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h1 className="text-6xl font-black text-black mb-6 leading-tight">
                            Gérez votre flotte simplement
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            Suivez vos camions, gérez vos trajets et optimisez votre maintenance en temps réel.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition text-lg font-semibold"
                            >
                                Essai gratuit <FaArrowRight className="text-sm" />
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white border-2 border-black text-black rounded-lg hover:bg-gray-50 transition text-lg font-medium text-center"
                            >
                                Se connecter
                            </Link>
                        </div>
                    </div>
                    <div>
                        <img
                            src={truckHero} 
                            alt="Flotte de camions"
                            className="rounded-2xl shadow-2xl w-full"
                        />
                    </div>
                </div>
            </section>          
        </div>
    );
}

export default Home;