import { useMemo, useState } from "react";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Clock3,
  Receipt,
  Download,
  Plus,
  Trash2,
  ShieldCheck,
  CalendarDays,
  ArrowUpRight,
  WalletCards,
  X,
  CircleHelp,
} from "lucide-react";
import { Link } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type PaymentStatus = "Paid" | "Pending" | "Refunded";

type Transaction = {
  id: string;
  service: string;
  senior: string;
  companion: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
};

type PaymentMethod = {
  id: string;
  type: "card" | "upi";
  name: string;
  details: string;
  expiry?: string;
  primary?: boolean;
};

const transactions: Transaction[] = [
  {
    id: "TXN-1001",
    service: "Social Companionship",
    senior: "Mrs. Sharma",
    companion: "Ananya",
    date: "04 Oct 2026",
    amount: 600,
    status: "Paid",
    paymentMethod: "UPI · prince@upi",
  },
  {
    id: "TXN-1002",
    service: "Outing Companionship",
    senior: "Mr. Saxena",
    companion: "Rajiv Mehta",
    date: "03 Oct 2026",
    amount: 900,
    status: "Paid",
    paymentMethod: "Visa · •••• 4242",
  },
  {
    id: "TXN-1003",
    service: "Hobbies & Interests",
    senior: "Mrs. Sharma",
    companion: "Ananya",
    date: "28 Sep 2026",
    amount: 600,
    status: "Paid",
    paymentMethod: "UPI · prince@upi",
  },
  {
    id: "TXN-1004",
    service: "Social Companionship",
    senior: "Mr. Saxena",
    companion: "Rajiv Mehta",
    date: "25 Sep 2026",
    amount: 600,
    status: "Refunded",
    paymentMethod: "Visa · •••• 4242",
  },
  {
    id: "TXN-1005",
    service: "Non-Medical Support",
    senior: "Mrs. Sharma",
    companion: "Ananya",
    date: "22 Sep 2026",
    amount: 750,
    status: "Paid",
    paymentMethod: "UPI · prince@upi",
  },
  {
    id: "TXN-1006",
    service: "Tech Companionship",
    senior: "Mr. Saxena",
    companion: "Rajiv Mehta",
    date: "18 Sep 2026",
    amount: 500,
    status: "Pending",
    paymentMethod: "Visa · •••• 4242",
  },
];

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "upi-1",
    type: "upi",
    name: "UPI",
    details: "prince@upi",
    primary: true,
  },
  {
    id: "card-1",
    type: "card",
    name: "Visa",
    details: "•••• 4242",
    expiry: "Expires 08/28",
  },
];

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getStatusClasses(status: PaymentStatus) {
  switch (status) {
    case "Paid":
      return "bg-[#E8F0E9] text-[#58705A]";

    case "Refunded":
      return "bg-[#F3ECE3] text-[#76563C]";

    case "Pending":
      return "bg-[#F7EDEA] text-[#8A513B]";

    default:
      return "bg-[#F3ECE3] text-[#76563C]";
  }
}

export default function Payments() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialPaymentMethods
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [methodType, setMethodType] = useState<"upi" | "card">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const paidAmount = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.status === "Paid")
        .reduce((total, transaction) => total + transaction.amount, 0),
    []
  );

  const pendingAmount = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.status === "Pending")
        .reduce((total, transaction) => total + transaction.amount, 0),
    []
  );

  const refundedAmount = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.status === "Refunded")
        .reduce((total, transaction) => total + transaction.amount, 0),
    []
  );

  const visibleTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 4);

  const addPaymentMethod = () => {
    if (methodType === "upi") {
      if (!upiId.trim()) return;

      const newMethod: PaymentMethod = {
        id: `upi-${Date.now()}`,
        type: "upi",
        name: "UPI",
        details: upiId.trim(),
      };

      setPaymentMethods((current) => [...current, newMethod]);
    } else {
      if (!cardNumber.trim() || !cardName.trim()) return;

      const lastFour = cardNumber.replace(/\D/g, "").slice(-4);

      const newMethod: PaymentMethod = {
        id: `card-${Date.now()}`,
        type: "card",
        name: "Visa",
        details: `•••• ${lastFour || "0000"}`,
        expiry: "Expires 08/28",
      };

      setPaymentMethods((current) => [...current, newMethod]);
    }

    setUpiId("");
    setCardNumber("");
    setCardName("");
    setShowAddModal(false);
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((current) =>
      current.filter((method) => method.id !== id)
    );
  };

  const setPrimaryMethod = (id: string) => {
    setPaymentMethods((current) =>
      current.map((method) => ({
        ...method,
        primary: method.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6F5139] text-white">
                  <WalletCards size={19} />
                </div>

                <span className="text-sm font-medium text-[#76563C]">
                  Family Payments
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Payments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756A60] sm:text-base">
                Manage your payment methods, track companionship spending,
                and view your transaction history.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              <Plus size={17} />
              Add Payment Method
            </button>
          </div>
        </section>

        {/* Payment summary */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Total Spent</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatCurrency(paidAmount)}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <IndianRupee size={19} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#94887B]">
              Completed payments
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Pending</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatCurrency(pendingAmount)}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EDEA] text-[#8A513B]">
                <Clock3 size={19} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#8A7166]">
              Awaiting payment completion
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Refunded</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatCurrency(refundedAmount)}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#76563C]">
                <ArrowUpRight size={19} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#94887B]">
              Returned to your account
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Payment Methods</p>
                <p className="mt-1 text-2xl font-semibold">
                  {paymentMethods.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <CreditCard size={19} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#94887B]">
              Saved payment options
            </p>
          </div>
        </section>

        {/* Payment methods */}
        <section className="mb-8 rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#E8E1D7] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                Payment Methods
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Saved payment options
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E2DBD0] px-4 py-2.5 text-sm font-medium text-[#6F5139] transition hover:bg-[#F3ECE3]"
            >
              <Plus size={16} />
              Add new
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:p-6 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="rounded-2xl border border-[#E2DBD0] bg-[#FBF8F3] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#6F5139]">
                      {method.type === "upi" ? (
                        <WalletCards size={19} />
                      ) : (
                        <CreditCard size={19} />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{method.name}</p>

                        {method.primary && (
                          <span className="rounded-full bg-[#E8F0E9] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#58705A]">
                            Primary
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-[#756A60]">
                        {method.details}
                      </p>

                      {method.expiry && (
                        <p className="mt-1 text-xs text-[#94887B]">
                          {method.expiry}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePaymentMethod(method.id)}
                    className="rounded-lg p-2 text-[#9A8E82] transition hover:bg-[#F7EDEA] hover:text-[#8A513B]"
                    aria-label={`Remove ${method.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {!method.primary && (
                  <button
                    type="button"
                    onClick={() => setPrimaryMethod(method.id)}
                    className="mt-4 text-xs font-semibold text-[#6F5139] hover:text-[#5F4633]"
                  >
                    Make primary
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-[#D8CEC1] bg-[#FCFAF7] p-5 text-[#6F5139] transition hover:bg-[#F3ECE3]"
            >
              <div className="text-center">
                <Plus className="mx-auto" size={22} />

                <p className="mt-2 text-sm font-semibold">
                  Add another payment method
                </p>

                <p className="mt-1 text-xs text-[#94887B]">
                  UPI or card
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Transactions */}
        <section className="mb-8 rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#E8E1D7] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                Transactions
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Payment history
              </h2>
            </div>

            <span className="text-sm text-[#8A8075]">
              {transactions.length} transactions
            </span>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EEE8DF] bg-[#FCFAF7] text-left text-xs uppercase tracking-wide text-[#8A8075]">
                  <th className="px-6 py-4 font-medium">Transaction</th>
                  <th className="px-6 py-4 font-medium">Senior</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Method</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>

              <tbody>
                {visibleTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-[#F0EBE4] last:border-0"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">
                        {transaction.service}
                      </p>

                      <p className="mt-1 text-xs text-[#94887B]">
                        {transaction.id} · {transaction.companion}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#5F574F]">
                      {transaction.senior}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#5F574F]">
                      {transaction.date}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#5F574F]">
                      {transaction.paymentMethod}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTransaction(transaction)
                        }
                        className="rounded-lg p-2 text-[#6F5139] transition hover:bg-[#F3ECE3]"
                        aria-label="View transaction"
                      >
                        <Receipt size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile transaction cards */}
          <div className="divide-y divide-[#EEE8DF] md:hidden">
            {visibleTransactions.map((transaction) => (
              <button
                key={transaction.id}
                type="button"
                onClick={() => setSelectedTransaction(transaction)}
                className="block w-full p-5 text-left transition hover:bg-[#FCFAF7]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      {transaction.service}
                    </p>

                    <p className="mt-1 text-xs text-[#94887B]">
                      {transaction.senior} · {transaction.date}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>

                  <span className="text-xs font-medium text-[#6F5139]">
                    View receipt
                  </span>
                </div>
              </button>
            ))}
          </div>

          {transactions.length > 4 && (
            <div className="border-t border-[#E8E1D7] p-4 text-center">
              <button
                type="button"
                onClick={() =>
                  setShowAllTransactions((current) => !current)
                }
                className="text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]"
              >
                {showAllTransactions
                  ? "Show fewer transactions"
                  : "View all transactions"}
              </button>
            </div>
          )}
        </section>

        {/* Billing information */}
        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <Receipt size={19} />
              </div>

              <div>
                <h2 className="font-semibold">Billing & invoices</h2>
                <p className="mt-1 text-xs text-[#8A8075]">
                  Keep track of your payment records
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-[#FBF8F3] p-3.5">
                <div className="flex items-center gap-3">
                  <CalendarDays size={16} className="text-[#6F5139]" />
                  <div>
                    <p className="text-sm font-medium">
                      October 2026 statement
                    </p>
                    <p className="text-xs text-[#94887B]">
                      4 transactions
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-lg p-2 text-[#6F5139] hover:bg-[#F3ECE3]"
                  aria-label="Download October statement"
                >
                  <Download size={17} />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#FBF8F3] p-3.5">
                <div className="flex items-center gap-3">
                  <CalendarDays size={16} className="text-[#6F5139]" />
                  <div>
                    <p className="text-sm font-medium">
                      September 2026 statement
                    </p>
                    <p className="text-xs text-[#94887B]">
                      6 transactions
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-lg p-2 text-[#6F5139] hover:bg-[#F3ECE3]"
                  aria-label="Download September statement"
                >
                  <Download size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DDE4DC] bg-[#F3F7F2] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#58705A]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#4F6753]">
                  Secure payments
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#657267]">
                  Your payment information is protected. EverSenior's
                  prototype payment interface does not store complete card
                  numbers or sensitive banking credentials.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#58705A]">
              <CheckCircle2 size={14} />
              Payment security enabled
            </div>
          </div>
        </section>

        {/* Help */}
        <section className="rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#6F5139]">
                <CircleHelp size={20} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Have a question about a payment?
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#756A60]">
                  Our customer care team can help with payments, refunds,
                  invoices, and transaction concerns.
                </p>
              </div>
            </div>

            <Link
              to="/family/customer-care"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              Contact Customer Care
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#E2DBD0] pt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#6F5139]">
            <ShieldCheck size={15} />
            <span>Simple, transparent and secure payments.</span>
          </div>

          <p className="mt-2 text-xs text-[#94887B]">
            EverSenior keeps your family informed about every payment.
          </p>
        </footer>
      </main>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30271F]/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E8E1D7] p-5">
              <div>
                <h2 className="font-semibold">Add Payment Method</h2>

                <p className="mt-1 text-xs text-[#756A60]">
                  Choose how you'd like to pay.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-[#8A8075] hover:bg-[#F3ECE3]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F3ECE3] p-1">
                <button
                  type="button"
                  onClick={() => setMethodType("upi")}
                  className={`rounded-lg py-2.5 text-sm font-medium transition ${
                    methodType === "upi"
                      ? "bg-white text-[#6F5139] shadow-sm"
                      : "text-[#756A60]"
                  }`}
                >
                  UPI
                </button>

                <button
                  type="button"
                  onClick={() => setMethodType("card")}
                  className={`rounded-lg py-2.5 text-sm font-medium transition ${
                    methodType === "card"
                      ? "bg-white text-[#6F5139] shadow-sm"
                      : "text-[#756A60]"
                  }`}
                >
                  Card
                </button>
              </div>

              {methodType === "upi" ? (
                <div className="mt-5">
                  <label
                    htmlFor="upi-id"
                    className="mb-2 block text-sm font-medium"
                  >
                    UPI ID
                  </label>

                  <input
                    id="upi-id"
                    value={upiId}
                    onChange={(event) => setUpiId(event.target.value)}
                    placeholder="example@upi"
                    className="w-full rounded-xl border border-[#DED6CB] bg-[#FBF8F3] px-4 py-3 text-sm outline-none transition placeholder:text-[#A49A8E] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
                  />
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="card-name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Name on card
                    </label>

                    <input
                      id="card-name"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      placeholder="Cardholder name"
                      className="w-full rounded-xl border border-[#DED6CB] bg-[#FBF8F3] px-4 py-3 text-sm outline-none transition placeholder:text-[#A49A8E] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="card-number"
                      className="mb-2 block text-sm font-medium"
                    >
                      Card number
                    </label>

                    <input
                      id="card-number"
                      value={cardNumber}
                      onChange={(event) =>
                        setCardNumber(event.target.value)
                      }
                      placeholder="1234 5678 9012 4242"
                      inputMode="numeric"
                      className="w-full rounded-xl border border-[#DED6CB] bg-[#FBF8F3] px-4 py-3 text-sm outline-none transition placeholder:text-[#A49A8E] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F3F7F2] p-3 text-xs leading-5 text-[#657267]">
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-[#58705A]"
                />
                This is a prototype payment interface. Do not enter real
                financial credentials.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#E8E1D7] p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#6B6258] hover:bg-[#F3ECE3]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={addPaymentMethod}
                disabled={
                  methodType === "upi"
                    ? !upiId.trim()
                    : !cardNumber.trim() || !cardName.trim()
                }
                className="rounded-xl bg-[#6F5139] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30271F]/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E8E1D7] p-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                  <Receipt size={19} />
                </div>

                <div>
                  <h2 className="font-semibold">Transaction Details</h2>

                  <p className="mt-1 text-xs text-[#94887B]">
                    {selectedTransaction.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-[#8A8075] hover:bg-[#F3ECE3]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              <div className="rounded-xl bg-[#FBF8F3] p-4 text-center">
                <p className="text-xs text-[#8A8075]">Amount</p>

                <p className="mt-1 text-3xl font-semibold">
                  {formatCurrency(selectedTransaction.amount)}
                </p>

                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                    selectedTransaction.status
                  )}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#EEE8DF] py-3">
                <span className="text-sm text-[#756A60]">Service</span>
                <span className="text-right text-sm font-medium">
                  {selectedTransaction.service}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#EEE8DF] py-3">
                <span className="text-sm text-[#756A60]">Senior</span>
                <span className="text-sm font-medium">
                  {selectedTransaction.senior}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#EEE8DF] py-3">
                <span className="text-sm text-[#756A60]">Companion</span>
                <span className="text-sm font-medium">
                  {selectedTransaction.companion}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#EEE8DF] py-3">
                <span className="text-sm text-[#756A60]">Date</span>
                <span className="text-sm font-medium">
                  {selectedTransaction.date}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-[#756A60]">
                  Payment method
                </span>
                <span className="text-right text-sm font-medium">
                  {selectedTransaction.paymentMethod}
                </span>
              </div>
            </div>

            <div className="border-t border-[#E8E1D7] p-4">
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="w-full rounded-xl bg-[#6F5139] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}