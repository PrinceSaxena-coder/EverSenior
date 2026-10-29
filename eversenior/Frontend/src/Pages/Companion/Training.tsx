import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CompanionNavbar from "./CompanionNavbar";

import {
  Play,
  Clock3,
  CheckCircle2,
  Lock,
  Search,
  BookOpen,
  Award,
  ChevronRight,
  X,
  Video,
  Users,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type TrainingCategory =
  | "All"
  | "Communication"
  | "Senior Care"
  | "Safety"
  | "Professional"
  | "Wellness";

type TrainingLevel = "Beginner" | "Intermediate" | "Advanced";

type TrainingModule = {
  id: number;
  title: string;
  description: string;
  category: Exclude<TrainingCategory, "All">;
  duration: string;
  durationMinutes: number;
  level: TrainingLevel;
  instructor: string;
  videoUrl: string;
  thumbnail: string;
  locked: boolean;
  featured?: boolean;
};

/* =========================================================
   TRAINING DATA
   =========================================================
   Later, these objects can come from your backend/database.

   Example:
   videoUrl: "https://your-storage.com/videos/video.mp4"

   thumbnail:
   "https://your-storage.com/thumbnails/video.jpg"
========================================================= */

const trainingModules: TrainingModule[] = [
  {
    id: 1,
    title: "Understanding the Role of a Companion",
    description:
      "Learn what it means to be a trusted companion and how to create meaningful experiences for seniors.",
    category: "Professional",
    duration: "12 min",
    durationMinutes: 12,
    level: "Beginner",
    instructor: "EverSenior Training Team",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
    locked: false,
    featured: true,
  },
  {
    id: 2,
    title: "Communicating With Seniors",
    description:
      "Build better conversations through patience, active listening and respectful communication.",
    category: "Communication",
    duration: "18 min",
    durationMinutes: 18,
    level: "Beginner",
    instructor: "EverSenior Training Team",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    locked: false,
  },
  {
    id: 3,
    title: "Empathy & Emotional Support",
    description:
      "Understand emotional needs and learn how to respond with empathy during difficult moments.",
    category: "Communication",
    duration: "21 min",
    durationMinutes: 21,
    level: "Intermediate",
    instructor: "EverSenior Training Team",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=80",
    locked: false,
  },
  {
    id: 4,
    title: "Safety During Home Visits",
    description:
      "Learn practical safety practices for entering homes, identifying risks and responding to emergencies.",
    category: "Safety",
    duration: "16 min",
    durationMinutes: 16,
    level: "Beginner",
    instructor: "EverSenior Safety Team",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    locked: false,
  },
  {
    id: 5,
    title: "Handling Difficult Situations",
    description:
      "Learn how to stay calm, communicate clearly and escalate situations responsibly.",
    category: "Professional",
    duration: "24 min",
    durationMinutes: 24,
    level: "Intermediate",
    instructor: "EverSenior Training Team",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    locked: true,
  },
  {
    id: 6,
    title: "Supporting Senior Wellness",
    description:
      "Understand the basics of encouraging healthy routines, activities and positive daily habits.",
    category: "Wellness",
    duration: "19 min",
    durationMinutes: 19,
    level: "Intermediate",
    instructor: "EverSenior Wellness Team",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
    locked: true,
  },
  {
    id: 7,
    title: "Basic Senior Care Awareness",
    description:
      "Understand common care situations and when a companion should seek professional assistance.",
    category: "Senior Care",
    duration: "27 min",
    durationMinutes: 27,
    level: "Intermediate",
    instructor: "EverSenior Care Team",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    locked: true,
  },
  {
    id: 8,
    title: "Professional Boundaries",
    description:
      "Learn how to maintain healthy professional boundaries while building genuine relationships.",
    category: "Professional",
    duration: "15 min",
    durationMinutes: 15,
    level: "Advanced",
    instructor: "EverSenior Training Team",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    locked: true,
  },
];

/* =========================================================
   CATEGORY ICON
========================================================= */

function CategoryIcon({
  category,
}: {
  category: Exclude<TrainingCategory, "All">;
}) {
  if (category === "Communication") {
    return <MessageCircle size={18} />;
  }

  if (category === "Senior Care") {
    return <HeartHandshake size={18} />;
  }

  if (category === "Safety") {
    return <ShieldCheck size={18} />;
  }

  if (category === "Wellness") {
    return <Sparkles size={18} />;
  }

  return <Users size={18} />;
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function OnlineTraining() {
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [selectedModule, setSelectedModule] =
    useState<TrainingModule | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<TrainingCategory>("All");

  /* -------------------------------------------------------
     LOAD PROGRESS
  ------------------------------------------------------- */

  useEffect(() => {
    const savedProgress = localStorage.getItem(
      "companionTrainingProgress"
    );

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);

        if (Array.isArray(parsed)) {
          setCompletedModules(parsed);
        }
      } catch {
        setCompletedModules([]);
      }
    }
  }, []);

  /* -------------------------------------------------------
     SAVE PROGRESS
  ------------------------------------------------------- */

  useEffect(() => {
    localStorage.setItem(
      "companionTrainingProgress",
      JSON.stringify(completedModules)
    );
  }, [completedModules]);

  /* -------------------------------------------------------
     PROGRESS
  ------------------------------------------------------- */

  const completedCount = completedModules.length;

  const totalModules = trainingModules.length;

  const progressPercentage =
    totalModules === 0
      ? 0
      : Math.round((completedCount / totalModules) * 100);

  const totalTrainingMinutes = trainingModules.reduce(
    (total, module) => total + module.durationMinutes,
    0
  );

  const completedTrainingMinutes = trainingModules
    .filter((module) => completedModules.includes(module.id))
    .reduce(
      (total, module) => total + module.durationMinutes,
      0
    );

  /* -------------------------------------------------------
     FILTER MODULES
  ------------------------------------------------------- */

  const filteredModules = useMemo(() => {
    return trainingModules.filter((module) => {
      const matchesCategory =
        selectedCategory === "All" ||
        module.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        query.length === 0 ||
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        module.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  /* -------------------------------------------------------
     FEATURED MODULE
  ------------------------------------------------------- */

  const featuredModule =
    trainingModules.find((module) => module.featured) ||
    trainingModules[0];

  /* -------------------------------------------------------
     CONTINUE LEARNING
  ------------------------------------------------------- */

  const continueModule =
    trainingModules.find(
      (module) =>
        !completedModules.includes(module.id) && !module.locked
    ) || featuredModule;

  /* -------------------------------------------------------
     COMPLETE MODULE
  ------------------------------------------------------- */

  const markAsCompleted = (moduleId: number) => {
    setCompletedModules((previous) => {
      if (previous.includes(moduleId)) {
        return previous;
      }

      return [...previous, moduleId];
    });

    setSelectedModule(null);
  };

  /* -------------------------------------------------------
     OPEN MODULE
  ------------------------------------------------------- */

  const openModule = (module: TrainingModule) => {
    if (module.locked) {
      return;
    }

    setSelectedModule(module);
  };

  return (
    <div className="min-h-screen bg-[#f8f3ed] text-[#3b2f2a]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <CompanionNavbar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="pb-20">
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="border-b border-[#eadfd5] bg-[#f8f3ed]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dbcbbd] bg-white px-4 py-2 text-sm font-medium text-[#745b4c]">
                  <GraduationCap />
                  Companion Learning Centre
                </div>

                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#3b2f2a] sm:text-5xl lg:text-6xl">
                  Learn. Grow.
                  <br />
                  <span className="text-[#8b654f]">
                    Become a better companion.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-[#77675e] sm:text-lg">
                  Build the skills, confidence and knowledge needed
                  to create meaningful experiences for every senior
                  you support.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openModule(continueModule)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6f4e3d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5d4032]"
                  >
                    <Play size={17} fill="currentColor" />
                    Continue Learning
                  </button>

                  <a
                    href="#training-modules"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#d9cabe] bg-white px-5 py-3 text-sm font-semibold text-[#5c473b] transition hover:bg-[#f4eee8]"
                  >
                    Explore Training
                    <ArrowRight size={17} />
                  </a>
                </div>
              </div>

              {/* Hero progress card */}

              <div className="rounded-3xl border border-[#e6d9cf] bg-white p-6 shadow-[0_15px_50px_rgba(82,57,43,0.08)] sm:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#806d62]">
                      Your learning progress
                    </p>

                    <h2 className="mt-2 text-4xl font-semibold text-[#3b2f2a]">
                      {progressPercentage}%
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e9df] text-[#795843]">
                    <Award size={24} />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#806d62]">
                    <span>
                      {completedCount} of {totalModules} modules
                    </span>

                    <span>
                      {completedTrainingMinutes} /{" "}
                      {totalTrainingMinutes} min
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#eee5de]">
                    <div
                      className="h-full rounded-full bg-[#8b654f] transition-all duration-500"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#faf7f3] p-4">
                    <p className="text-xs text-[#88766b]">
                      Completed
                    </p>

                    <p className="mt-1 text-xl font-semibold text-[#3b2f2a]">
                      {completedCount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#faf7f3] p-4">
                    <p className="text-xs text-[#88766b]">
                      Remaining
                    </p>

                    <p className="mt-1 text-xl font-semibold text-[#3b2f2a]">
                      {Math.max(totalModules - completedCount, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            CONTINUE LEARNING
        =================================================== */}

        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-[#e5d8ce] bg-[#6f4e3d] p-6 text-white shadow-lg sm:p-8">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.75fr]">
              <div>
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#eadfd5]">
                  <Play size={16} fill="currentColor" />
                  Continue Learning
                </div>

                <h2 className="max-w-2xl text-2xl font-semibold sm:text-3xl">
                  {continueModule.title}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#eadfd5] sm:text-base">
                  {continueModule.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#eadfd5]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={16} />
                    {continueModule.duration}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={16} />
                    {continueModule.level}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openModule(continueModule)}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#5f4435] transition hover:bg-[#f5eee8]"
                >
                  <Play size={16} fill="currentColor" />
                  Start Training
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-black">
                <img
                  src={continueModule.thumbnail}
                  alt={continueModule.title}
                  className="h-56 w-full object-cover opacity-75"
                />

                <button
                  type="button"
                  onClick={() => openModule(continueModule)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label={`Play ${continueModule.title}`}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#6f4e3d] shadow-xl transition hover:scale-105">
                    <Play size={26} fill="currentColor" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            QUICK STATS
        =================================================== */}

        <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Video size={20} />}
              label="Training modules"
              value={`${totalModules}`}
            />

            <StatCard
              icon={<Clock3 size={20} />}
              label="Total learning time"
              value={`${totalTrainingMinutes} min`}
            />

            <StatCard
              icon={<CheckCircle2 size={20} />}
              label="Modules completed"
              value={`${completedCount}`}
            />
          </div>
        </section>

        {/* ===================================================
            TRAINING MODULES
        =================================================== */}

        <section
          id="training-modules"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-14 sm:px-8 lg:px-10"
        >
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#94745f]">
                Learning Library
              </p>

              <h2 className="mt-2 text-3xl font-semibold text-[#3b2f2a]">
                Training modules
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77675e]">
                Learn at your own pace and complete each module to
                build your companion profile.
              </p>
            </div>

            {/* Search */}

            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#927c6f]"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search training modules..."
                  className="h-12 w-full rounded-xl border border-[#dfd2c8] bg-white pl-11 pr-4 text-sm text-[#3b2f2a] outline-none transition placeholder:text-[#a09289] focus:border-[#9b765e] focus:ring-2 focus:ring-[#b8957d]/20"
                />
              </div>
            </div>

            {/* Categories */}

            <div className="flex gap-2 overflow-x-auto pb-1">
              {(
                [
                  "All",
                  "Communication",
                  "Senior Care",
                  "Safety",
                  "Professional",
                  "Wellness",
                ] as TrainingCategory[]
              ).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-[#6f4e3d] text-white"
                      : "border border-[#ded1c7] bg-white text-[#705c50] hover:bg-[#f4eee8]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Module grid */}

          {filteredModules.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredModules.map((module) => {
                const completed = completedModules.includes(
                  module.id
                );

                return (
                  <TrainingCard
                    key={module.id}
                    module={module}
                    completed={completed}
                    onOpen={() => openModule(module)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-[#d9cabe] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4eee8] text-[#80624e]">
                <Search size={23} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-[#3b2f2a]">
                No training found
              </h3>

              <p className="mt-2 text-sm text-[#806f65]">
                Try another search term or choose a different
                category.
              </p>
            </div>
          )}
        </section>

        {/* ===================================================
            FUTURE TRAINING SECTION
        =================================================== */}

        <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-[#e3d6cc] bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3e9df] text-[#7b5b47]">
                  <GraduationCap />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#3b2f2a]">
                    More training is coming
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#7d6d63]">
                    New training videos, quizzes, assessments and
                    certificates can be added here as the
                    EverSenior learning platform grows.
                  </p>
                </div>
              </div>

              <Link
                to="/companion/messages"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d9cabe] px-4 py-3 text-sm font-semibold text-[#654b3c] transition hover:bg-[#f5efe9]"
              >
                Contact Support
                <ChevronRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          VIDEO MODAL
      ===================================================== */}

      {selectedModule && (
        <VideoModal
          module={selectedModule}
          completed={completedModules.includes(selectedModule.id)}
          onClose={() => setSelectedModule(null)}
          onComplete={() => markAsCompleted(selectedModule.id)}
        />
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e3d6cc] bg-white p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3e9df] text-[#7b5b47]">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-[#8a776b]">
          {label}
        </p>

        <p className="mt-1 text-xl font-semibold text-[#3b2f2a]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   TRAINING CARD
========================================================= */

function TrainingCard({
  module,
  completed,
  onOpen,
}: {
  module: TrainingModule;
  completed: boolean;
  onOpen: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#e4d8cf] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(82,57,43,0.1)]">
      {/* Thumbnail */}

      <div className="relative aspect-[16/10] overflow-hidden bg-[#eee6df]">
        <img
          src={module.thumbnail}
          alt={module.title}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            module.locked ? "grayscale opacity-70" : ""
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        {/* Category */}

        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#684c3d] shadow-sm">
            <CategoryIcon category={module.category} />
            {module.category}
          </span>
        </div>

        {/* Status */}

        <div className="absolute right-4 top-4">
          {completed ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#5e8063] shadow-sm">
              <CheckCircle2 size={20} />
            </span>
          ) : module.locked ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#806f65] shadow-sm">
              <Lock size={18} />
            </span>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#6f4e3d] shadow-sm">
              <Play size={17} fill="currentColor" />
            </span>
          )}
        </div>

        {/* Duration */}

        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <Clock3 size={13} />
            {module.duration}
          </span>
        </div>
      </div>

      {/* Content */}

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#967864]">
            {module.level}
          </span>

          {completed && (
            <span className="text-xs font-semibold text-[#66806b]">
              Completed
            </span>
          )}

          {module.locked && !completed && (
            <span className="text-xs font-semibold text-[#927e72]">
              Locked
            </span>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-6 text-[#3b2f2a]">
          {module.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#7d6d63]">
          {module.description}
        </p>

        <button
          type="button"
          onClick={onOpen}
          disabled={module.locked}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            module.locked
              ? "cursor-not-allowed bg-[#f1ebe6] text-[#9a8b82]"
              : completed
              ? "border border-[#ded2c9] bg-white text-[#674d3e] hover:bg-[#f7f2ed]"
              : "bg-[#6f4e3d] text-white hover:bg-[#5d4032]"
          }`}
        >
          {module.locked ? (
            <>
              <Lock size={16} />
              Complete previous training
            </>
          ) : completed ? (
            <>
              <Play size={16} />
              Watch Again
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Start Training
            </>
          )}
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   VIDEO MODAL
========================================================= */

function VideoModal({
  module,
  completed,
  onClose,
  onComplete,
}: {
  module: TrainingModule;
  completed: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#eadfd5] px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-4">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#967864]">
              Online Training
            </p>

            <h2 className="mt-1 truncate text-lg font-semibold text-[#3b2f2a] sm:text-xl">
              {module.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#745f53] transition hover:bg-[#f4eee8]"
            aria-label="Close video"
          >
            <X size={21} />
          </button>
        </div>

        {/* Video */}

        <div className="bg-black">
          <video
            key={module.id}
            controls
            playsInline
            className="aspect-video max-h-[65vh] w-full bg-black object-contain"
            poster={module.thumbnail}
          >
            <source src={module.videoUrl} type="video/mp4" />

            Your browser does not support the video element.
          </video>
        </div>

        {/* Details */}

        <div className="max-h-[30vh] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#816e63]">
            <span className="rounded-full bg-[#f4eee8] px-3 py-1.5">
              {module.category}
            </span>

            <span className="rounded-full bg-[#f4eee8] px-3 py-1.5">
              {module.level}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4eee8] px-3 py-1.5">
              <Clock3 size={13} />
              {module.duration}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-semibold text-[#3b2f2a]">
            About this training
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#75665d]">
            {module.description}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onComplete}
              disabled={completed}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                completed
                  ? "cursor-default bg-[#edf3ed] text-[#66806b]"
                  : "bg-[#6f4e3d] text-white hover:bg-[#5d4032]"
              }`}
            >
              <CheckCircle2 size={17} />

              {completed
                ? "Training Completed"
                : "Mark as Completed"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#ded1c7] px-5 py-3 text-sm font-semibold text-[#684d3e] transition hover:bg-[#f5efe9]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL ICON
========================================================= */

function GraduationIcon() {
  return <GraduationCap size={17} />;
}