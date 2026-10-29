import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Info,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

import CompanionNavbar from "./CompanionNavbar";

type Question = {
  id: number;
  category: string;
  question: string;
  options: {
    text: string;
    score: number;
  }[];
};

const questions: Question[] = [
  {
    id: 1,
    category: "Empathy",
    question:
      "A senior starts talking about a difficult personal experience. What would you most likely do?",
    options: [
      {
        text: "Listen patiently and let them share at their own pace.",
        score: 5,
      },
      {
        text: "Listen briefly and quickly change the topic.",
        score: 3,
      },
      {
        text: "Tell them that everyone faces problems.",
        score: 2,
      },
      {
        text: "Avoid the conversation completely.",
        score: 1,
      },
    ],
  },
  {
    id: 2,
    category: "Patience",
    question:
      "A senior takes longer than expected to get ready for an outing. How would you respond?",
    options: [
      {
        text: "Stay patient and give them enough time.",
        score: 5,
      },
      {
        text: "Wait but repeatedly remind them to hurry.",
        score: 3,
      },
      {
        text: "Become visibly frustrated.",
        score: 2,
      },
      {
        text: "Leave because they are taking too long.",
        score: 1,
      },
    ],
  },
  {
    id: 3,
    category: "Communication",
    question:
      "You and the senior disagree about what activity to do. What is the best approach?",
    options: [
      {
        text: "Discuss their preference and find a comfortable option together.",
        score: 5,
      },
      {
        text: "Suggest your preference and try to convince them.",
        score: 3,
      },
      {
        text: "Insist on your choice.",
        score: 1,
      },
      {
        text: "Stop communicating about the activity.",
        score: 2,
      },
    ],
  },
  {
    id: 4,
    category: "Responsibility",
    question:
      "You realize you may be late for a confirmed session. What should you do?",
    options: [
      {
        text: "Inform the senior as early as possible and communicate the expected delay.",
        score: 5,
      },
      {
        text: "Wait until you arrive to explain.",
        score: 3,
      },
      {
        text: "Ignore it unless they call.",
        score: 1,
      },
      {
        text: "Cancel without explanation.",
        score: 1,
      },
    ],
  },
  {
    id: 5,
    category: "Boundaries",
    question:
      "A senior asks you to perform a task outside the agreed companionship service. What would you do?",
    options: [
      {
        text: "Politely explain the service boundary and contact support if necessary.",
        score: 5,
      },
      {
        text: "Do it even if you are uncomfortable.",
        score: 2,
      },
      {
        text: "Argue with the senior.",
        score: 1,
      },
      {
        text: "Ignore the request without explaining.",
        score: 2,
      },
    ],
  },
  {
    id: 6,
    category: "Trust & Safety",
    question:
      "A senior shares private family information with you during a session. What should you do?",
    options: [
      {
        text: "Respect their privacy and keep the information confidential.",
        score: 5,
      },
      {
        text: "Share it only with a close friend.",
        score: 1,
      },
      {
        text: "Discuss it with another companion.",
        score: 1,
      },
      {
        text: "Use it as an interesting story later.",
        score: 1,
      },
    ],
  },
  {
    id: 7,
    category: "Situational Judgment",
    question:
      "During a session, the senior suddenly appears uncomfortable and wants to go home. What should you do?",
    options: [
      {
        text: "Respect their decision, ensure they are comfortable and follow the safety process.",
        score: 5,
      },
      {
        text: "Convince them to continue because the session is not finished.",
        score: 2,
      },
      {
        text: "Ignore the concern.",
        score: 1,
      },
      {
        text: "End the session immediately without checking on them.",
        score: 2,
      },
    ],
  },
  {
    id: 8,
    category: "Adaptability",
    question:
      "The senior changes their preferred activity during a session. How would you respond?",
    options: [
      {
        text: "Adapt where reasonable and discuss the new plan together.",
        score: 5,
      },
      {
        text: "Agree but show frustration.",
        score: 3,
      },
      {
        text: "Refuse every change.",
        score: 1,
      },
      {
        text: "Leave the session.",
        score: 1,
      },
    ],
  },
  {
    id: 9,
    category: "Emotional Awareness",
    question:
      "A senior seems unusually quiet during a conversation. What would you do?",
    options: [
      {
        text: "Gently check whether they are comfortable and give them space if needed.",
        score: 5,
      },
      {
        text: "Keep talking without checking.",
        score: 3,
      },
      {
        text: "Assume they are upset with you.",
        score: 2,
      },
      {
        text: "End the conversation immediately.",
        score: 2,
      },
    ],
  },
  {
    id: 10,
    category: "Professionalism",
    question:
      "What is the most important quality when providing companionship to a senior?",
    options: [
      {
        text: "Respect, reliability and genuine care.",
        score: 5,
      },
      {
        text: "Finishing the session as quickly as possible.",
        score: 1,
      },
      {
        text: "Earning as much as possible from every session.",
        score: 2,
      },
      {
        text: "Having complete control over the session.",
        score: 1,
      },
    ],
  },
];

const STORAGE_KEY =
  "companionPsychometricCompleted";

const SCORE_KEY =
  "companionPsychometricScore";

const STATUS_KEY =
  "companionPsychometricStatus";

export default function PsychometricTest() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<number, number>>({});

  const [submitted, setSubmitted] =
    useState(false);

  const [started, setStarted] =
    useState(false);

  const selectedAnswer =
    answers[questions[currentQuestion].id];

  const progress = useMemo(() => {
    return (
      ((currentQuestion + 1) /
        questions.length) *
      100
    );
  }, [currentQuestion]);

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce(
      (total, score) => total + score,
      0
    );
  }, [answers]);

  const maximumScore =
    questions.length * 5;

  const percentage = Math.round(
    (totalScore / maximumScore) * 100
  );

  const handleAnswer = (
    score: number
  ) => {
    setAnswers((current) => ({
      ...current,
      [questions[currentQuestion].id]:
        score,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(
        (current) => current + 1
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (current) => current - 1
      );
    }
  };

  const handleSubmit = () => {
    if (
      Object.keys(answers).length !==
      questions.length
    ) {
      return;
    }

    const passed = percentage >= 70;

    localStorage.setItem(
      STORAGE_KEY,
      "true"
    );

    localStorage.setItem(
      SCORE_KEY,
      String(percentage)
    );

    localStorage.setItem(
      STATUS_KEY,
      passed ? "passed" : "review"
    );

    setSubmitted(true);
  };

  const handleContinueVerification = () => {
    navigate("/companion/verification");
  };

  const passed = percentage >= 70;

  /* =====================================================
     RESULT SCREEN
  ===================================================== */

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">

        <CompanionNavbar />

        <main className="mx-auto flex max-w-4xl px-5 py-12 sm:px-6 lg:py-16">

          <div className="w-full overflow-hidden rounded-3xl border border-[#E3DBD1] bg-white shadow-sm">

            <div className="flex flex-col items-center px-6 py-12 text-center sm:px-12">

              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  passed
                    ? "bg-[#EDF7EF] text-[#4F8B5D]"
                    : "bg-[#FFF4E6] text-[#9A7443]"
                }`}
              >
                {passed ? (
                  <CheckCircle2 size={40} />
                ) : (
                  <Clock3 size={40} />
                )}
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#80654D]">
                Assessment completed
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#30271F]">
                {passed
                  ? "You are ready for the next step"
                  : "Your assessment needs a review"}
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#75695E]">
                {passed
                  ? "Your responses indicate a strong foundation for providing respectful and responsible companionship."
                  : "Your assessment has been recorded. Our verification process may require an additional review before your companion account can be activated."}
              </p>

              {/* Score */}

              <div className="mt-8 rounded-2xl border border-[#E3DBD1] bg-[#FBF9F6] px-10 py-6">

                <p className="text-xs font-medium uppercase tracking-wider text-[#8A7A6B]">
                  Assessment score
                </p>

                <p className="mt-2 text-4xl font-semibold text-[#6F5139]">
                  {percentage}%
                </p>

                <p className="mt-1 text-xs text-[#8A7A6B]">
                  {totalScore} out of{" "}
                  {maximumScore} points
                </p>

              </div>

              {/* Requirements */}

              <div className="mt-8 w-full max-w-xl space-y-3 text-left">

                <ResultItem
                  icon={
                    <CheckCircle2
                      size={17}
                    />
                  }
                  title="Psychometric assessment"
                  description="Completed"
                />

                <ResultItem
                  icon={
                    <ShieldCheck
                      size={17}
                    />
                  }
                  title="Identity verification"
                  description={
                    passed
                      ? "Next step"
                      : "Pending review"
                  }
                />

                <ResultItem
                  icon={
                    <UserCheck
                      size={17}
                    />
                  }
                  title="Companion verification"
                  description="Required before going online"
                />

              </div>

              {passed && (
                <button
                  onClick={
                    handleContinueVerification
                  }
                  className="mt-8 flex w-full max-w-xl items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  Continue to Verification
                  <ArrowRight
                    size={17}
                  />
                </button>
              )}

              {!passed && (
                <button
                  onClick={() => {
                    setAnswers({});
                    setCurrentQuestion(0);
                    setSubmitted(false);
                    setStarted(false);
                  }}
                  className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  Retake Assessment
                  <ArrowRight
                    size={17}
                  />
                </button>
              )}

            </div>

          </div>

        </main>

      </div>
    );
  }

  /* =====================================================
     INTRO SCREEN
  ===================================================== */

  if (!started) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">

        <CompanionNavbar />

        <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:py-14">

          <button
            onClick={() =>
              navigate("/companion/dashboard")
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-[#6F5139] hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="overflow-hidden rounded-3xl border border-[#E3DBD1] bg-white shadow-sm">

            {/* Hero */}

            <div className="bg-[#6F5139] px-6 py-10 text-white sm:px-10 lg:px-12">

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div className="max-w-2xl">

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <HeartHandshake
                      size={25}
                    />
                  </div>

                  <p className="text-sm font-medium text-[#EADFD3]">
                    Companion verification
                  </p>

                  <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Psychometric Assessment
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-[#E9DED2]">
                    A short assessment designed to understand
                    your empathy, patience, communication,
                    responsibility and situational judgment.
                  </p>

                </div>

                <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 p-5">

                  <div className="flex items-center gap-3">

                    <Clock3 size={20} />

                    <div>

                      <p className="text-xs text-[#EADFD3]">
                        Estimated time
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        8–10 minutes
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Information */}

            <div className="p-6 sm:p-10">

              <div className="grid gap-4 md:grid-cols-3">

                <AssessmentInfo
                  icon={
                    <HeartHandshake
                      size={20}
                    />
                  }
                  title="Empathy"
                  description="Understand how you respond to the emotional needs of seniors."
                />

                <AssessmentInfo
                  icon={
                    <ShieldCheck
                      size={20}
                    />
                  }
                  title="Responsibility"
                  description="Evaluate your approach to safety, privacy and commitments."
                />

                <AssessmentInfo
                  icon={
                    <UserCheck size={20} />
                  }
                  title="Professionalism"
                  description="Understand your approach to communication and boundaries."
                />

              </div>

              {/* Mandatory notice */}

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#E5D8C6] bg-[#FBF6EE] p-5">

                <LockKeyhole
                  size={19}
                  className="mt-0.5 shrink-0 text-[#80654D]"
                />

                <div>

                  <p className="text-sm font-semibold text-[#554638]">
                    This assessment is mandatory
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#75685C]">
                    Every companion must complete this assessment
                    before completing platform verification and
                    accessing online session availability.
                  </p>

                </div>

              </div>

              {/* Rules */}

              <div className="mt-8">

                <h2 className="text-base font-semibold text-[#30271F]">
                  Before you begin
                </h2>

                <div className="mt-4 space-y-3">

                  <Rule
                    text="Answer each question honestly based on how you would actually behave."
                  />

                  <Rule
                    text="There are no trick questions."
                  />

                  <Rule
                    text="You need to answer all questions before submitting."
                  />

                  <Rule
                    text="Your responses may be reviewed as part of the companion verification process."
                  />

                  <Rule
                    text="The assessment is not a medical or psychological diagnosis."
                  />

                </div>

              </div>

              {/* Start */}

              <div className="mt-10 flex flex-col gap-4 border-t border-[#E7E0D7] pt-7 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2 text-xs text-[#7C7065]">
                  <Info size={15} />
                  10 questions · One attempt at a time
                </div>

                <button
                  onClick={() =>
                    setStarted(true)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  Start Assessment
                  <ArrowRight size={17} />
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>
    );
  }

  /* =====================================================
     QUESTION SCREEN
  ===================================================== */

  const question =
    questions[currentQuestion];

  const allAnswered =
    Object.keys(answers).length ===
    questions.length;

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">

      <CompanionNavbar />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:py-12">

        {/* Header */}

        <div className="mb-7 flex items-center justify-between">

          <button
            onClick={() =>
              setStarted(false)
            }
            className="flex items-center gap-2 text-sm font-medium text-[#6F5139]"
          >
            <ArrowLeft size={16} />
            Exit assessment
          </button>

          <div className="text-right">

            <p className="text-xs text-[#8B7B6C]">
              Question
            </p>

            <p className="text-sm font-semibold text-[#40362E]">
              {currentQuestion + 1} /{" "}
              {questions.length}
            </p>

          </div>

        </div>

        {/* Progress */}

        <div className="mb-7">

          <div className="h-2 overflow-hidden rounded-full bg-[#E8E0D6]">

            <div
              className="h-full rounded-full bg-[#6F5139] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Question Card */}

        <div className="overflow-hidden rounded-3xl border border-[#E3DBD1] bg-white shadow-sm">

          <div className="border-b border-[#E8E1D8] px-6 py-5 sm:px-8">

            <span className="inline-flex rounded-full bg-[#F3ECE3] px-3 py-1.5 text-xs font-semibold text-[#6F5139]">
              {question.category}
            </span>

          </div>

          <div className="p-6 sm:p-8">

            <h1 className="max-w-3xl text-xl font-semibold leading-8 text-[#30271F] sm:text-2xl">
              {question.question}
            </h1>

            <p className="mt-2 text-sm text-[#83766A]">
              Select the response that best reflects
              how you would handle the situation.
            </p>

            {/* Answers */}

            <div className="mt-7 space-y-3">

              {question.options.map(
                (option, index) => {
                  const selected =
                    selectedAnswer ===
                    option.score;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        handleAnswer(
                          option.score
                        )
                      }
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-[#6F5139] bg-[#F7F1EA]"
                          : "border-[#E2DBD2] bg-white hover:border-[#BFA995] hover:bg-[#FBF9F6]"
                      }`}
                    >

                      <div
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                          selected
                            ? "border-[#6F5139] bg-[#6F5139] text-white"
                            : "border-[#CFC4B8] text-[#8B7C6E]"
                        }`}
                      >
                        {selected
                          ? "✓"
                          : String.fromCharCode(
                              65 + index
                            )}
                      </div>

                      <span
                        className={`text-sm leading-6 ${
                          selected
                            ? "font-medium text-[#4B3B2E]"
                            : "text-[#5F554C]"
                        }`}
                      >
                        {option.text}
                      </span>

                    </button>
                  );
                }
              )}

            </div>

            {/* Bottom */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#E8E1D8] pt-6 sm:flex-row sm:items-center sm:justify-between">

              <button
                onClick={
                  handlePrevious
                }
                disabled={
                  currentQuestion === 0
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-[#DED5CA] px-5 py-3 text-sm font-semibold text-[#65594E] transition hover:bg-[#FBF9F6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              {currentQuestion ===
              questions.length - 1 ? (
                <button
                  onClick={
                    handleSubmit
                  }
                  disabled={!allAnswered}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit Assessment
                  <CheckCircle2
                    size={17}
                  />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={
                    selectedAnswer ===
                    undefined
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next Question
                  <ArrowRight
                    size={17}
                  />
                </button>
              )}

            </div>

          </div>

        </div>

        {/* Privacy */}

        <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#817469]">

          <LockKeyhole
            size={14}
            className="mt-0.5 shrink-0"
          />

          <p>
            Your assessment responses are part of
            your companion verification record and
            should be securely stored by the platform.
          </p>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   ASSESSMENT INFO
========================================================= */

function AssessmentInfo({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E4DDD4] bg-[#FBF9F6] p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#40362E]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-[#7D7064]">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   RULE
========================================================= */

function Rule({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <CheckCircle2
        size={17}
        className="mt-0.5 shrink-0 text-[#6F5139]"
      />

      <p className="text-sm leading-6 text-[#675B50]">
        {text}
      </p>

    </div>
  );
}

/* =========================================================
   RESULT ITEM
========================================================= */

function ResultItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E4DDD4] bg-[#FBF9F6] p-4">

      <div className="flex items-center gap-3">

        <div className="text-[#5A7A5F]">
          {icon}
        </div>

        <p className="text-sm font-semibold text-[#40362E]">
          {title}
        </p>

      </div>

      <span className="text-xs font-medium text-[#7C7065]">
        {description}
      </span>

    </div>
  );
}