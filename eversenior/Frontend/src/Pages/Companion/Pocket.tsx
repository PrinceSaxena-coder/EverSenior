import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  IndianRupee,
  Info,
  Wallet,
} from "lucide-react";

import CompanionNavbar from "./CompanionNavbar";

type TransactionType = "earning" | "payout";

type Transaction = {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  amount: number;
  type: TransactionType;
  status: "Completed" | "Processing";
};

type EarningsDay = {
  day: string;
  amount: number;
};

const transactions: Transaction[] = [
  {
    id: 1,
    title: "Prince Saxena",
    subtitle: "Coffee & Conversation",
    date: "12 Oct 2026",
    time: "04:00 PM",
    amount: 600,
    type: "earning",
    status: "Completed",
  },
  {
    id: 2,
    title: "Rajiv Mehta",
    subtitle: "Evening Walk & Conversation",
    date: "10 Oct 2026",
    time: "05:30 PM",
    amount: 450,
    type: "earning",
    status: "Completed",
  },
  {
    id: 3,
    title: "Meera Kapoor",
    subtitle: "Art & Hobby Session",
    date: "08 Oct 2026",
    time: "03:00 PM",
    amount: 650,
    type: "earning",
    status: "Completed",
  },
  {
    id: 4,
    title: "Payout to Bank",
    subtitle: "HDFC Bank •••• 4821",
    date: "05 Oct 2026",
    time: "11:20 AM",
    amount: 2000,
    type: "payout",
    status: "Completed",
  },
  {
    id: 5,
    title: "Rahul Verma",
    subtitle: "Morning Conversation",
    date: "04 Oct 2026",
    time: "09:00 AM",
    amount: 550,
    type: "earning",
    status: "Completed",
  },
  {
    id: 6,
    title: "Anita Sharma",
    subtitle: "Technology Help & Tea",
    date: "02 Oct 2026",
    time: "11:00 AM",
    amount: 700,
    type: "earning",
    status: "Completed",
  },
];

const earningsData: EarningsDay[] = [
  {
    day: "Mon",
    amount: 500,
  },
  {
    day: "Tue",
    amount: 800,
  },
  {
    day: "Wed",
    amount: 350,
  },
  {
    day: "Thu",
    amount: 900,
  },
  {
    day: "Fri",
    amount: 600,
  },
  {
    day: "Sat",
    amount: 750,
  },
  {
    day: "Sun",
    amount: 450,
  },
];

export default function Pocket() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "payouts"
  >("overview");

  const [withdrawOpen, setWithdrawOpen] =
    useState(false);

  const [withdrawAmount, setWithdrawAmount] =
    useState("");

  const availableBalance = 2450;

  const monthlyEarnings = 12450;

  const totalEarned = 38600;

  const totalSessions = 18;

  const maxChartValue = useMemo(
    () =>
      Math.max(
        ...earningsData.map(
          (item) => item.amount
        )
      ),
    []
  );

  const earningTransactions = transactions.filter(
    (transaction) =>
      transaction.type === "earning"
  );

  const payoutTransactions = transactions.filter(
    (transaction) =>
      transaction.type === "payout"
  );

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);

    if (!amount || amount <= 0) {
      return;
    }

    if (amount > availableBalance) {
      return;
    }

    setWithdrawAmount("");
    setWithdrawOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <CompanionNavbar />

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <section className="border-b border-[#E2DBD0] bg-[#F7F3EC]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="mb-2 text-sm font-semibold text-[#7A624C]">
                Your earnings
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
                Pocket
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#716458] sm:text-base">
                Keep track of what you have earned,
                what is available, and where your money
                has gone.
              </p>
            </div>

            <button
              onClick={() =>
                setWithdrawOpen(true)
              }
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633] md:self-auto"
            >
              <ArrowDownToLine size={17} />
              Withdraw
            </button>

          </div>
        </div>
      </section>

      {/* =====================================================
          BALANCE + STATS
      ===================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">

          <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">

            {/* Available balance */}
            <div className="rounded-2xl bg-[#6F5139] p-5 text-white sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#E9DED2]">
                    Available to withdraw
                  </p>

                  <p className="mt-2 flex items-center text-3xl font-semibold tracking-tight">
                    <IndianRupee size={25} />
                    {availableBalance.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Wallet size={19} />
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-[#E6D9CB]">
                Earnings from completed sessions
                that are currently available for
                payout.
              </p>
            </div>

            <PocketStat
              icon={<CalendarDays size={19} />}
              label="This month"
              value={`₹${monthlyEarnings.toLocaleString(
                "en-IN"
              )}`}
              description={`${totalSessions} sessions completed`}
            />

            <PocketStat
              icon={<Banknote size={19} />}
              label="Total earned"
              value={`₹${totalEarned.toLocaleString(
                "en-IN"
              )}`}
              description="since joining EverSenior"
            />

            <PocketStat
              icon={<CreditCard size={19} />}
              label="Last payout"
              value="₹2,000"
              description="05 Oct 2026"
            />

          </div>
        </div>
      </section>

      {/* =====================================================
          TABS
      ===================================================== */}
      <section className="border-y border-[#E2DBD0] bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="flex gap-1 overflow-x-auto py-3">

            <PocketTab
              active={activeTab === "overview"}
              label="Overview"
              onClick={() =>
                setActiveTab("overview")
              }
            />

            <PocketTab
              active={
                activeTab === "transactions"
              }
              label="Transactions"
              onClick={() =>
                setActiveTab("transactions")
              }
            />

            <PocketTab
              active={activeTab === "payouts"}
              label="Payouts"
              onClick={() =>
                setActiveTab("payouts")
              }
            />

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">

        {activeTab === "overview" && (
          <Overview
            maxChartValue={maxChartValue}
            earningTransactions={
              earningTransactions
            }
            onViewTransactions={() =>
              setActiveTab("transactions")
            }
          />
        )}

        {activeTab === "transactions" && (
          <Transactions
            transactions={transactions}
          />
        )}

        {activeTab === "payouts" && (
          <Payouts
            transactions={payoutTransactions}
            onWithdraw={() =>
              setWithdrawOpen(true)
            }
          />
        )}

      </main>

      {/* =====================================================
          WITHDRAW MODAL
      ===================================================== */}
      {withdrawOpen && (
        <WithdrawModal
          availableBalance={availableBalance}
          amount={withdrawAmount}
          setAmount={setWithdrawAmount}
          onClose={() =>
            setWithdrawOpen(false)
          }
          onWithdraw={handleWithdraw}
        />
      )}
    </div>
  );
}

/* =========================================================
   POCKET STAT
========================================================= */

function PocketStat({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[126px] items-center gap-4 rounded-2xl border border-[#E5DDD3] bg-[#FBF9F6] px-5 py-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFE6DC] text-[#6F5139]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#887868]">
          {label}
        </p>

        <p className="mt-1 text-xl font-semibold tracking-tight text-[#30271F]">
          {value}
        </p>

        <p className="mt-1 text-xs text-[#938476]">
          {description}
        </p>
      </div>

    </div>
  );
}

/* =========================================================
   TAB
========================================================= */

function PocketTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-[#6F5139] text-white shadow-sm"
          : "text-[#65594E] hover:bg-[#F3ECE3] hover:text-[#6F5139]"
      }`}
    >
      {label}
    </button>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function Overview({
  maxChartValue,
  earningTransactions,
  onViewTransactions,
}: {
  maxChartValue: number;
  earningTransactions: Transaction[];
  onViewTransactions: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">

      {/* Earnings chart */}
      <section className="rounded-2xl border border-[#E3DBD1] bg-white p-5 sm:p-6">

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A735D]">
              Earnings overview
            </p>

            <h2 className="mt-1.5 text-xl font-semibold text-[#30271F]">
              This week's earnings
            </h2>

            <p className="mt-1 text-sm text-[#786B5F]">
              Your earnings from completed
              sessions.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
            <ArrowUpRight size={18} />
          </div>

        </div>

        {/* Chart */}
        <div className="mt-8">

          <div className="flex h-52 items-end gap-3 sm:gap-5">

            {earningsData.map((item) => {
              const height =
                (item.amount /
                  maxChartValue) *
                100;

              return (
                <div
                  key={item.day}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="mb-2 text-center text-[10px] font-medium text-[#887868]">
                    ₹{item.amount}
                  </div>

                  <div
                    className="mx-auto w-full max-w-[42px] rounded-t-lg bg-[#B59A7E] transition hover:bg-[#6F5139]"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <div className="mt-2 text-center text-[11px] font-medium text-[#887868]">
                    {item.day}
                  </div>
                </div>
              );
            })}

          </div>

        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#F8F4EF] px-3.5 py-3 text-xs text-[#75685C]">
          <Info size={14} className="shrink-0 text-[#806B56]" />
          Earnings are added to your available
          balance after the session is completed.
        </div>

      </section>

      {/* Recent transactions */}
      <section className="rounded-2xl border border-[#E3DBD1] bg-white p-5 sm:p-6">

        <div className="flex items-center justify-between gap-4">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A735D]">
              Recent activity
            </p>

            <h2 className="mt-1.5 text-xl font-semibold text-[#30271F]">
              Recent transactions
            </h2>
          </div>

          <button
            onClick={onViewTransactions}
            className="text-xs font-semibold text-[#6F5139] hover:underline"
          >
            View all
          </button>

        </div>

        <div className="mt-5 divide-y divide-[#EEE7DF]">

          {earningTransactions
            .slice(0, 4)
            .map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
              />
            ))}

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   TRANSACTIONS
========================================================= */

function Transactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div>

      <PageHeading
        eyebrow="Money movement"
        title="Transactions"
        description="A complete record of your session earnings and payouts."
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3DBD1] bg-white">

        <div className="divide-y divide-[#EEE7DF]">

          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              large
            />
          ))}

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   TRANSACTION ROW
========================================================= */

function TransactionRow({
  transaction,
  large = false,
}: {
  transaction: Transaction;
  large?: boolean;
}) {
  const isEarning =
    transaction.type === "earning";

  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        large
          ? "px-5 py-4 sm:px-6"
          : "py-3.5"
      }`}
    >

      <div className="flex min-w-0 items-center gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isEarning
              ? "bg-[#EDF5EE] text-[#47714E]"
              : "bg-[#F3ECE3] text-[#6F5139]"
          }`}
        >
          {isEarning ? (
            <ArrowDownToLine size={17} />
          ) : (
            <ArrowUpRight size={17} />
          )}
        </div>

        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-[#30271F]">
            {transaction.title}
          </p>

          <p className="truncate text-xs text-[#887A6D]">
            {transaction.subtitle}
          </p>

          <p className="mt-0.5 text-[11px] text-[#A09182]">
            {transaction.date} ·{" "}
            {transaction.time}
          </p>

        </div>

      </div>

      <div className="shrink-0 text-right">

        <p
          className={`text-sm font-semibold ${
            isEarning
              ? "text-[#47714E]"
              : "text-[#6F5139]"
          }`}
        >
          {isEarning ? "+" : "-"}₹
          {transaction.amount.toLocaleString(
            "en-IN"
          )}
        </p>

        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-medium text-[#71806F]">
          <CheckCircle2 size={11} />
          {transaction.status}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PAYOUTS
========================================================= */

function Payouts({
  transactions,
  onWithdraw,
}: {
  transactions: Transaction[];
  onWithdraw: () => void;
}) {
  return (
    <div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <PageHeading
          eyebrow="Your money"
          title="Payouts"
          description="Manage your withdrawals and view previous payouts."
        />

        <button
          onClick={onWithdraw}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633] sm:self-auto"
        >
          <ArrowDownToLine size={16} />
          Withdraw
        </button>

      </div>

      {/* Bank account */}
      <div className="mt-6 rounded-2xl border border-[#E3DBD1] bg-white p-5 sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
              <CreditCard size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#30271F]">
                Primary payout account
              </p>

              <p className="mt-1 text-xs text-[#827467]">
                HDFC Bank •••• 4821
              </p>
            </div>

          </div>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EDF5EE] px-2.5 py-1 text-[11px] font-semibold text-[#47714E]">
            <CheckCircle2 size={12} />
            Verified
          </span>

        </div>

      </div>

      {/* Payout history */}
      <div className="mt-5 rounded-2xl border border-[#E3DBD1] bg-white">

        <div className="border-b border-[#EEE7DF] px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-[#30271F]">
            Payout history
          </h3>
        </div>

        <div className="divide-y divide-[#EEE7DF]">

          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              large
            />
          ))}

        </div>

      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#F3ECE3] p-4">
        <Info
          size={17}
          className="mt-0.5 shrink-0 text-[#6F5139]"
        />

        <p className="text-xs leading-5 text-[#6D6054]">
          Payouts are sent to your verified bank
          account. Processing time may vary depending
          on your bank and payout method.
        </p>
      </div>

    </div>
  );
}

/* =========================================================
   PAGE HEADING
========================================================= */

function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A735D]">
        {eyebrow}
      </p>

      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#30271F]">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#74675B]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   WITHDRAW MODAL
========================================================= */

function WithdrawModal({
  availableBalance,
  amount,
  setAmount,
  onClose,
  onWithdraw,
}: {
  availableBalance: number;
  amount: string;
  setAmount: (value: string) => void;
  onClose: () => void;
  onWithdraw: () => void;
}) {
  const numericAmount = Number(amount);

  const invalid =
    amount.length > 0 &&
    (numericAmount <= 0 ||
      numericAmount > availableBalance);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30271F]/40 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl border border-[#E3DBD1] bg-white p-5 shadow-xl sm:p-6">

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A735D]">
              Withdraw
            </p>

            <h2 className="mt-1.5 text-xl font-semibold text-[#30271F]">
              Withdraw your earnings
            </h2>

            <p className="mt-1.5 text-sm text-[#786B5F]">
              Available balance:{" "}
              <span className="font-semibold text-[#5F4633]">
                ₹
                {availableBalance.toLocaleString(
                  "en-IN"
                )}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7A6B5E] hover:bg-[#F3ECE3]"
          >
            ×
          </button>

        </div>

        <div className="mt-6">

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8B7968]">
            Amount
          </label>

          <div className="relative">

            <IndianRupee
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#806B56]"
            />

            <input
              type="number"
              min="1"
              max={availableBalance}
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="Enter amount"
              className="h-12 w-full rounded-xl border border-[#E2DBD0] bg-[#FBF9F6] pl-9 pr-4 text-sm text-[#30271F] outline-none focus:border-[#8A735D] focus:ring-2 focus:ring-[#EDE3D7]"
            />

          </div>

          {invalid && (
            <p className="mt-2 text-xs font-medium text-[#9B5A4A]">
              Enter an amount between ₹1 and ₹
              {availableBalance.toLocaleString(
                "en-IN"
              )}
              .
            </p>
          )}

        </div>

        <div className="mt-5 rounded-xl bg-[#F3ECE3] p-3.5">
          <div className="flex items-start gap-2">
            <Info
              size={15}
              className="mt-0.5 shrink-0 text-[#6F5139]"
            />

            <p className="text-xs leading-5 text-[#6D6054]">
              Your withdrawal will be sent to your
              verified HDFC Bank account ending in
              4821.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#DDD3C8] px-4 py-3 text-sm font-semibold text-[#65594E] transition hover:bg-[#F7F3EC]"
          >
            Cancel
          </button>

          <button
            onClick={onWithdraw}
            disabled={
              !amount ||
              invalid
            }
            className="flex-1 rounded-xl bg-[#6F5139] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Withdrawal
          </button>

        </div>

      </div>
    </div>
  );
}