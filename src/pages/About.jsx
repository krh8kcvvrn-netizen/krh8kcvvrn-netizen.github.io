import { Link } from "react-router-dom";
import { org } from "../data";
import { useTitle } from "../useTitle";

export default function About() {
  useTitle("About");

  return (
    <article className="wrap page about-layout">
      <div>
        <header className="page-intro tight">
          <p className="kicker">About</p>
          <h1>About {org.name}</h1>
        </header>
        <p className="story">
          {org.name} helps people in Gaza, Ukraine, and Africa, and people without a home. The work is healthcare, food, education, and shelter.
        </p>
        <p className="story">
          You choose an amount in US dollars and send Bitcoin or USDT from your own wallet. The site does not take a card and does not hold the coins.
        </p>
        <ol className="principles">
          <li>
            <strong>Healthcare.</strong>
            <span>A room and basic supplies so a nurse can see patients.</span>
          </li>
          <li>
            <strong>Food.</strong>
            <span>Staple food and drinking water for people who do not have enough.</span>
          </li>
          <li>
            <strong>Education.</strong>
            <span>Classrooms for communities that have pupils and no finished school.</span>
          </li>
          <li>
            <strong>Shelter.</strong>
            <span>A bed, a blanket, and a meal for someone without a home.</span>
          </li>
        </ol>
        <Link className="btn" to="/donate">Donate</Link>
      </div>
      <figure className="about-photo">
        <img
          src="/images/school.jpg"
          alt="A single-story school building with a metal roof and an empty courtyard."
          width={1248}
          height={832}
        />
        <figcaption>A classroom building for a community that needs a school</figcaption>
      </figure>
    </article>
  );
}
