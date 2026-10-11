import { Link, useParams } from "react-router-dom";
import { findWork, ourWorkAreas } from "../data";
import { applyWorkAreas } from "../lib/content";
import { usePublishedContent } from "../lib/usePublishedContent";
import { useTitle } from "../useTitle";

export default function Campaign() {
  const { slug } = useParams();
  const content = usePublishedContent();
  const work = applyWorkAreas(ourWorkAreas, content);
  const campaign = work.find((item) => item.slug === slug) || findWork(slug);
  useTitle(campaign ? campaign.title : "Our work");

  if (!campaign) {
    return (
      <section className="wrap page-intro">
        <p className="kicker">Our work</p>
        <h1>That page is not part of our work.</h1>
        <Link className="btn" to="/our-work">See our work</Link>
      </section>
    );
  }

  const others = work.filter((item) => item.slug !== campaign.slug);

  return (
    <article className="wrap page">
      <p className="kicker">
        <Link to="/our-work">Our Work</Link> / {campaign.title}
      </p>
      <header className="page-intro tight">
        <h1>{campaign.headline}</h1>
        <p className="lede slim">{campaign.summary}</p>
      </header>
      <img
        className="feature"
        src={campaign.image}
        alt={campaign.imageAlt}
        width={campaign.imageWidth}
        height={campaign.imageHeight}
      />
      <p className="story">{campaign.example}</p>
      {campaign.story.map((paragraph) => (
        <p key={paragraph} className="story">{paragraph}</p>
      ))}
      <section className="section">
        <div className="section-head">
          <p className="kicker">Also</p>
          <h2>Other work</h2>
        </div>
        <ul className="also">
          {others.map((item) => (
            <li key={item.slug}>
              <Link to={`/our-work/${item.slug}`}>
                <span>{item.title}</span>
                <strong>{item.headline}</strong>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
