import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import BydHeader from "@/components/BydHeader";
import BydFooter from "@/components/BydFooter";
import { submitLead } from "@/lib/leadStore";
import { trackLead } from "@/lib/metaPixel";

const models = [
  "BYD DOLPHIN MINI", "BYD DOLPHIN", "BYD DOLPHIN PLUS", "BYD DOLPHIN SE", "BYD HAN", "BYD SEAL",
  "BYD SEALION 7", "BYD TAN", "BYD YUAN PLUS", "BYD YUAN PRO", "BYD ATTO 2 DM-i", "BYD ATTO 8",
  "BYD KING DM-i", "BYD SHARK", "BYD SONG PLUS DM-i", "BYD SONG PLUS PREMIUM DM-i", "BYD SONG PRO DM-i FLEX",
];

const dealers = [
  "BYD Ibirapuera - São Paulo/SP",
  "BYD Campinas - Campinas/SP",
  "BYD Barra da Tijuca - Rio de Janeiro/RJ",
  "BYD Savassi - Belo Horizonte/MG",
  "BYD Batel - Curitiba/PR",
];

const dddOptions = ["11", "19", "21", "27", "31", "41", "47", "51", "61", "62", "71", "81", "85"];

export default function TestDrive() {
  const [model, setModel] = useState("");
  const [taxType, setTaxType] = useState("CPF");
  const [ddd, setDdd] = useState("");
  const [dealer, setDealer] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accepted) {
      toast("Aceite os Termos de Uso e a Política de Privacidade.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    try {
      await submitLead({
        model: model || null,
        firstName: String(data.get("firstName") ?? "").trim(),
        lastName: String(data.get("lastName") ?? "").trim(),
        phone: `+55 (${ddd}) ${String(data.get("phone") ?? "").replace(/\D/g, "")}`,
        email: String(data.get("email") ?? "").trim(),
        personType: taxType === "CNPJ" ? "juridica" : "fisica",
        document: String(data.get("document") ?? "").trim(),
        cep: String(data.get("cep") ?? "").trim() || null,
        details: [String(data.get("details") ?? "").trim(), dealer ? `Concessionária: ${dealer}` : ""].filter(Boolean).join(" | ") || null,
      });
      trackLead(
        { content_name: model },
        {
          email: String(data.get("email") ?? ""),
          phone: `+55${ddd}${String(data.get("phone") ?? "").replace(/\D/g, "")}`,
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          zip: String(data.get("cep") ?? ""),
        },
      );
      toast("Solicitação enviada. Um especialista BYD entrará em contato.");
      form.reset();
      setModel("");
      setTaxType("CPF");
      setDdd("");
      setDealer("");
      setAccepted(false);
    } catch (error) {
      toast(`Erro ao enviar: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="site-shell byd-home byd-td-page">
      <BydHeader />

      <section className="byd-td-banner">
        <picture>
          <source media="(max-width: 768px)" srcSet="https://www.byd.com/material/byd-site/br/test-drive/New_Test_Drive_Img_Mob.png" />
          <img src="https://www.byd.com/material/byd-site/br/test-drive/New_Test_Drive_Img_Desk.png" alt="Agende seu test drive BYD" />
        </picture>
      </section>

      <section className="byd-td-body">
        <form className="byd-td-form" onSubmit={submit}>
          <h1 className="byd-td-title">Selecione o modelo</h1>

          <div className="byd-td-field">
            <label htmlFor="td-model">Modelo*</label>
            <select id="td-model" required value={model} onChange={(event) => setModel(event.target.value)}>
              <option value="" disabled>Selecione seu modelo</option>
              {models.map((name) => <option key={name}>{name}</option>)}
            </select>
          </div>

          <div className="byd-td-row">
            <div className="byd-td-field">
              <label htmlFor="td-first">Nome*</label>
              <input id="td-first" name="firstName" required placeholder="Nome*" maxLength={64} />
            </div>
            <div className="byd-td-field">
              <label htmlFor="td-last">Sobrenome*</label>
              <input id="td-last" name="lastName" required placeholder="Sobrenome*" maxLength={64} />
            </div>
          </div>

          <div className="byd-td-row">
            <div className="byd-td-field">
              <label htmlFor="td-tax-type">Documento</label>
              <select id="td-tax-type" value={taxType} onChange={(event) => setTaxType(event.target.value)}>
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>
            </div>
            <div className="byd-td-field">
              <label htmlFor="td-tax">{taxType}*</label>
              <input id="td-tax" name="document" required placeholder={taxType === "CPF" ? "xxx.xxx.xxx-xx" : "xx.xxx.xxx/xxxx-xx"} maxLength={20} />
            </div>
          </div>

          <div className="byd-td-field">
            <label>Telefone*</label>
            <div className="byd-td-phone">
              <span className="byd-td-phone-country">Brasil +55</span>
              <select aria-label="DDD" required value={ddd} onChange={(event) => setDdd(event.target.value)}>
                <option value="" disabled>DDD</option>
                {dddOptions.map((code) => <option key={code}>{code}</option>)}
              </select>
              <input name="phone" required placeholder="99999-9999*" maxLength={20} />
            </div>
          </div>

          <div className="byd-td-field">
            <label htmlFor="td-email">E-mail*</label>
            <input id="td-email" name="email" type="email" required placeholder="voce@email.com" maxLength={64} />
          </div>

          <div className="byd-td-field">
            <label htmlFor="td-cep">CEP*</label>
            <input id="td-cep" name="cep" required placeholder="Insira seu CEP*" maxLength={9} />
          </div>

          <div className="byd-td-field">
            <label htmlFor="td-dealer">Concessionária BYD mais próxima*</label>
            <select id="td-dealer" required value={dealer} onChange={(event) => setDealer(event.target.value)}>
              <option value="" disabled>Selecione um concessionário</option>
              {dealers.map((name) => <option key={name}>{name}</option>)}
            </select>
          </div>

          <div className="byd-td-field">
            <label htmlFor="td-question">Observações</label>
            <textarea id="td-question" name="details" rows={4} maxLength={200} placeholder="Conte-nos mais sobre o seu interesse" />
          </div>

          <p className="byd-td-tip">*Informações obrigatórias. Em breve um especialista BYD entrará em contato. Imagens meramente ilustrativas.</p>

          <label className="byd-td-check">
            <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
            <span>Ao enviar este formulário, eu li e concordei com os <a href="#">Termos de Uso</a> e a <a href="#">Política de Privacidade</a>.</span>
          </label>

          <button className="byd-td-submit" type="submit" disabled={submitting}>
            {submitting ? <><Loader2 className="byd-admin-spin" size={15} /> Enviando...</> : "Enviar"}
          </button>
        </form>
      </section>

      <BydFooter />
    </main>
  );
}
