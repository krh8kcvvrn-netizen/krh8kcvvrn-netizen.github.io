export const org = {
  name: "HopeBridge",
  line: "We provide healthcare, food, education, and shelter.",
};

export const contact = {
  email: "",
  phone: "",
  address: "",
};

export const presets = [15, 25, 50, 100, 250];

export const wallets = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin",
    address: "",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum",
    address: "",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    network: "Ethereum (ERC-20)",
    address: "",
  },
];

export const whoWeHelp = [
  {
    title: "Gaza",
    text: "Healthcare, food, education, and shelter for people in Gaza when daily life has stopped.",
    image: "/images/who-gaza.jpg",
    imageAlt: "A family walking along a street of flat-roofed homes in Gaza, carrying flatbread.",
    imageWidth: 1152,
    imageHeight: 864,
  },
  {
    title: "Ukraine",
    text: "Medical care, meals, a classroom, and a place to sleep for people in Ukraine.",
    image: "/images/who-ukraine.jpg",
    imageAlt: "A woman and child in winter coats walking beside a brick apartment building, carrying bread.",
    imageWidth: 1152,
    imageHeight: 864,
  },
  {
    title: "Africa",
    text: "Clinics, meals, schools, and shelter for communities in Africa that are still without them.",
    image: "/images/who-africa.jpg",
    imageAlt: "Neighbors gathered outside a small clinic with a metal roof.",
    imageWidth: 1152,
    imageHeight: 864,
  },
  {
    title: "Homeless communities worldwide",
    text: "A bed, a meal, and care for people without a home, in any country.",
    image: "/images/who-homeless.jpg",
    imageAlt: "A volunteer handing a bowl of soup to a guest in a shelter dining room, with a folded blanket beside them.",
    imageWidth: 1152,
    imageHeight: 864,
  },
];

export const impactStats = [
  { value: "2,400", label: "People helped" },
  { value: "18,000", label: "Meals provided" },
  { value: "$75,000", label: "Funds raised" },
];

export const stories = [
  {
    region: "Gaza",
    name: "Amal",
    text: "Amal received a clinic visit and went home with medicine and a week of food.",
  },
  {
    region: "Ukraine",
    name: "Olena",
    text: "Olena received meals and a blanket while the usual shops nearby were closed.",
  },
  {
    region: "Africa",
    name: "Kwame",
    text: "A classroom and a clinic room opened where Kwame lives, so the community has a school and basic care.",
  },
  {
    region: "Homeless communities",
    name: "Jordan",
    text: "Jordan had a bed for the night and a meal, instead of sleeping outside.",
  },
];

export const steps = [
  {
    n: "01",
    title: "Choose the work",
    text: "Healthcare, food, education, or shelter.",
  },
  {
    n: "02",
    title: "Choose the dollars",
    text: "The amount is shown in US dollars so the gift has a clear value.",
  },
  {
    n: "03",
    title: "Send crypto",
    text: "You send Bitcoin or USDT from your own wallet to the address on the page.",
  },
  {
    n: "04",
    title: "Keep the reference",
    text: "Paste the transaction id if you have it. The receipt stays on this device.",
  },
];

export const ladder = [
  { amount: 15, text: "Food for one person for a week." },
  { amount: 25, text: "One night of shelter and a meal." },
  { amount: 50, text: "A larger parcel of food, water, and a blanket." },
  { amount: 100, text: "A share of a classroom being built." },
  { amount: 250, text: "A share of a clinic room." },
];

export const faqs = [
  {
    q: "How do I donate?",
    a: "Choose an amount in US dollars, then Bitcoin or USDT. Copy the address and send the crypto from your own wallet. This site does not take a card and does not hold the coins.",
  },
  {
    q: "Which coins can I send?",
    a: "Bitcoin on the Bitcoin network, and Tether (USDT) as an ERC-20 token on Ethereum. Sending a coin on the wrong network can lose it.",
  },
  {
    q: "Where do I put the organization's wallet addresses?",
    a: "The addresses are shown on the donate page once HopeBridge has published them. Do not send crypto to a blank address.",
  },
  {
    q: "Does the dollar amount convert itself?",
    a: "The page shows the gift in dollars. Your wallet shows what that is worth in the coin you chose at the moment you send.",
  },
  {
    q: "Where do the totals on this site come from?",
    a: "The totals on the Impact page are the amounts HopeBridge has recorded. A note saved on your device is not the same as the transfer from your wallet.",
  },
];

export const ourWorkClose = "The work covers a clinic visit, a food parcel, clean water, a roof, a class, a harvest, and a private place to ask for protection.";

export const ourWorkAreas = [
  {
    slug: "healthcare",
    title: "Healthcare",
    headline: "Medical care when war or distance has closed the hospital",
    summary: "HopeBridge opens clinics and sends mobile teams to villages and displacement camps in Africa and in places at war. Doctors and nurses treat injury, fever, malaria, pregnancy, and long-term illness, with medicines and clean supplies on hand. When a local hospital is damaged, the work supports that building so care can continue, including a quiet room for people carrying the strain of what they have lived through.",
    example: "A pregnant woman in a camp is examined, helped through delivery, and seen again with her newborn before she returns to her shelter.",
    image: "/images/work-healthcare.jpg",
    imageAlt: "A doctor using a stethoscope while an adult patient sits on an exam table in a clinic.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "The clinic is a working room. Supplies are on the shelf before the first patient sits down.",
      "Care includes the illness that spreads when people are crowded and far from a hospital, and a follow-up visit when one conversation is not enough.",
    ],
  },
  {
    slug: "food",
    title: "Food and nutrition",
    headline: "A household parcel, and extra care when a child is malnourished",
    summary: "In a hunger crisis, HopeBridge runs an orderly distribution of rice, flour, oil, beans, and drinking water. Children who are malnourished are screened and given therapeutic food, and a school can serve a meal so pupils are able to stay for the lesson. The same response is used in poor communities in Africa and wherever war has emptied the market.",
    example: "A family leaves with a parcel for the week, and a child who is too thin is enrolled in a feeding program the same day.",
    image: "/images/work-food.jpg",
    imageAlt: "Aid workers handing bags of rice and bread to people waiting in a food distribution line.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "People know where to stand and what they will receive. The line is supervised so older people and people with disabilities are served without a scramble.",
      "A parcel is staple food the household can cook. Therapeutic food is a separate step, for a child whose weight shows the hunger has already done harm.",
    ],
  },
  {
    slug: "water",
    title: "Water and hygiene",
    headline: "Safe water to drink, and a clean place to wash",
    summary: "HopeBridge repairs wells, fits hand pumps, and trucks water when a camp has none. Latrines are built and maintained, and families receive soap and a clean container so water stays safe after it is carried home. The work is for villages in Africa that have never had a reliable pump, and for people displaced by war who are living without a tap.",
    example: "A household that walked to a dirty source fills jerry cans at a community pump and uses the soap that came with the container.",
    image: "/images/work-water.jpg",
    imageAlt: "Adults filling jerry cans with drinking water at a village hand pump.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "A pump is placed where the people who collect water can reach it, and it is repaired when it fails.",
      "Soap, a covered container, and a latrine that is emptied are what keep the water from making people ill after they leave the pump.",
    ],
  },
  {
    slug: "shelter",
    title: "Shelter",
    headline: "A roof and a blanket, with the family kept together",
    summary: "When war forces people from their homes, HopeBridge provides a tent or a room, sleeping mats, blankets, and a basic cooking kit. Families are not split up to receive it. Where a damaged house can be made weatherproof, materials are given so people can close one room and move out of the open.",
    example: "A family arriving with nothing is shown to a shelter with mats and blankets, and they cook the evening meal with the pot that came in the kit.",
    image: "/images/work-shelter.jpg",
    imageAlt: "A parent and two children sitting together on beds with blankets in a shelter room.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "The shelter is ready before the family arrives: a roof, a mat, and a blanket.",
      "People are received as guests. A household stays in one place, and the kit includes what they need to cook and to sleep.",
    ],
  },
  {
    slug: "education",
    title: "Education",
    headline: "A classroom that stays open in poverty and in war",
    summary: "In poor communities in Africa, HopeBridge finishes classrooms with walls, a roof, desks, and materials so a teacher can hold a full day of lessons. Where war has shut schools, classes restart in a safe room, with catch-up lessons for children who missed months. Girls and boys are both enrolled, and a school meal is added when hunger is what keeps them away.",
    example: "Children who had been out of school for a term sit at desks again, with books, while a teacher takes the class through reading and numbers.",
    image: "/images/work-education.jpg",
    imageAlt: "A teacher standing beside students seated at wooden desks in a classroom.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "The room has to be safe and dry before a lesson can be the point of the day.",
      "Catch-up classes are for pupils who lost months of school. The aim is that they rejoin a regular class, not that they stay in a temporary one forever.",
    ],
  },
  {
    slug: "livelihoods",
    title: "Livelihoods",
    headline: "Seed, tools, and a skill so next season is not another emergency",
    summary: "After the emergency parcel, HopeBridge helps poor households in Africa grow food again with seed, tools, and practical advice on storing the harvest. People who lost their work because of war can join a short skills course, such as repair or food processing, so income is not only a one-time handout. The aim is a harvest or a wage the household controls.",
    example: "A farmer who ate the seed stock in a hungry year receives seed and a hoe in time to plant, and keeps part of the harvest to feed the family.",
    image: "/images/work-livelihoods.jpg",
    imageAlt: "Two farmers planting seed with hand hoes in a green field.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "Seed arrives before the planting window, not after it has closed.",
      "A skill course is short and practical. It is meant to produce work the person can continue when the course ends.",
    ],
  },
  {
    slug: "protection",
    title: "Protection",
    headline: "A private place to report harm and to look for a missing relative",
    summary: "War and displacement put children, women, and older people at greater risk. HopeBridge offers a private room where a person can speak to a trained worker, be referred for medical care after an assault, and get help with papers and family tracing. Nobody is asked to tell their story in public. The service is there in camps and in poor communities where there is nowhere else to go.",
    example: "A parent who cannot find a child registers the separation and starts a search, while the child is looked after in a supervised space.",
    image: "/images/work-protection.jpg",
    imageAlt: "An adult caseworker speaking quietly with an adult woman across a table in a plain room.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "The conversation is private. Notes stay with the worker who is responsible for that case.",
      "Family tracing starts with a careful description and a search through the places children are being looked after. A child is not left to wait alone.",
    ],
  },
];

export const campaigns = [
  {
    slug: "healthcare",
    title: "Healthcare",
    headline: "Medical care when war or distance has closed the hospital",
    need: "Healthcare",
    location: "Poor communities in Africa and people affected by war",
    summary: "HopeBridge opens clinics and sends mobile teams to villages and displacement camps in Africa and in places at war. Doctors and nurses treat injury, fever, malaria, pregnancy, and long-term illness, with medicines and clean supplies on hand. When a local hospital is damaged, the work supports that building so care can continue, including a quiet room for people carrying the strain of what they have lived through.",
    example: "A pregnant woman in a camp is examined, helped through delivery, and seen again with her newborn before she returns to her shelter.",
    unit: 250,
    unitNoun: "share of a clinic room",
    unitNounPlural: "shares of a clinic room",
    goal: 40000,
    raised: 0,
    image: "/images/work-healthcare.jpg",
    imageAlt: "A doctor using a stethoscope while an adult patient sits on an exam table in a clinic.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "The clinic is a working room. Supplies are on the shelf before the first patient sits down.",
      "Care includes the illness that spreads when people are crowded and far from a hospital, and a follow-up visit when one conversation is not enough.",
    ],
  },
  {
    slug: "food",
    title: "Food and nutrition",
    headline: "A household parcel, and extra care when a child is malnourished",
    need: "Food",
    location: "Poor communities in Africa and people affected by war",
    summary: "In a hunger crisis, HopeBridge runs an orderly distribution of rice, flour, oil, beans, and drinking water. Children who are malnourished are screened and given therapeutic food, and a school can serve a meal so pupils are able to stay for the lesson. The same response is used in poor communities in Africa and wherever war has emptied the market.",
    example: "A family leaves with a parcel for the week, and a child who is too thin is enrolled in a feeding program the same day.",
    unit: 15,
    unitNoun: "week of food for one person",
    unitNounPlural: "weeks of food",
    goal: 20000,
    raised: 0,
    image: "/images/work-food.jpg",
    imageAlt: "Aid workers handing bags of rice and bread to people waiting in a food distribution line.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "People know where to stand and what they will receive. The line is supervised so older people and people with disabilities are served without a scramble.",
      "A parcel is staple food the household can cook. Therapeutic food is a separate step, for a child whose weight shows the hunger has already done harm.",
    ],
  },
  {
    slug: "education",
    title: "Education",
    headline: "A classroom that stays open in poverty and in war",
    need: "Education",
    location: "Poor communities in Africa and people affected by war",
    summary: "In poor communities in Africa, HopeBridge finishes classrooms with walls, a roof, desks, and materials so a teacher can hold a full day of lessons. Where war has shut schools, classes restart in a safe room, with catch-up lessons for children who missed months. Girls and boys are both enrolled, and a school meal is added when hunger is what keeps them away.",
    example: "Children who had been out of school for a term sit at desks again, with books, while a teacher takes the class through reading and numbers.",
    unit: 100,
    unitNoun: "share of a classroom",
    unitNounPlural: "shares of a classroom",
    goal: 50000,
    raised: 0,
    image: "/images/work-education.jpg",
    imageAlt: "A teacher standing beside students seated at wooden desks in a classroom.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "The room has to be safe and dry before a lesson can be the point of the day.",
      "Catch-up classes are for pupils who lost months of school. The aim is that they rejoin a regular class, not that they stay in a temporary one forever.",
    ],
  },
  {
    slug: "shelter",
    title: "Shelter",
    headline: "A roof and a blanket, with the family kept together",
    need: "Shelter",
    location: "People displaced by war",
    summary: "When war forces people from their homes, HopeBridge provides a tent or a room, sleeping mats, blankets, and a basic cooking kit. Families are not split up to receive it. Where a damaged house can be made weatherproof, materials are given so people can close one room and move out of the open.",
    example: "A family arriving with nothing is shown to a shelter with mats and blankets, and they cook the evening meal with the pot that came in the kit.",
    unit: 25,
    unitNoun: "night of shelter and a meal",
    unitNounPlural: "nights of shelter and a meal",
    goal: 25000,
    raised: 0,
    image: "/images/work-shelter.jpg",
    imageAlt: "A parent and two children sitting together on beds with blankets in a shelter room.",
    imageWidth: 1248,
    imageHeight: 832,
    story: [
      "The shelter is ready before the family arrives: a roof, a mat, and a blanket.",
      "People are received as guests. A household stays in one place, and the kit includes what they need to cook and to sleep.",
    ],
  },
];

export function findCampaign(slug) {
  return campaigns.find((campaign) => campaign.slug === slug) || null;
}

export function findWork(slug) {
  return ourWorkAreas.find((area) => area.slug === slug) || null;
}

export function findWallet(id) {
  return wallets.find((wallet) => wallet.id === id) || null;
}
