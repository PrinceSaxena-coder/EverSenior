import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, Heart, MapPin, ShieldCheck, Users, UserRound, RefreshCw } from "lucide-react";
import FamilyNavbar from "./FamilyNavbar";
import { apiRequest } from "../../api/client";

type AccessItem = {
  access: {
    id: string;
    seniorId: string;
    relationship: string;
    permissions: string[];
    status: "pending" | "active" | "revoked";
    acceptedAt?: string;
  };
};
type AccessResponse = { accesses?: AccessItem[] };
type SeniorProfileResponse = {
  senior: { id: string; name: string };
  profile: { age?: number; city?: string; bio?: string };
};
type SeniorCard = {
  id: string;
  name: string;
  age?: number;
  relationship: string;
  location: string;
  status: "pending" | "active" | "revoked";
  bio: string;
};

export default function MySeniors() {
  const [seniors, setSeniors] = useState<SeniorCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSeniors = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<AccessResponse>("/family/access");
      const records = response.accesses ?? [];
      const cards = await Promise.all(records.map(async ({ access }): Promise<SeniorCard> => {
        const base: SeniorCard = {
          id: access.seniorId,
          name: access.status === "active" ? "Loading senior…" : "Senior access request",
          relationship: access.relationship || "Family member",
          location: "Not available",
          status: access.status,
          bio: "",
        };
        if (access.status !== "active" || !access.permissions?.includes("view_profile")) return base;
        try {
          const data = await apiRequest<SeniorProfileResponse>(`/family/seniors/${encodeURIComponent(access.seniorId)}/profile`);
          return {
            ...base,
            name: data.senior.name || "Senior",
            age: data.profile.age,
            location: data.profile.city || "Location not provided",
            bio: data.profile.bio || "",
          };
        } catch {
          return { ...base, name: "Senior profile unavailable" };
        }
      }));
      setSeniors(cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load linked seniors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadSeniors(); }, []);
  const activeCount = seniors.filter((senior) => senior.status === "active").length;
  const pendingCount = seniors.filter((senior) => senior.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar userName={localStorage.getItem("userName") || "Family"} />
      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8A715D]">Family</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Seniors</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#756658] sm:text-base">Manage the seniors connected to your family account and review access status.</p></div>
          <button type="button" onClick={() => void loadSeniors()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#5F4633] disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""}/> Refresh</button>
        </section>
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Summary icon={<Users size={21}/>} label="Linked Seniors" value={seniors.length} detail="Access records" />
          <Summary icon={<Heart size={21}/>} label="Active Access" value={activeCount} detail="Authorized profiles" />
          <Summary icon={<Activity size={21}/>} label="Pending Requests" value={pendingCount} detail="Awaiting acceptance" />
        </section>
        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
        {loading ? <div className="rounded-2xl border border-[#E2DBD0] bg-white p-10 text-center text-sm text-[#756658]">Loading linked seniors…</div> : seniors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D8CEC2] bg-white p-10 text-center"><Users className="mx-auto h-10 w-10 text-[#8A715D]"/><h2 className="mt-4 text-xl font-bold">No linked seniors yet</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#756658]">A senior needs to authorize your family account before their profile appears here. After they send the access request, they must accept it from their account.</p></div>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {seniors.map((senior) => <article key={senior.id} className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8DED1] text-[#6F5139]"><UserRound size={22}/></div><div><h2 className="font-bold">{senior.name}</h2><p className="mt-1 text-xs text-[#817366]">{senior.relationship}{senior.age ? ` · ${senior.age} years` : ""}</p></div></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${senior.status === "active" ? "bg-[#EEF4EA] text-[#526B4D]" : senior.status === "pending" ? "bg-amber-50 text-amber-800" : "bg-gray-100 text-gray-600"}`}>{senior.status}</span></div>
              <p className="mt-4 flex items-center gap-2 text-sm text-[#756658]"><MapPin size={15}/>{senior.location}</p>
              {senior.bio && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#756658]">{senior.bio}</p>}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-[#EEE8E0] pt-4">{senior.status === "active" && senior.id && <><Link to={`/family/seniors/${senior.id}`} className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9D0C5] px-3 py-2 text-sm font-semibold text-[#5F4633] hover:bg-[#F7F3EC]">View profile <ArrowRight size={14}/></Link><Link to="/family/companions" className="inline-flex items-center gap-1.5 rounded-xl bg-[#6F5139] px-3 py-2 text-sm font-semibold text-white hover:bg-[#5F4633]"><ShieldCheck size={14}/> Find companion</Link></>}</div>
            </article>)}
          </section>
        )}
      </main>
    </div>
  );
}

function Summary({ icon, label, value, detail }: { icon: ReactNode; label: string; value: number; detail: string }) {
  return <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-[#857668]">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">{icon}</div></div><p className="mt-4 text-xs font-medium text-[#6F5139]">{detail}</p></div>;
}
