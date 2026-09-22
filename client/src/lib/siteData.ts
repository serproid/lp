export type Vehicle = {
  name: string;
  category: string;
  range: string;
  price: string;
  image: string;
  accent: string;
  offer: string;
};

export const vehicles: Vehicle[] = [
  { name: "BYD SONG PRO DM-i FLEX", category: "SUV híbrido", range: "1.100 km", price: "A partir de R$ 159.800", image: "/manus-storage/song-pro_552b7b40.webp", accent: "#d8e9e5", offer: "Taxa especial + bônus de troca" },
  { name: "BYD ATTO 2 DM-i", category: "SUV compacto", range: "1.000 km", price: "A partir de R$ 119.800", image: "/manus-storage/atto2_81dc1a55.webp", accent: "#e5e4df", offer: "Condições exclusivas" },
  { name: "BYD SEALION 7", category: "SUV elétrico", range: "440 km", price: "A partir de R$ 269.800", image: "/manus-storage/sealion7_2c4cd9a7.jpg", accent: "#dfe6ec", offer: "Bônus de carregador" },
  { name: "BYD DOLPHIN SE", category: "Hatch elétrico", range: "405 km", price: "A partir de R$ 119.800", image: "/manus-storage/dolphin-se_7389ef64.webp", accent: "#dcece8", offer: "Oferta de lançamento" },
  { name: "BYD SONG PLUS", category: "SUV híbrido", range: "1.200 km", price: "A partir de R$ 239.800", image: "/manus-storage/song-plus_5aba3160.webp", accent: "#e8e2dc", offer: "Entrada facilitada" },
  { name: "BYD SHARK", category: "Picape híbrida", range: "840 km", price: "A partir de R$ 379.800", image: "/manus-storage/shark_b3e04feb.webp", accent: "#d9e1e5", offer: "Consulte condições" },
  { name: "BYD DOLPHIN MINI", category: "Compacto elétrico", range: "280 km", price: "A partir de R$ 118.800", image: "/manus-storage/dolphin-mini_99777cc2.webp", accent: "#e8eee9", offer: "Condição para pessoa física" },
  { name: "BYD KING", category: "Sedan híbrido", range: "1.200 km", price: "A partir de R$ 175.800", image: "/manus-storage/king_b649b2fc.webp", accent: "#e7e4df", offer: "Taxa promocional" },
];

export const states = ["Todos os estados", "Acre", "Alagoas", "Bahia", "Ceará", "Distrito Federal", "Goiás", "Minas Gerais", "Paraná", "Pernambuco", "Rio de Janeiro", "Rio Grande do Sul", "Santa Catarina", "São Paulo"];
export const segments = ["Todos", "Promocional", "PCD", "Pessoa Jurídica", "Taxista"];
