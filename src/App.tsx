import "./assets/style/main.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LocaleProvider } from "./locales/LocaleContext"
import Home from "./pages/Home"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfUse from "./pages/TermsOfUse"
import SEOHead from "./components/SEOHead"

export const AppRoutes = () => {
  return (
      <LocaleProvider>
        <SEOHead />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/en" element={<Home />} />
          <Route path="/ru" element={<Home />} />
          <Route path="/mexfilik-siyaseti" element={<PrivacyPolicy />} />
          <Route path="/en/mexfilik-siyaseti" element={<PrivacyPolicy />} />
          <Route path="/ru/mexfilik-siyaseti" element={<PrivacyPolicy />} />
          <Route path="/istifade-sertleri" element={<TermsOfUse />} />
          <Route path="/en/istifade-sertleri" element={<TermsOfUse />} />
          <Route path="/ru/istifade-sertleri" element={<TermsOfUse />} />
        </Routes>
      </LocaleProvider>
  )
}

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default App
