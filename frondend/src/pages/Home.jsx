import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
const apiUrl = import.meta.env.VITE_API_URL;


const heroContent = [
  { text: "Begin Here", img: "/catering_hero.png" },
  { text: "Unfold Tonight", img: "/wedding_catering.png" },
  { text: "Start With Us", img: "/corporate_catering.png" }
];

const features = [
  { icon: "◈", title: "Post Your Event", desc: "Describe your event, guest count, cuisine and let us match you with the best catering crew available." },
  { icon: "◉", title: "Vetted Workers", desc: "Every professional on our platform is admin-approved, experienced, and background-verified." },
  { icon: "◐", title: "Easy Selection", desc: "Browse worker profiles, view their experience, and handpick your ideal team for the event." },
];

const values = [
  { title: "Excellence", desc: "We deliver flawless service, ensuring every detail is perfectly executed." },
  { title: "Integrity", desc: "Transparency and honesty in all our interactions with clients and staff." },
  { title: "Reliability", desc: "Count on our verified professionals to be punctual and prepared." },
  { title: "Innovation", desc: "Modernizing the catering experience through seamless technology." }
];

const services = [
  { title: "Wedding Receptions", desc: "Curated menus and impeccable service for your special day.", img: "/wedding_catering.png" },
  { title: "Corporate Galas", desc: "Professional catering staff for high-profile business events.", img: "/corporate_catering.png" },
  { title: "Private Celebrations", desc: "Intimate gatherings with personalized attention to detail.", img: "/private_party.png" },
  { title: "Large Scale Events", desc: "Experienced crews capable of handling 1000+ guest counts.", img: "/large_event.png" }
];

const faqs = [
  { q: "How do I book a catering team?", a: "Simply register as a customer, post your event details, and wait for verified professionals to apply." },
  { q: "Are all workers verified?", a: "Yes, every worker on GrandFort undergoes a strict background check and admin approval process." },
  { q: "Can I choose specific workers?", a: "Absolutely. Once workers apply to your event, you can review their profiles and select your preferred team." },
  { q: "Is there a minimum guest count?", a: "No, we cater to events of all sizes, from intimate dinners to grand weddings." }
];

const stats = [
  { value: "1,200+", label: "Events Catered" },
  { value: "400+", label: "Verified Workers" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "3", label: "Cities Served" },
];

const reviews = [
  { name: "Aisha R.", role: "Wedding Client", text: "GrandFort completely transformed my wedding. The catering crew was professional and the food was extraordinary.", rating: 5 },
  { name: "Rahul M.", role: "Corporate Event Manager", text: "Seamless process from posting the event to selecting the staff. High quality service every time.", rating: 5 },
  { name: "Priya T.", role: "Birthday Party Host", text: "The workers were on time, extremely polite, and the guests couldn't stop talking about the presentation.", rating: 5 },
];

const Home = ({ user }) => {
  const [currentHero, setCurrentHero] = useState(0);
  const [heroStats, setHeroStats] = useState({
    nextEvent: { title: "Loading...", guests: "-", city: "-", status: "pending" },
    workersApplied: "-",
    todaysEvents: "-"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroContent.length);
    }, 4000);

    const fetchStats = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/events`);
        const events = await res.json();
        
        if (events && events.length > 0) {
          const next = events[events.length - 1];
          const totalWorkersApplied = events.reduce((acc, ev) => acc + (ev.applicants?.length || 0), 0);
          
          setHeroStats({
            nextEvent: { 
              title: next.title || "Event", 
              guests: next.guestCount || 0, 
              city: next.city || "Unknown",
              status: next.status || "pending"
            },
            workersApplied: totalWorkersApplied,
            todaysEvents: events.length
          });
        } else {
           setHeroStats({
            nextEvent: { title: "No Events", guests: "0", city: "N/A", status: "N/A" },
            workersApplied: "0",
            todaysEvents: "0"
          });
        }
      } catch (err) {
        console.error("Failed to fetch events for stats", err);
      }
    };

    fetchStats();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Premium Catering Management</p>
          <h1 className="hero-title">
            Extraordinary Events<br />
            <span key={currentHero} className="fade-in-text">{heroContent[currentHero].text}</span>
          </h1>
          <p className="hero-desc">
            Connect with Kerala's finest catering professionals. Post your event, browse skilled workers,
            and create memories that last a lifetime.
          </p>
          <div className="hero-actions">
            {user ? (
              user.role === "customer" ? (
                <Link className="btn-primary" to="/post-event">Post an Event</Link>
              ) : (
                <Link className="btn-primary" to="/workers">Browse Events</Link>
              )
            ) : (
              <>
                <Link className="btn-primary" to="/register">Get Started</Link>
                <Link className="btn-outline" to="/workers">Meet Our Workers</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <img key={currentHero} src={heroContent[currentHero].img} alt="Elegant Catering" className="hero-img fade-in-img" />
          <div className="hero-card hero-card-1">
            <div className="hc-label">Latest Event</div>
            <div className="hc-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
              {heroStats.nextEvent.title}
            </div>
            <div className="hc-meta">{heroStats.nextEvent.guests} Guests · {heroStats.nextEvent.city}</div>
            {heroStats.nextEvent.status !== "N/A" && (
              <div className={`hc-status ${heroStats.nextEvent.status}`}>{heroStats.nextEvent.status}</div>
            )}
          </div>
          <div className="hero-card hero-card-2">
            <div className="hc-label">Total Applications</div>
            <div className="hc-count">{heroStats.workersApplied}</div>
            <div className="hc-meta">Workers looking for jobs</div>
          </div>
          <div className="hero-card hero-card-3">
            <div className="hc-label">Total Events</div>
            <div className="hc-count">{heroStats.todaysEvents}</div>
            <div className="hc-meta">Events registered</div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="partners-section">
        <p className="partners-label">Trusted by Premium Event Organizers</p>
        <div className="partners-logos">
          <span>Luxe Events</span>
          <span>Grand Gala Co.</span>
          <span>Elite Weddings</span>
          <span>Corporate Connect</span>
          <span>Signature Celebrations</span>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        {stats.map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Our Values */}
      <section className="values-section page-wrapper">
        <p className="section-sub">What Drives Us</p>
        <h2 className="section-title">Our Core <span>Values</span></h2>
        <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>

        <div className="values-grid">
          {values.map((val, i) => (
            <div className="value-card step" key={i}>
              <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="value-content">
                <h3 className="value-title">{val.title}</h3>
                <p className="step-text">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="services-section page-wrapper">
       
        <h2 className="section-title">Events We <span>Elevate</span></h2>
        <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-img-wrapper">
                <img src={s.img} alt={s.title} className="service-img" />
              </div>
              <div className="service-content">
                <div className="service-number">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="page-wrapper">
          <p className="section-sub">What We Offer</p>
          <h2 className="section-title">Everything You <span>Need</span></h2>
          <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section page-wrapper">
        <p className="section-sub">Testimonials</p>
        <h2 className="section-title">What Our <span>Clients</span> Say</h2>
        <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>
        
        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="review-stars">{"★".repeat(r.rating)}</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="author-name">{r.name}</div>
                <div className="author-role">{r.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section page-wrapper">
        <p className="section-sub">Got Questions?</p>
        <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
        <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div className="faq-item" key={i}>
              <h3 className="faq-q">{faq.q}</h3>
              <p className="faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <p className="cta-eyebrow">Ready to Begin?</p>
          <h2 className="cta-title">Your Perfect Event Awaits</h2>
          <div className="cta-actions">
            <Link className="btn-primary" to="/register">Register as Customer</Link>
            <Link className="btn-outline-light" to="/register">Join as Worker</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
