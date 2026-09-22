import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Models from "./pages/Models";
import Offers from "./pages/Offers";
import Admin from "./pages/Admin";
import Simulator from "./pages/Simulator";
import OfertaSelecionada from "./pages/OfertaSelecionada";
import TestDrive from "./pages/TestDrive";
import { Subscription, Technology } from "./pages/ServicePages";

function Router() {
  return (
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
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="bottom-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
