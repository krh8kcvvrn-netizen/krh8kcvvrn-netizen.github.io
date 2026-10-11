import DonateForm from "../components/DonateForm";
import { useTitle } from "../useTitle";

export default function Donate() {
  useTitle("Donate");

  return (
    <section className="wrap page">
      <header className="page-intro">
        <p className="kicker">Donate</p>
        <h1>Send Bitcoin or USDT</h1>
      </header>
      <DonateForm />
    </section>
  );
}
