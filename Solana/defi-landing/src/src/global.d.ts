declare module "recharts";
const formatted = result.prices.map((p: [number, number]) => ({
  time: new Date(p[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  price: p[1],
}));