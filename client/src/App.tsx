import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/lib/i18n";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { BasketProvider } from "@/lib/BasketContext";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import ProjectDetail from "@/pages/ProjectDetail";
import Contact from "@/pages/Contact";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPortfolio from "@/pages/admin/AdminPortfolio";
import AdminProjectEditor from "@/pages/admin/AdminProjectEditor";
import AdminPortfolioCategories from "@/pages/admin/AdminPortfolioCategories";
import AdminServices from "@/pages/admin/AdminServices";
import AdminAbout from "@/pages/admin/AdminAbout";
import AdminContact from "@/pages/admin/AdminContact";
import AdminOrders from "@/pages/admin/AdminOrders";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setAuthed(true);
        } else {
          setLocation("/admin");
        }
      })
      .catch(() => setLocation("/admin"))
      .finally(() => setChecked(true));
  }, [setLocation]);

  if (!checked) return null;
  if (!authed) return null;
  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function Router() {
  const [location] = useLocation();

  // Admin routes — completely isolated, no main Layout (navbar/footer/background)
  if (location.startsWith("/admin")) {
    return (
      <Switch>
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard">
          <ProtectedRoute component={AdminDashboard} />
        </Route>
        <Route path="/admin/portfolio">
          <ProtectedRoute component={AdminPortfolio} />
        </Route>
        <Route path="/admin/portfolio/:id/edit">
          <ProtectedRoute component={AdminProjectEditor} />
        </Route>
        <Route path="/admin/portfolio-categories">
          <ProtectedRoute component={AdminPortfolioCategories} />
        </Route>
        <Route path="/admin/services">
          <ProtectedRoute component={AdminServices} />
        </Route>
        <Route path="/admin/about">
          <ProtectedRoute component={AdminAbout} />
        </Route>
        <Route path="/admin/orders">
          <ProtectedRoute component={AdminOrders} />
        </Route>
        <Route path="/admin/contact">
          <ProtectedRoute component={AdminContact} />
        </Route>
      </Switch>
    );
  }

  // Project detail page — standalone full-screen, no main Layout
  if (location.startsWith("/portfolio/") && location !== "/portfolio") {
    return (
      <Switch>
        <Route path="/portfolio/:id" component={ProjectDetail} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Public site — wrapped in main Layout (navbar, footer, animated background)
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BasketProvider>
        <I18nProvider>
          <Router />
          <Toaster />
        </I18nProvider>
      </BasketProvider>
    </QueryClientProvider>
  );
}

export default App;
