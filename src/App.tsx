import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Requirements from "@/pages/Requirements";
import RequirementDetail from "@/pages/RequirementDetail";
import Prioritization from "@/pages/Prioritization";
import Dependencies from "@/pages/Dependencies";
import Tracking from "@/pages/Tracking";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="requirements" element={<Requirements />} />
          <Route path="requirements/:id" element={<RequirementDetail />} />
          <Route path="prioritization" element={<Prioritization />} />
          <Route path="dependencies" element={<Dependencies />} />
          <Route path="tracking" element={<Tracking />} />
        </Route>
      </Routes>
    </Router>
  );
}
