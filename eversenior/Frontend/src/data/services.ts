import { img } from "./images";
export interface Service { title: string; text: string; image: string; alt: string }
export const services: Service[] = [
  { title: "Discover the joy of quality time", text: "Long chats over chai, old songs, family stories. Our companions listen first and talk second.", image: img.time, alt: "A grandmother and a young companion laughing over tea" },
  { title: "Bridge the generation gap", text: "Video calls, payments, photos on the phone. We teach patiently, at the pace you set.", image: img.tech, alt: "A young person showing an elderly man a smartphone" },
  { title: "Find joy in walking together", text: "A slow evening loop around the park, with company and a steady arm.", image: img.walk, alt: "Two people walking in a park" },
  { title: "Companionship for daily tasks", text: "Groceries, pharmacy runs, bank visits. Errands feel lighter with someone beside you.", image: img.tasks, alt: "A young woman helping a senior shop for vegetables" },
  { title: "Discover the thrill of something new", text: "A film, a museum, a first ride on the metro. Outings that bring back curiosity.", image: img.new, alt: "A senior woman smiling during an outing" },
  { title: "Join our exclusive gatherings", text: "Festivals, games afternoons and potlucks where Grandpals meet each other.", image: img.gather, alt: "A group gathered around a table" },
];
