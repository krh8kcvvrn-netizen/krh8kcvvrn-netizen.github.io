import { ourWorkAreas, ourWorkClose } from "../data";
import CampaignCard from "../components/CampaignCard";
import { applyWorkAreas } from "../lib/content";
import { usePublishedContent } from "../lib/usePublishedContent";
import { useTitle } from "../useTitle";

export default function Campaigns() {
  useTitle("Our Work");
  const content = usePublishedContent();
  const work = applyWorkAreas(ourWorkAreas, content);

  return (
    <section className="wrap page">
      <header className="page-intro">
        <p className="kicker">Our work</p>
        <h1>Our Work</h1>
        <p className="lede slim">
          HopeBridge supports poor communities in Africa and people affected by war, from the first days of a crisis through water, school, and the next harvest.
        </p>
      </header>
      <div className="cards">
        {work.map((item) => (
          <CampaignCard key={item.slug} campaign={item} />
        ))}
      </div>
      <p className="work-close">{ourWorkClose}</p>
    </section>
  );
}
