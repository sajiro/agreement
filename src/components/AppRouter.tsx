import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "components/AppContent";

export function AppRouter() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
