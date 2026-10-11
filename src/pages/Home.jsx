import { ourWorkAreas, ourWorkClose, whoWeHelp } from "../data";
import CampaignCard from "../components/CampaignCard";
import DonateForm from "../components/DonateForm";
import { applyWorkAreas } from "../lib/content";
import { usePublishedContent } from "../lib/usePublishedContent";
import { useTitle } from "../useTitle";

export default function Home() {
  useTitle("");
  const content = usePublishedContent();
  const work = applyWorkAreas(ourWorkAreas, content);

  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="hero-mark" aria-hidden="true"><span /><span /></div>
          <h1>{content.heroHeadline}</h1>
          <p className="lede">{content.heroSubtext}</p>
          <div className="hero-actions">
            <a className="btn" href="#donate">Donate</a>
          </div>
        </div>
      </section>

      <section className="wash sand" aria-labelledby="who-we-help">
        <div className="wrap section">
        <div className="section-head">
          <p className="kicker">Who we help</p>
          <h2 id="who-we-help">Who We Help</h2>
        </div>
        <div className="help-cards">
          {content.whoWeHelp.map((group) => {
            const photo = whoWeHelp.find((item) => item.title === group.title);
            return (
            <article className="help-card" key={group.title}>
              <div className="help-photo">
                <img
                  src={photo.image}
                  alt={photo.imageAlt}
                  width={photo.imageWidth}
                  height={photo.imageHeight}
                />
              </div>
              <div className="help-copy">
                <h3>{group.title}</h3>
                <p>{group.text}</p>
              </div>
            </article>
            );
          })}
        </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="our-work">
        <div className="section-head">
          <p className="kicker">Our work</p>
          <h2 id="our-work">Our Work</h2>
        </div>
        <div className="cards">
          {work.map((item) => (
            <CampaignCard key={item.slug} campaign={item} />
          ))}
        </div>
        <p className="work-close">{ourWorkClose}</p>
      </section>

      <section className="wash mist" aria-labelledby="impact">
        <div className="wrap section">
        <div className="section-head">
          <p className="kicker">Impact</p>
          <h2 id="impact">People helped</h2>
        </div>
        <ul className="stats-bar">
          {content.impactStats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
        </div>
      </section>

      <section className="wash sand" id="donate" aria-labelledby="donation">
        <div className="wrap section">
        <div className="section-head">
          <p className="kicker">Donate</p>
          <h2 id="donation">Send Bitcoin or USDT</h2>
        </div>
        <DonateForm />
        </div>
      </section>
    </>
  );
}
