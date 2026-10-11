import { Navigate, Route, Routes } from "react-router-dom";
import { GiftProvider } from "./gift-context";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Campaign from "./pages/Campaign";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Impact from "./pages/Impact";
import Receipt from "./pages/Receipt";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <GiftProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="our-work" element={<Campaigns />} />
          <Route path="our-work/:slug" element={<Campaign />} />
          <Route path="campaigns" element={<Navigate to="/our-work" replace />} />
          <Route path="campaigns/*" element={<Navigate to="/our-work" replace />} />
          <Route path="donate" element={<Donate />} />
          <Route path="about" element={<About />} />
          <Route path="impact" element={<Impact />} />
          <Route path="receipt/:ref" element={<Receipt />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/*" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </GiftProvider>
  );
}
