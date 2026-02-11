import Navbar from '../sections/Navbar';
import Hero from '../sections/Hero';
import Tracks from '../sections/Tracks';
import Timeline from '../sections/Timeline';
import Prizes from '../sections/Prizes';
import Panel from '../sections/Panel';
import FAQ from '../sections/FAQ';
import Footer from '../sections/Footer';

function Home() {
    return (
        <div className="min-h-screen bg-[#0a0e27]">
            <Navbar />
            <main>
                <Hero />
                <Tracks />
                <Timeline />
                <Prizes />
                <Panel />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}

export default Home;
