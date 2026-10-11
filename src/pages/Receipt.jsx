import { Link, useParams } from "react-router-dom";
import { useGifts } from "../gift-context";
import { org } from "../data";
import { formatUsd, formatWhen } from "../lib/money";
import { useTitle } from "../useTitle";

export default function Receipt() {
  const { ref } = useParams();
  const { gifts } = useGifts();
  const gift = gifts.find((item) => item.ref === ref);
  useTitle(gift ? `Receipt ${gift.ref}` : "Receipt");

  if (!gift) {
    return (
      <section className="wrap page-intro">
        <p className="kicker">Receipt</p>
        <h1>No gift with that reference is saved on this device.</h1>
        <p className="lede slim">
          A receipt stays on the device where it was saved.
        </p>
        <Link className="btn" to="/impact">See impact</Link>
      </section>
    );
  }

  return (
    <section className="wrap page">
      <header className="page-intro">
        <p className="kicker">Receipt</p>
        <h1>Gift record saved.</h1>
      </header>
      <article className="slip" aria-labelledby="receipt-ref">
        <p className="kicker">{org.name} gift record</p>
        <p id="receipt-ref" className="ref">{gift.ref}</p>
        <dl>
          <div>
            <dt>Amount</dt>
            <dd>{formatUsd(gift.amount)}{gift.asset ? ` (${gift.asset.toUpperCase()})` : ""}</dd>
          </div>
          {gift.campaignTitle ? (
            <div>
              <dt>Campaign</dt>
              <dd>{gift.campaignTitle}</dd>
            </div>
          ) : null}
          {gift.network ? (
            <div>
              <dt>Network</dt>
              <dd>{gift.network}</dd>
            </div>
          ) : null}
          {gift.address ? (
            <div>
              <dt>Address</dt>
              <dd className="break">{gift.address}</dd>
            </div>
          ) : null}
          {gift.tx ? (
            <div>
              <dt>Transaction</dt>
              <dd className="break">{gift.tx}</dd>
            </div>
          ) : null}
          {gift.name ? (
            <div>
              <dt>Name</dt>
              <dd>{gift.name}</dd>
            </div>
          ) : null}
          {gift.email ? (
            <div>
              <dt>Email</dt>
              <dd>{gift.email}</dd>
            </div>
          ) : null}
          <div>
            <dt>When</dt>
            <dd>{formatWhen(gift.createdAt)}</dd>
          </div>
          {gift.note ? (
            <div>
              <dt>Note</dt>
              <dd>{gift.note}</dd>
            </div>
          ) : null}
        </dl>
        <p className="hint ink">
          This receipt stays on this device. It is not a tax receipt, and no email was sent. The gift moves when you send it from your wallet.
        </p>
      </article>
      <div className="ledger-actions no-print">
        <button className="btn" type="button" onClick={() => window.print()}>Print</button>
        {gift.campaignSlug ? (
          <Link className="btn ghost" to={`/our-work/${gift.campaignSlug}`}>See the work</Link>
        ) : (
          <Link className="btn ghost" to="/impact">See impact</Link>
        )}
        <Link className="text-link" to="/donate">Record another</Link>
      </div>
    </section>
  );
}
