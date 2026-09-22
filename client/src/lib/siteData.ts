export type Vehicle = {
  name: string;
  category: string;
  range: string;
  price: string;
  image: string;
  accent: string;
  offer: string;
};

const byd = "https://www.byd.com/material";
const headerImg = `${byd}/byd-site/america-public/header-product-image`;

export const vehicles: Vehicle[] = [
  { name: "BYD SONG PRO DM-i FLEX", category: "SUV híbrido", range: "1.100 km", price: "A partir de R$ 159.800", image: `${byd}/__CN/byd-site/br/product/songpro-flex/byd-song-pro-flex-HEADER-3.png`, accent: "#d8e9e5", offer: "Taxa especial + bônus de troca" },
  { name: "BYD ATTO 2 DM-i", category: "SUV compacto", range: "1.000 km", price: "A partir de R$ 119.800", image: `${byd}/byd-site/br/product/atto-2-dmi/atto2-header.webp`, accent: "#e5e4df", offer: "Condições exclusivas" },
  { name: "BYD SEALION 7", category: "SUV elétrico", range: "440 km", price: "A partir de R$ 269.800", image: `${byd}/byd-site/br/product/sealion/imagens/header/Sealion7-header.webp`, accent: "#dfe6ec", offer: "Bônus de carregador" },
  { name: "BYD DOLPHIN SE", category: "Hatch elétrico", range: "405 km", price: "A partir de R$ 119.800", image: `${byd}/byd-site/br/product/dolphin-se/menu-dolphin-se-4.png`, accent: "#dcece8", offer: "Oferta de lançamento" },
  { name: "BYD SONG PLUS", category: "SUV híbrido", range: "1.200 km", price: "A partir de R$ 239.800", image: `${headerImg}/Header-BYD-SONG-PLUS.png`, accent: "#e8e2dc", offer: "Entrada facilitada" },
  { name: "BYD SHARK", category: "Picape híbrida", range: "840 km", price: "A partir de R$ 379.800", image: `${headerImg}/Header-BYD-SHARK.png`, accent: "#d9e1e5", offer: "Consulte condições" },
  { name: "BYD DOLPHIN MINI", category: "Compacto elétrico", range: "280 km", price: "A partir de R$ 118.800", image: `${headerImg}/small-pic.png`, accent: "#e8eee9", offer: "Condição para pessoa física" },
  { name: "BYD KING", category: "Sedan híbrido", range: "1.200 km", price: "A partir de R$ 175.800", image: `${byd}/byd-site/br/product/king/king-Header1.png`, accent: "#e7e4df", offer: "Taxa promocional" },
];

export const states = ["Todos os estados", "Acre", "Alagoas", "Bahia", "Ceará", "Distrito Federal", "Goiás", "Minas Gerais", "Paraná", "Pernambuco", "Rio de Janeiro", "Rio Grande do Sul", "Santa Catarina", "São Paulo"];
export const segments = ["Todos", "Promocional", "PCD", "Pessoa Jurídica", "Taxista"];
