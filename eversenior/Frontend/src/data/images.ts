// Placeholder photography (Unsplash). Swap for your own licensed photos in production.
const u = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
export const img = {
  hero: u("1581579438747-1dc8d17bbce4", 1800), time: u("1516307365426-bea591f05011"), tech: u("1559526324-4b87b5e36e44"),
  walk: u("1544027993-37dbfe43562a"), tasks: u("1576765608535-5f04d1e3f289"), new: u("1573497019940-1c28c88b4f3e"),
  gather: u("1511895426328-dc8714191300"), event: u("1529156069898-49953e39b3ac", 1800),
};
