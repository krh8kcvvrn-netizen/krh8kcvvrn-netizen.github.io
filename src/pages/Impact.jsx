import { useState } from "react";
import { Link } from "react-router-dom";
import { useCampaigns, useGifts } from "../gift-context";
import { formatUsd, formatWhen } from "../lib/money";
import { usePublishedContent } from "../lib/usePublishedContent";
import { useTitle } from "../useTitle";
import Meter from "../components/Meter";

export default function Impact() {
  useTitle("Impact");
  const { gifts, clearGifts } = useGifts();
  const content = usePublishedContent();
  const campaigns = useCampaigns().map((campaign) => {
    const published = content.goals.find((item) => item.slug === campaign.slug);
    if (!published) return campaign;
    return { ...campaign, goal: published.goal, raisedNow: published.raised };
  });
  const [armed, setArmed] = useState(false);
  const total = gifts.reduce((sum, gift) => sum + Number(gift.amount || 0), 0);
  const showName = gifts.some((gift) => gift.name);
  const showCampaign = gifts.some((gift) => gift.campaignTitle);

  function onClear() {
    if (!armed) {
      setArmed(true);
      return;
    }
    clearGifts();
    setArmed(false);
  }

  return (
    <section className="wrap page">
      <header className="page-intro">
        <p className="kicker">Impact</p>
        <h1>What has been raised</h1>
        <p className="lede slim">
          Each area shows the amount raised and the target. Send Bitcoin or USDT from your own wallet.
        </p>
      </header>

      <ul className="impact-list">
        {campaigns.map((campaign) => (
          <li key={campaign.slug}>
            <h2><Link to={`/our-work/${campaign.slug}`}>{campaign.title}</Link></h2>
            <Meter raised={campaign.raisedNow} goal={campaign.goal} label={campaign.title} />
          </li>
        ))}
      </ul>

      <section className="section">
        <div className="section-head">
          <p className="kicker">Saved on this device</p>
          <h2>{gifts.length ? formatUsd(total) : "No gifts yet"}</h2>
        </div>
        {gifts.length ? (
          <table className="ledger">
            <caption className="sr-only">Gifts saved on this device</caption>
            <thead>
              <tr>
                <th scope="col">Reference</th>
                {showName ? <th scope="col">Name</th> : null}
                {showCampaign ? <th scope="col">Campaign</th> : null}
                <th scope="col">Coin</th>
                <th scope="col">When</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {gifts.map((gift) => (
                <tr key={gift.ref}>
                  <td><Link to={`/receipt/${gift.ref}`}>{gift.ref}</Link></td>
                  {showName ? <td>{gift.name}</td> : null}
                  {showCampaign ? <td>{gift.campaignTitle}</td> : null}
                  <td>{gift.asset ? gift.asset.toUpperCase() : "Not recorded"}</td>
                  <td>{formatWhen(gift.createdAt)}</td>
                  <td>{formatUsd(gift.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No gifts saved on this device yet.</p>
        )}
        <div className="ledger-actions">
          <Link className="btn" to="/donate">Donate in crypto</Link>
          <button className="btn ghost" type="button" onClick={onClear} disabled={!gifts.length && !armed}>
            {armed ? "Confirm clear" : "Clear saved gifts"}
          </button>
          {armed ? (
            <button className="text-btn" type="button" onClick={() => setArmed(false)}>
              Keep them
            </button>
          ) : null}
        </div>
      </section>
    </section>
  );
}
