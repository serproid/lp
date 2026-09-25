import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useSearch } from "wouter";
import { toast } from "sonner";
import BydHeader from "@/components/BydHeader";
import BydFooter from "@/components/BydFooter";
import { offerCitiesByState, offerStates, offers } from "@/lib/offersData";
import { brl, usePriceOverrides } from "@/lib/priceStore";
import { submitLead, type PersonType } from "@/lib/leadStore";
import { trackLead } from "@/lib/metaPixel";

const dddOptions = ["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "99"];

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function maskDocument(value: string, type: PersonType) {
  const digits = value.replace(/\D/g, "").slice(0, type === "fisica" ? 11 : 14);
  if (type === "fisica") {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
}

function maskCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export default function OfertaSelecionada() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const id = params.get("id") || "";
  const model = params.get("modelo") || "";

  const overrides = usePriceOverrides();

  const offer = useMemo(() => {
    if (id) {
      const byId = offers.find((item) => item.id === id);
      if (byId) return byId;
    }
    if (!model) return null;
    const normalized = model.toLowerCase();
    return (
      offers.find((item) => `${item.model} ${item.year}`.toLowerCase() === normalized) ??
      offers.find((item) => item.model.toLowerCase() === normalized) ??
      null
    );
  }, [id, model]);

  const title = offer ? `${offer.model} ${offer.year}` : model || "Oferta selecionada";
  const override = offer ? overrides[offer.id] : undefined;
  const crm = offer ? override?.crmPrice ?? offer.crmPrice : null;
  const por = offer ? (override?.discountPrice !== undefined ? override.discountPrice : offer.discountPrice) : null;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ddd, setDdd] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [personType, setPersonType] = useState<PersonType>("fisica");
  const [document, setDocument] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cep, setCep] = useState("");
  const [details, setDetails] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const cities = state ? offerCitiesByState[state] ?? [] : [];

  const changePersonType = (type: PersonType) => {
    setPersonType(type);
    setDocument((current) => maskDocument(current, type));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accepted) {
      toast("Aceite os Termos de Uso e a Política de Privacidade.");
      return;
    }
    if (!ddd || phone.replace(/\D/g, "").length < 8) {
      toast("Informe um telefone válido com DDD.");
      return;
    }
    setSubmitting(true);
    try {
      await submitLead({
        offerId: offer?.id ?? id ?? null,
        model: offer ? `${offer.model} ${offer.year}` : model || null,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: `+55 (${ddd}) ${phone}`,
        email: email.trim(),
        personType,
        document,
        state: state || null,
        city: city || null,
        cep: cep || null,
        details: details.trim() || null,
      });
      trackLead(
        {
          content_name: title,
          content_ids: offer ? [offer.id] : undefined,
          value: por ?? undefined,
          currency: "BRL",
        },
        {
          email,
          phone: `+55${ddd}${phone.replace(/\D/g, "")}`,
          firstName,
          lastName,
          city,
          state,
          zip: cep,
        },
      );
      setSent(true);
    } catch (error) {
      toast(`Erro ao enviar: ${errorMessage(error)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <main className="site-shell byd-home byd-td-page">
        <BydHeader />
        <section className="byd-os-success">
          <span className="byd-os-success-icon"><CheckCircle2 size={30} /></span>
          <h1>Enviado com sucesso</h1>
          <p>Recebemos seus dados. Em breve um especialista BYD entrará em contato para falar sobre o {title}.</p>
          <Link href="/"><ArrowRight size={16} /> Retornar à página inicial</Link>
        </section>
        <BydFooter />
      </main>
    );
  }

  return (
    <main className="site-shell byd-home byd-td-page">
      <BydHeader />

      <section className="byd-td-body">
        <div className="byd-os-summary">
          {offer ? <img src={offer.image} alt={offer.model} loading="lazy" /> : null}
          <div className="byd-os-summary-info">
            <p className="byd-os-overline">Oferta selecionada</p>
            <h2>{title}</h2>
            {crm !== null ? (
              <div className="byd-os-prices">
                <div>
                  <span>De</span>
                  <strong>{brl(crm)}</strong>
                </div>
                {por !== null ? (
                  <div className="is-highlight">
                    <span>Por</span>
                    <strong>{brl(por)}</strong>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <form className="byd-td-form" onSubmit={submit}>
          <h1 className="byd-td-title">Envie seus dados que entraremos em contato.</h1>

          <div className="byd-td-row">
            <div className="byd-td-field">
              <label htmlFor="os-first">Nome*</label>
              <input id="os-first" required placeholder="Nome*" maxLength={64} value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="byd-td-field">
              <label htmlFor="os-last">Sobrenome*</label>
              <input id="os-last" required placeholder="Sobrenome*" maxLength={64} value={lastName} onChange={(event) => setLastName(event.target.value)} />
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
              <input required placeholder="99999-9999*" inputMode="numeric" value={phone} onChange={(event) => setPhone(maskPhone(event.target.value))} />
            </div>
          </div>

          <div className="byd-td-field">
            <label htmlFor="os-email">E-mail*</label>
            <input id="os-email" type="email" required placeholder="voce@email.com" maxLength={64} value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>

          <div className="byd-td-field">
            <label>Pessoa física ou jurídica?*</label>
            <div className="byd-os-radios">
              <label className={`byd-os-radio ${personType === "fisica" ? "is-active" : ""}`}>
                <input type="radio" name="os-person" checked={personType === "fisica"} onChange={() => changePersonType("fisica")} />
                Física
              </label>
              <label className={`byd-os-radio ${personType === "juridica" ? "is-active" : ""}`}>
                <input type="radio" name="os-person" checked={personType === "juridica"} onChange={() => changePersonType("juridica")} />
                Jurídica
              </label>
            </div>
          </div>

          <div className="byd-td-field">
            <label htmlFor="os-doc">{personType === "fisica" ? "CPF*" : "CNPJ*"}</label>
            <input
              id="os-doc"
              required
              inputMode="numeric"
              placeholder={personType === "fisica" ? "xxx.xxx.xxx-xx" : "xx.xxx.xxx/xxxx-xx"}
              value={document}
              onChange={(event) => setDocument(maskDocument(event.target.value, personType))}
            />
          </div>

          <div className="byd-td-row">
            <div className="byd-td-field">
              <label htmlFor="os-state">Estado*</label>
              <select id="os-state" required value={state} onChange={(event) => { setState(event.target.value); setCity(""); }}>
                <option value="" disabled>Selecione o estado</option>
                {offerStates.map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
            <div className="byd-td-field">
              <label htmlFor="os-city">Cidade*</label>
              <select id="os-city" required value={city} disabled={!state} onChange={(event) => setCity(event.target.value)}>
                <option value="" disabled>{state ? "Selecione a cidade" : "Selecione o estado primeiro"}</option>
                {cities.map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
          </div>

          <div className="byd-td-field">
            <label htmlFor="os-cep">CEP</label>
            <input id="os-cep" placeholder="Insira seu CEP" inputMode="numeric" value={cep} onChange={(event) => setCep(maskCep(event.target.value))} />
          </div>

          <div className="byd-td-field">
            <label htmlFor="os-details">Detalhes adicionais</label>
            <textarea id="os-details" rows={4} maxLength={200} placeholder="Conte-nos mais sobre o seu interesse" value={details} onChange={(event) => setDetails(event.target.value)} />
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
