import { Instagram, Linkedin, Youtube } from "lucide-react";
import { whatsappQuote } from "@/lib/whatsapp";

function XLogo() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const footerColumns = [
  [
    {
      title: "Modelos",
      links: [
        "BYD ATTO 8", "BYD DOLPHIN MINI", "BYD DOLPHIN", "BYD DOLPHIN PLUS", "BYD DOLPHIN SE",
        "BYD HAN", "BYD KING DM-i", "BYD SEAL", "BYD SEALION 7", "BYD SHARK", "BYD SONG PLUS DM-i",
        "BYD SONG PLUS PREMIUM DM-i", "BYD SONG PRO DM-i FLEX", "BYD TAN", "BYD YUAN PLUS", "BYD YUAN PRO",
      ],
    },
    {
      title: "Sobre a BYD",
      links: ["Sobre a BYD", "Contato", "Notícias", "Sustentabilidade", "Confidencialidade, Compliance e Proteção de Dados"],
    },
  ],
  [
    {
      title: "Tecnologia",
      links: ["BYD Super DM", "O que é NEV?", "BYD e-Platform 3.0", "BYD Bateria Blade", "BYD DiSus", "BYD Cell to Body"],
    },
    {
      title: "Vendas",
      links: ["Ofertas BYD", "Vendas PCD", "Condições comerciais", "Calculadora de Economia", "Corrida de Vantagens Taxi e Aplicativos"],
    },
    {
      title: "Test Drive",
      links: ["Agende agora"],
    },
  ],
  [
    {
      title: "Baixe o App BYD",
      links: ["Android", "Apple iOS"],
    },
    {
      title: "Atendimento ao cliente",
      links: ["Central de Relacionamento", "Perguntas frequentes CRC"],
    },
    {
      title: "Pós Vendas",
      links: ["Serviço de Manutenção", "Chave digital", "BYD Assistance", "Regulamento Raízen", "Legislação e Segurança", "Blindagem certificada", "BYD Club"],
    },
  ],
];

export default function BydFooter() {
  return (
    <>
      <footer className="site-footer byd-footer">
        <div className="container byd-footer-columns">
          {footerColumns.map((groups, columnIndex) => (
            <div className="byd-footer-col" key={columnIndex}>
              {groups.map((group) => (
                <div className="byd-footer-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.links.map((link) => (
                      <li key={link}><a href="#">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="container byd-footer-legal">
          <nav className="byd-footer-legal-links" aria-label="Links legais">
            <a href="#">Política da Privacidade</a>
            <a href="#">Política de Cookies</a>
            <a href="#">Termos de uso</a>
            <a href="#">Mapa do Site</a>
          </nav>
          <div className="byd-footer-social">
            <span>Siga a BYD</span>
            <a href="#" aria-label="X (Twitter)"><XLogo /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={20} /></a>
          </div>
        </div>

        <div className="container byd-footer-copyright">
          <p>© 2026 BYD Brasil - Todos os direitos reservados.</p>
          <p>BYD do Brasil Ltda, com sede em Avenida Antonio Buscato, 230, Terminal Intermodal de Cargas (TIC) em Campinas/SP, 13.069-119, inscrita no CNPJ/MF sob o nº 17.140.820/0002-62.</p>
          <p>Desacelere. Seu bem maior é a vida.</p>
        </div>
      </footer>

      <a className="byd-whatsapp" href={whatsappQuote()} target="_blank" rel="noreferrer" aria-label="Fale conosco no WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
