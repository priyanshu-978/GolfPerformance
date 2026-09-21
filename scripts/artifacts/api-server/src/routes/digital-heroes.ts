import { Router, type IRouter } from "express";
import {
  CreateCharityBody,
  CreateMyScoreBody,
  SimulateDrawBody,
  SubmitWinnerProofBody,
  UpdateMyCharityPreferenceBody,
  UpdateMyScoreBody,
  UpdateWinnerVerificationBody,
} from "@workspace/api-zod";

type Score = {
  id: string;
  score: number;
  score_date: string;
  percentile: number;
  label: string;
};

type Charity = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  logo_url: string | null;
  cover_image_url: string | null;
  website_url: string | null;
  featured: boolean;
  active: boolean;
  impact_stat: string;
  focus: string;
};

const router: IRouter = Router();
const currentUserId = "subscriber-1";

const charities: Charity[] = [
  {
    id: "charity-1",
    name: "BrightPath Learning",
    slug: "brightpath-learning",
    short_description: "Opening doors to digital learning for young people.",
    full_description:
      "BrightPath helps young people in under-resourced communities access mentors, devices, and practical digital skills.",
    logo_url: null,
    cover_image_url: null,
    website_url: "https://example.org/brightpath",
    featured: true,
    active: true,
    impact_stat: "1,840 learning hours funded",
    focus: "Education",
  },
  {
    id: "charity-2",
    name: "Coastline Keepers",
    slug: "coastline-keepers",
    short_description: "Restoring coastlines through local action and science.",
    full_description:
      "Coastline Keepers equips local volunteers to restore habitats, monitor marine life, and protect the places communities call home.",
    logo_url: null,
    cover_image_url: null,
    website_url: "https://example.org/coastline",
    featured: false,
    active: true,
    impact_stat: "420kg of shoreline waste removed",
    focus: "Environment",
  },
  {
    id: "charity-3",
    name: "Open Door Health",
    slug: "open-door-health",
    short_description: "Making preventative care easier to reach.",
    full_description:
      "Open Door Health brings preventative screenings and community health education to neighborhoods that need it most.",
    logo_url: null,
    cover_image_url: null,
    website_url: "https://example.org/open-door",
    featured: false,
    active: true,
    impact_stat: "612 community check-ins",
    focus: "Health",
  },
  {
    id: "charity-4",
    name: "Second Serve",
    slug: "second-serve",
    short_description: "Turning surplus meals into shared moments.",
    full_description:
      "Second Serve connects surplus food with neighborhood kitchens so fewer good meals go to waste.",
    logo_url: null,
    cover_image_url: null,
    website_url: "https://example.org/second-serve",
    featured: false,
    active: true,
    impact_stat: "2,340 meals redirected",
    focus: "Food security",
  },
  {
    id: "charity-5",
    name: "Future Makers",
    slug: "future-makers",
    short_description: "Helping first-generation founders build what is next.",
    full_description:
      "Future Makers gives first-generation founders access to peer support, training, and small grants for early ideas.",
    logo_url: null,
    cover_image_url: null,
    website_url: "https://example.org/future-makers",
    featured: false,
    active: true,
    impact_stat: "38 ideas moved forward",
    focus: "Opportunity",
  },
  {
    id: "charity-6",
    name: "Haven for Animals",
    slug: "haven-for-animals",
    short_description: "A safer next chapter for animals in transition.",
    full_description:
      "Haven for Animals supports foster networks and responsible rehoming for animals that need a safe place to land.",
    logo_url: null,
    cover_image_url: null,
    website_url: "https://example.org/haven",
    featured: false,
    active: true,
    impact_stat: "91 safe placements",
    focus: "Animal welfare",
  },
];

const scoresByUser = new Map<string, Score[]>([
  [
    currentUserId,
    [
      { id: "score-1", score: 37, score_date: "2026-09-18", percentile: 82, label: "Excellent" },
      { id: "score-2", score: 34, score_date: "2026-09-09", percentile: 72, label: "Strong round" },
      { id: "score-3", score: 31, score_date: "2026-08-28", percentile: 63, label: "On the rise" },
      { id: "score-4", score: 29, score_date: "2026-08-16", percentile: 56, label: "Solid" },
      { id: "score-5", score: 26, score_date: "2026-07-31", percentile: 48, label: "Building" },
    ],
  ],
]);

const users = Array.from({ length: 12 }, (_, index) => ({
  id: index === 0 ? currentUserId : `subscriber-${index + 1}`,
  name: index === 0 ? "Alex Morgan" : ["Maya Chen", "Samir Patel", "Jordan Bell", "Priya Nair", "Theo Woods", "Noah Davis", "Elena Rossi", "Kai Brooks", "Amara Singh", "Leo Martin", "Sofia Lane"][index - 1],
  email: index === 0 ? "alex.morgan@example.com" : `member${index + 1}@digitalheroes.demo`,
  plan: index % 3 === 0 ? "Yearly" : "Monthly",
  status: "Active",
  joined: `${String((index % 7) + 1).padStart(2, "0")} ${["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][index % 7]} 2026`,
  scores: scoresByUser.get(index === 0 ? currentUserId : `subscriber-${index + 1}`)?.length ?? 3,
}));

const draws = [
  { id: "draw-current", label: "October 2026", status: "Upcoming", draw_date: "2026-10-31", jackpot: 18420, entry_count: 1284, numbers: [] as number[], draw_type: "random", distributed: 0, rollover: 12400 },
  { id: "draw-sep", label: "September 2026", status: "Published", draw_date: "2026-09-30", jackpot: 12400, entry_count: 1180, numbers: [7, 14, 22, 31, 42], draw_type: "algorithmic", distributed: 9280, rollover: 12400 },
  { id: "draw-aug", label: "August 2026", status: "Completed", draw_date: "2026-08-31", jackpot: 9600, entry_count: 1108, numbers: [4, 12, 18, 29, 44], draw_type: "random", distributed: 9600, rollover: 0 },
  { id: "draw-jul", label: "July 2026", status: "Completed", draw_date: "2026-07-31", jackpot: 8800, entry_count: 1022, numbers: [3, 17, 23, 36, 41], draw_type: "random", distributed: 8800, rollover: 0 },
];

const winners = [
  {
    id: "winner-1",
    draw_label: "September 2026",
    match_type: "4-number match",
    prize_amount: 5240,
    verification_status: "pending",
    payout_status: "pending",
    proof_url: null as string | null,
    matched_numbers: [7, 14, 22, 31],
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
  },
  {
    id: "winner-2",
    draw_label: "August 2026",
    match_type: "3-number match",
    prize_amount: 118,
    verification_status: "approved",
    payout_status: "paid",
    proof_url: "demo/proof-august.png",
    matched_numbers: [4, 12, 29],
    user_name: "Maya Chen",
    user_email: "member2@digitalheroes.demo",
  },
  {
    id: "winner-3",
    draw_label: "July 2026",
    match_type: "3-number match",
    prize_amount: 142,
    verification_status: "approved",
    payout_status: "paid",
    proof_url: "demo/proof-july.png",
    matched_numbers: [3, 17, 41],
    user_name: "Samir Patel",
    user_email: "member3@digitalheroes.demo",
  },
];

let selectedCharityId = "charity-1";
let contributionPercentage = 18;
let scoreSequence = 6;
let charitySequence = 7;
let lastSimulation: ReturnType<typeof buildSimulation> | null = null;

function scoreLabel(score: number) {
  if (score >= 36) return "Excellent";
  if (score >= 32) return "Strong round";
  if (score >= 28) return "On the rise";
  if (score >= 24) return "Solid";
  return "Building";
}

function scorePercentile(score: number) {
  return Math.min(99, Math.max(22, Math.round(score * 2.15 + 2)));
}

function currentScores() {
  return scoresByUser.get(currentUserId) ?? [];
}

function drawSummaries() {
  return draws.map(({ draw_type: _drawType, distributed: _distributed, rollover: _rollover, ...draw }) => draw);
}

function getCharity(id: string) {
  return charities.find((charity) => charity.id === id) ?? charities[0];
}

function hashSeed(seed: string) {
  return Array.from(seed).reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) % 2147483647, 17);
}

function buildSimulation(input: { draw_type: string; prize_contribution: number; seed: string }) {
  const generator = hashSeed(input.seed);
  const generated = new Set<number>();
  let cursor = generator;
  while (generated.size < 5) {
    cursor = (cursor * 48271) % 2147483647;
    generated.add((cursor % 45) + 1);
  }
  const generatedNumbers = [...generated].sort((a, b) => a - b);
  const participantCount = users.filter((user) => user.status === "Active").length;
  const pool = participantCount * input.prize_contribution;
  const tiers = [
    { match_type: "5-number match", percentage: 40 },
    { match_type: "4-number match", percentage: 35 },
    { match_type: "3-number match", percentage: 25 },
  ];
  const simulatedWinners = [
    {
      id: "simulation-winner-4",
      draw_label: "Simulation",
      match_type: "4-number match",
      prize_amount: Math.round((pool * 0.35) * 100) / 100,
      verification_status: "pending",
      payout_status: "pending",
      proof_url: null,
      matched_numbers: generatedNumbers.slice(0, 4),
    },
  ];
  const allocation = tiers.map((tier) => {
    const tierPool = Math.round(pool * (tier.percentage / 100) * 100) / 100;
    const winnerCount = tier.match_type === "4-number match" ? 1 : 0;
    return {
      ...tier,
      pool: tierPool,
      winners: winnerCount,
      per_winner: winnerCount ? tierPool : 0,
    };
  });
  return {
    generated_numbers: generatedNumbers,
    participant_count: participantCount,
    winners: simulatedWinners,
    allocation,
    rollover: Math.round(pool * 0.4 * 100) / 100,
    total_distributed: Math.round(pool * 0.6 * 100) / 100,
    draw_type: input.draw_type,
  };
}

router.get("/overview", (_req, res) => {
  res.json({
    active_subscribers: 1284,
    prize_pool: 18420,
    charity_total: 68420,
    featured_charity: charities[0],
    plans: [
      { id: "monthly", name: "Monthly", interval: "month", price: 12, charity_default: 10, savings: "" },
      { id: "yearly", name: "Yearly", interval: "year", price: 108, charity_default: 10, savings: "Save 25%" },
    ],
    recent_impact: [
      { label: "May", value: 49200 },
      { label: "Jun", value: 54800 },
      { label: "Jul", value: 59600 },
      { label: "Aug", value: 64200 },
      { label: "Sep", value: 68420 },
    ],
  });
});

router.get("/charities", (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.toLowerCase() : "";
  const featured = req.query.featured === "true";
  res.json(charities.filter((charity) => charity.active && (!search || `${charity.name} ${charity.focus}`.toLowerCase().includes(search)) && (!featured || charity.featured)));
});

router.get("/charities/:slug", (req, res) => {
  const charity = charities.find((item) => item.slug === req.params.slug);
  if (!charity) return res.status(404).json({ error: "Charity not found" });
  return res.json({
    ...charity,
    events: [
      { id: "event-1", title: "Community action day", description: "A volunteer day for local supporters.", event_date: "2026-10-12", location: "Bristol", image_url: null },
      { id: "event-2", title: "Impact briefing", description: "A transparent look at the next quarter.", event_date: "2026-11-03", location: "Online", image_url: null },
    ],
  });
});

router.get("/me/dashboard", (_req, res) => {
  const scores = currentScores();
  const average = scores.length ? Math.round((scores.reduce((sum, item) => sum + item.score, 0) / scores.length) * 10) / 10 : 0;
  res.json({
    profile: { id: currentUserId, full_name: "Alex Morgan", email: "alex.morgan@example.com", role: "subscriber" },
    subscription: { status: "Active", plan: "Yearly", renewal_date: "2027-03-14", amount: 108, interval: "year" },
    score_summary: { average, best: Math.max(...scores.map((item) => item.score), 0), trend: "+12% vs last month", scores },
    charity_preference: { charity: getCharity(selectedCharityId), contribution_percentage: contributionPercentage },
    draws: drawSummaries(),
    winners: winners.filter((winner) => winner.user_email === "alex.morgan@example.com"),
  });
});

router.get("/me/scores", (_req, res) => res.json(currentScores()));

router.post("/me/scores", (req, res) => {
  const parsed = CreateMyScoreBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter a score from 1 to 45 and a valid date." });
  const scoreDate = parsed.data.score_date instanceof Date ? parsed.data.score_date.toISOString().slice(0, 10) : parsed.data.score_date;
  const scores = currentScores();
  if (scores.some((score) => score.score_date === scoreDate)) return res.status(400).json({ error: "You already have a score for that date." });
  const score: Score = {
    id: `score-${scoreSequence++}`,
    score: parsed.data.score,
    score_date: scoreDate,
    percentile: scorePercentile(parsed.data.score),
    label: scoreLabel(parsed.data.score),
  };
  scores.unshift(score);
  scoresByUser.set(currentUserId, scores.sort((a, b) => b.score_date.localeCompare(a.score_date)).slice(0, 5));
  return res.status(201).json(score);
});

router.patch("/me/scores/:id", (req, res) => {
  const parsed = UpdateMyScoreBody.safeParse(req.body);
  const scores = currentScores();
  const target = scores.find((score) => score.id === req.params.id);
  if (!target) return res.status(404).json({ error: "Score not found." });
  if (!parsed.success) return res.status(400).json({ error: "Enter a score from 1 to 45 and a valid date." });
  const scoreDate = parsed.data.score_date instanceof Date ? parsed.data.score_date.toISOString().slice(0, 10) : parsed.data.score_date;
  if (scores.some((score) => score.id !== target.id && score.score_date === scoreDate)) return res.status(400).json({ error: "You already have a score for that date." });
  Object.assign(target, { score: parsed.data.score, score_date: scoreDate, percentile: scorePercentile(parsed.data.score), label: scoreLabel(parsed.data.score) });
  return res.json(target);
});

router.delete("/me/scores/:id", (req, res) => {
  scoresByUser.set(currentUserId, currentScores().filter((score) => score.id !== req.params.id));
  res.status(204).send();
});

router.get("/me/charity", (_req, res) => res.json({ charity: getCharity(selectedCharityId), contribution_percentage: contributionPercentage }));

router.put("/me/charity", (req, res) => {
  const parsed = UpdateMyCharityPreferenceBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose a charity and contribute at least 10%." });
  if (!charities.some((charity) => charity.id === parsed.data.charity_id)) return res.status(400).json({ error: "Choose an active charity." });
  selectedCharityId = parsed.data.charity_id;
  contributionPercentage = parsed.data.contribution_percentage;
  return res.json({ charity: getCharity(selectedCharityId), contribution_percentage: contributionPercentage });
});

router.get("/me/draws", (_req, res) => res.json(drawSummaries()));
router.get("/me/winners", (_req, res) => res.json(winners.filter((winner) => winner.user_email === "alex.morgan@example.com")));

router.post("/me/winners/:id/proof", (req, res) => {
  const parsed = SubmitWinnerProofBody.safeParse(req.body);
  const winner = winners.find((item) => item.id === req.params.id);
  if (!winner) return res.status(404).json({ error: "Winner not found." });
  if (!parsed.success) return res.status(400).json({ error: "Upload a valid proof file." });
  winner.proof_url = `demo/${parsed.data.file_name}`;
  winner.verification_status = "pending";
  return res.json(winner);
});

router.get("/admin/overview", (_req, res) => res.json({
  total_users: 1428,
  active_subscribers: 1284,
  monthly_revenue: 15408,
  prize_pool: 18420,
  charity_total: 68420,
  winners: 24,
  pending_verification: 3,
  revenue_series: [
    { label: "May", value: 11200 },
    { label: "Jun", value: 12600 },
    { label: "Jul", value: 13750 },
    { label: "Aug", value: 14800 },
    { label: "Sep", value: 15408 },
  ],
}));

router.get("/admin/users", (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.toLowerCase() : "";
  const status = typeof req.query.status === "string" ? req.query.status : "";
  res.json(users.filter((user) => (!search || `${user.name} ${user.email}`.toLowerCase().includes(search)) && (!status || user.status === status)));
});

router.get("/admin/draws", (_req, res) => res.json(draws));

router.post("/admin/draws", (req, res) => {
  const parsed = SimulateDrawBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose a draw type, contribution amount, and simulation seed." });
  lastSimulation = buildSimulation(parsed.data);
  return res.json(lastSimulation);
});

router.post("/admin/draws/:id/publish", (req, res) => {
  const draw = draws.find((item) => item.id === req.params.id);
  if (!draw) return res.status(404).json({ error: "Draw not found." });
  draw.status = "Published";
  return res.json(draw);
});

router.post("/admin/charities", (req, res) => {
  const parsed = CreateCharityBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Complete all charity fields." });
  const charity: Charity = { id: `charity-${charitySequence++}`, ...parsed.data, featured: parsed.data.featured ?? false, logo_url: null, cover_image_url: null, website_url: null, active: true, impact_stat: "New impact story coming soon" };
  charities.unshift(charity);
  return res.status(201).json(charity);
});

router.get("/admin/winners", (_req, res) => res.json(winners));

router.patch("/admin/winners/:id/verification", (req, res) => {
  const parsed = UpdateWinnerVerificationBody.safeParse(req.body);
  const winner = winners.find((item) => item.id === req.params.id);
  if (!winner) return res.status(404).json({ error: "Winner not found." });
  if (!parsed.success) return res.status(400).json({ error: "Choose approve or reject." });
  winner.verification_status = parsed.data.status;
  return res.json(winner);
});

router.post("/admin/winners/:id/payout", (req, res) => {
  const winner = winners.find((item) => item.id === req.params.id);
  if (!winner) return res.status(404).json({ error: "Winner not found." });
  if (winner.verification_status !== "approved") return res.status(400).json({ error: "Approve proof before marking payout." });
  winner.payout_status = "paid";
  return res.json(winner);
});

export default router;