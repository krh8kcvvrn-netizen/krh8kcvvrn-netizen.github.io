import { campaigns, impactStats, whoWeHelp } from "../data.js";

export const defaultContent = {
  heroHeadline: "Help Where It's Needed Most",
  heroSubtext: "We provide healthcare, food, education, and shelter.",
  whoWeHelp: whoWeHelp.map((item) => ({ title: item.title, text: item.text })),
  ourWork: campaigns.map((item) => ({ slug: item.slug, title: item.title, summary: item.summary })),
  impactStats: impactStats.map((item) => ({ label: item.label, value: item.value })),
  goals: campaigns.map((item) => ({ slug: item.slug, title: item.title, goal: item.goal, raised: item.raised })),
};

export function statNumber(value) {
  const number = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.round(number);
}

export function formatImpactStat(label, number) {
  const text = Math.max(0, Math.round(number)).toLocaleString("en-US");
  return label === "Funds raised" ? `$${text}` : text;
}

export function nextImpactValue(label, currentValue, amount, direction = "increase") {
  const change = Math.max(0, Math.round(Number(amount) || 0));
  const current = statNumber(currentValue);
  const next = direction === "decrease" ? current - change : current + change;
  if (next < 0) return "";
  return formatImpactStat(label, next);
}

function cleanWhole(value) {
  const text = String(value ?? "").replace(/[$,\s]/g, "");
  if (!/^\d+$/.test(text)) return null;
  const number = Number(text);
  if (!Number.isFinite(number) || number > 1000000000000) return null;
  return number;
}

function clip(value, max) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

function listItem(list, match) {
  if (!Array.isArray(list)) return null;
  return list.find(match) || null;
}

export function submittedContent(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  return {
    heroHeadline: clip(source.heroHeadline, 140),
    heroSubtext: clip(source.heroSubtext, 280),
    whoWeHelp: defaultContent.whoWeHelp.map((item) => ({
      title: item.title,
      text: clip(listItem(source.whoWeHelp, (entry) => entry?.title === item.title)?.text, 800),
    })),
    ourWork: defaultContent.ourWork.map((item) => ({
      slug: item.slug,
      title: item.title,
      summary: clip(listItem(source.ourWork, (entry) => entry?.slug === item.slug)?.summary, 800),
    })),
    impactStats: defaultContent.impactStats.map((item) => ({
      label: item.label,
      value: clip(listItem(source.impactStats, (entry) => entry?.label === item.label)?.value, 40),
    })),
    goals: defaultContent.goals.map((item) => {
      const found = listItem(source.goals, (entry) => entry?.slug === item.slug);
      if (!found) return { slug: item.slug, title: item.title, goal: item.goal, raised: item.raised };
      const goal = found.goal == null || found.goal === "" ? 0 : cleanWhole(found.goal);
      const raised = found.raised == null || found.raised === "" ? 0 : cleanWhole(found.raised);
      return {
        slug: item.slug,
        title: item.title,
        goal: goal || 0,
        raised: raised == null ? -1 : raised,
      };
    }),
  };
}

export function contentProblems(content) {
  if (!content.heroHeadline) return "Enter the hero headline.";
  if (!content.heroSubtext) return "Enter the hero subtext.";
  for (const item of content.whoWeHelp) {
    if (!item.text) return `Enter the ${item.title} paragraph.`;
  }
  for (const item of content.ourWork) {
    if (!item.summary) return `Enter the ${item.title} description.`;
  }
  for (const item of content.impactStats) {
    if (!item.value) return `Enter the number for ${item.label}.`;
  }
  for (const item of content.goals) {
    if (!item.goal) return `Enter a target amount for ${item.title}.`;
    if (item.raised < 0) return `Enter the amount raised for ${item.title}.`;
  }
  return "";
}

export function readContent(raw) {
  const submitted = submittedContent(raw || {});
  return {
    heroHeadline: submitted.heroHeadline || defaultContent.heroHeadline,
    heroSubtext: submitted.heroSubtext || defaultContent.heroSubtext,
    whoWeHelp: submitted.whoWeHelp.map((item, index) => ({
      title: item.title,
      text: item.text || defaultContent.whoWeHelp[index].text,
    })),
    ourWork: submitted.ourWork.map((item, index) => ({
      slug: item.slug,
      title: item.title,
      summary: item.summary || defaultContent.ourWork[index].summary,
    })),
    impactStats: submitted.impactStats.map((item, index) => ({
      label: item.label,
      value: item.value || defaultContent.impactStats[index].value,
    })),
    goals: submitted.goals.map((item, index) => ({
      slug: item.slug,
      title: item.title,
      goal: item.goal || defaultContent.goals[index].goal,
      raised: item.raised < 0 ? defaultContent.goals[index].raised : item.raised,
    })),
  };
}

export function applyWorkSummaries(campaigns, content) {
  return campaigns.map((item) => {
    const edited = content.ourWork.find((entry) => entry.slug === item.slug);
    if (!edited || edited.summary === item.summary) return item;
    return { ...item, summary: edited.summary };
  });
}

export function applyWorkAreas(areas, content) {
  return areas.map((area) => {
    const edited = content.ourWork.find((entry) => entry.slug === area.slug);
    if (!edited || edited.summary === area.summary) return area;
    return { ...area, summary: edited.summary };
  });
}
