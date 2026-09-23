import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Models = lazy(() => import("./pages/Models"));
const Offers = lazy(() => import("./pages/Offers"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminApp = lazy(() => import("./pages/AdminApp"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const Simulator = lazy(() => import("./pages/Simulator"));
const OfertaSelecionada = lazy(() => import("./pages/OfertaSelecionada"));
const TestDrive = lazy(() => import("./pages/TestDrive"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Technology = lazy(() =>
  import("./pages/ServicePages").then((m) => ({ default: m.Technology })),
);
const Subscription = lazy(() =>
  import("./pages/ServicePages").then((m) => ({ default: m.Subscription })),
);

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/modelos" component={Models} />
        <Route path="/ofertas" component={Offers} />
        <Route path="/tecnologia" component={Technology} />
        <Route path="/test-drive" component={TestDrive} />
        <Route path="/aluguel-byd-mais" component={Subscription} />
        <Route path="/simulacao" component={Simulator} />
        <Route path="/oferta-selecionada" component={OfertaSelecionada} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/app" component={AdminApp} />
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="bottom-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
