import { Link } from "react-router-dom";

export default function CampaignCard({ campaign }) {
  return (
    <article className="card work-card">
      <Link to={`/our-work/${campaign.slug}`} className="card-media">
        <img
          src={campaign.image}
          alt={campaign.imageAlt}
          width={campaign.imageWidth}
          height={campaign.imageHeight}
        />
      </Link>
      <div className="card-body">
        <p className="kicker">{campaign.title}</p>
        <h3>
          <Link to={`/our-work/${campaign.slug}`}>{campaign.headline}</Link>
        </h3>
        <p>{campaign.summary}</p>
        <p>{campaign.example}</p>
      </div>
    </article>
  );
}
