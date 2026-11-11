import { useState } from "react";
import "../styles/Home.css";

const heroImages = [
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0cBRxY4pYqEuoXuuc0X73lUXByafVA42O_RDuntVd2uEbfMeKQvNxNWBBwvISU6U3ArDL9oLidXY-2x412_ZBV_1K9Iu3i9IWjGhE10g6vfwXalT1Xr9u6EUgaVsnIXjbKCwYJAInRM-AcNmiFpKkZCmy3j1NFB4W6WUSi4LnBTIv80jQtsZErhBIMVJ0pHRNc2zv6aQEe_udgHx5AQcxV74e9-OH4cj-PnjC0Gs",
    title: "Villa contemporaine",
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBslXqjUeHQlH6R9Vjuwe9QN06I7nUwN0tbFP5EgZlCvDuX3e2xQwkPMpJj-4gp2b0WbH05JXOhIxopUicqr0C098pJEwYWDdVARIdpxk0i7RH-bXlucyAivnzZsMuTEcSn0_OooZehaXjUi5ZUZ5MtHELdL_OZJjqCpx0rIsMTsdrOluaHrmEwQeN-yKmWt2MR4t0C7FuLORgJBi5T2tVXzmLyYId9OBpzJAUAX24",
    title: "Maison moderne",
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHex-azUInK6fnHBCzBw7sL9K0RRegSpYWFrp4o8cmLJODjOA4IyAMrLk1WsV9D3GVEzq9MTAIi155_FPaOh5A6h8BPvPmT0z847HRAEBSRVL-qEzONWHlKggeNHT0wO50gIVWL4mEvaVVFTsvgXfsh2fjBTPqR74BwS5PaszDk732MTUV4KID2ttpb3o0dcS8Ax7DOGbH_B7Vq8mYJJmPnkJ6aON9MxlcmUm6VSA",
    title: "Villa duplex",
  },
];

const advantages = [
  {
    icon: "↗",
    title: "Construction rapide",
    description: "Réduction des délais grâce à la préfabrication maîtrisée en atelier.",
  },
  {
    icon: "⬡",
    title: "Structure homogène",
    description: "Béton armé vibré de haute résistance pour une structure solide et durable.",
  },
  {
    icon: "✧",
    title: "Finitions sur mesure",
    description: "Personnalisation de vos revêtements, sanitaires et menuiseries.",
  },
];

const houses = [
  {
    name: "Modèle F3",
    surface: "85 m² habitables",
    description: "2 chambres • Salon traversant • Cuisine ouverte",
    price: "45 000 000 FCFA",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDheccIcyTYGXXim5nmC8Fk2MPt2mzQW7Uls5XD69KBva2pocL4T4FSPoNusTDC9c2WWuZlzSyjHToAqdqliXPGeNHAbpqG8h1G1tnrw9wTJxonJR3btxu8WcyJaMfHTIp9DKz6mwaJouXgGqe-HD2KHzpom-YNzbBds5FyCWSAuNP6sENaiv9ZduNIUynZ0laY0fRQLZt4r6UQDPb65AMxtcUXVKwhniRLchtshuE",
  },
  {
    name: "Modèle F4",
    surface: "120 m² habitables",
    description: "3 chambres • Double séjour • Garage",
    price: "62 000 000 FCFA",
    image: heroImages[1].image,
  },
  {
    name: "Villa Duplex",
    surface: "180 m² habitables",
    description: "4 chambres • R+1 • Terrasse aménageable",
    price: "89 000 000 FCFA",
    image: heroImages[2].image,
  },
];

function Home() {
  const [activeImage, setActiveImage] = useState(0);

  const changeImage = (direction) => {
    setActiveImage((current) =>
      (current + direction + heroImages.length) % heroImages.length
    );
  };

  return (
    <main className="home-page">
      {/* HERO */}
      <section
        className="home-hero"
        id="accueil"
        style={{ backgroundImage: `url(${heroImages[activeImage].image})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-watermark">BIC BTP</div>

        <div className="home-container hero-content">
          <div className="hero-text">
            <span className="hero-label">
              <span className="label-dot"></span>
              Excellence & Innovation Modulaire
            </span>

            <h1>
              Construire votre maison,<span> autrement.</span>
            </h1>

            <p>
              Une méthode industrielle pour la structure,
              un savoir-faire artisanal pour l'intérieur.
            </p>

            <div className="hero-actions">
              <a href="/maisons" className="btn-primary">
                Découvrir nos maisons <span>→</span>
              </a>
              <a href="/methode" className="btn-glass">
                <span className="play-icon">▷</span> Comprendre notre méthode
              </a>
            </div>

            <div className="hero-highlight">
              <span>✓ Structure modulaire prête en 4 semaines</span>
              <strong>100% Garanti</strong>
            </div>
          </div>

          <div className="hero-gallery">
            <div className="gallery-thumbnails">
              {heroImages.map((item, index) => (
                <button
                  key={item.title}
                  className={`gallery-thumb ${activeImage === index ? "active" : ""}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Afficher ${item.title}`}
                >
                  <img src={item.image} alt={item.title} />
                </button>
              ))}
            </div>
            <div className="gallery-controls">
              <button onClick={() => changeImage(-1)} aria-label="Image précédente">←</button>
              <button onClick={() => changeImage(1)} aria-label="Image suivante">→</button>
            </div>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="advantages-section">
        <div className="home-container advantages-grid">
          {advantages.map((item) => (
            <article className="advantage-card" key={item.title}>
              <div className="advantage-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* NOTRE APPROCHE */}
      <section className="approach-section" id="methode">
        <div className="home-container approach-grid">
          <div className="approach-image">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzPBIW-SSJIoMUFjWhnNGphP7d8JIT4Lz6Uo6dOUyUzwaWEErCsHfC5eNpNfffAyxRdoOJ248O1vyYvkhBhmJC9ZNdZBqhEk8zbxnktvxe-jly7jugwefuTG_0nzGDknDwB3KXn1CZ1e3jUWSN4fGBJh9bAtUJxbs-XHl89y7jVSoSM77MjFnUFdvzQ68-zOv-7nigMndHhmAhwvS5C5rXdCxYgdOeC87n6RaNXeg"
              alt="Structure en béton préfabriqué sur un chantier"
            />
            <span className="image-tag">Procédé maîtrisé</span>
            <div className="image-caption">
              Construction industrialisée
              <strong>Norme BAEL</strong>
            </div>
          </div>

          <div className="approach-content">
            <span className="section-label">NOTRE MÉTHODE</span>
            <h2>Une approche unique pour un résultat durable</h2>
            <p>
              Des moules préfabriqués et des plans standards pour une
              construction rapide, solide et maîtrisée. Nous éliminons
              les aléas de chantier pour vous garantir un niveau de
              qualité constant et des coûts prévisibles.
            </p>
            <ul className="approach-list">
              <li><span>✓</span> Précision millimétrique des composants structurels</li>
              <li><span>✓</span> Économie de temps jusqu'à 50% par rapport au gros œuvre traditionnel</li>
              <li><span>✓</span> Isolation thermique et acoustique renforcée</li>
            </ul>
            <a href="/methode" className="text-link">
              En savoir plus <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* NOS MAISONS */}
      <section className="houses-section" id="maisons">
        <div className="home-container">
          <div className="section-heading">
            <div>
              <span className="section-label">CATALOGUE MODÈLES</span>
              <h2>Nos maisons, pour tous vos projets</h2>
              <p>F3, F4, Duplex... des modèles adaptés à vos besoins et évolutifs selon vos envies.</p>
            </div>
            <a href="/maisons" className="btn-dark">
              Voir tout le catalogue <span>→</span>
            </a>
          </div>

          <div className="houses-grid">
            {houses.map((house) => (
              <article className="house-card" key={house.name}>
                <div className="house-image">
                  <img src={house.image} alt={house.name} />
                  <span>{house.surface}</span>
                </div>
                <div className="house-info">
                  <h3>{house.name}</h3>
                  <p>{house.description}</p>
                  <div className="house-price">
                    <div>
                      <small>À PARTIR DE</small>
                      <strong>{house.price}</strong>
                    </div>
                    <a href="/contact" aria-label={`Demander un devis pour ${house.name}`}>→</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BANNIÈRE DE DEVIS */}
      <section className="quote-section" id="devis">
        <div className="home-container">
          <div className="quote-banner">
            <div className="quote-text">
              <h2>Avec BIC BTP, construisez l'avenir en toute confiance.</h2>
              <a href="/contact" className="btn-primary">
                Demander un devis <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;