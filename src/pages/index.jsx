import Layout from "./Layout.jsx";
import CreateProgram from "./CreateProgram";
import Analytics from "./Analytics";
import Programs from "./Programs";
import ProgramDetails from "./ProgramDetails";
import Creators from "./Creators";
import Settings from "./Settings";
import Home from "./home";
import CreatorDashboard from "./CreatorDashboard";
import CreatorPrograms from "./CreatorPrograms";
import CreatorProfile from "./CreatorProfile";
import CreatorAnalytics from "./CreatorAnalytics";
import CreatorProgramDetails from "./CreatorProgramDetails";
import AuthCallback from "./AuthCallback";
import Dashboard from "./dashboard";
import Documentation from "./Documentation";
import Messages from "./Messages";
import PortalRouter from "./PortalRouter";
import About from "./About";
import Blog from "./Blog";
import Contact from "./Contact";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import Security from "./Security";
import Compliance from "./Compliance";
import PublicDocumentation from "./PublicDocumentation";
import AuthRedirect from "./AuthRedirect";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    CreateProgram: CreateProgram,
    Analytics: Analytics,
    Programs: Programs,
    ProgramDetails: ProgramDetails,
    Creators: Creators,
    Settings: Settings,
    Home: Home,
    CreatorDashboard: CreatorDashboard,
    CreatorPrograms: CreatorPrograms,
    CreatorProfile: CreatorProfile,
    CreatorAnalytics: CreatorAnalytics,
    CreatorProgramDetails: CreatorProgramDetails,
    AuthCallback: AuthCallback,
    Dashboard: Dashboard,
    Documentation: Documentation,
    Messages: Messages,
    PortalRouter: PortalRouter,
    About: About,
    Blog: Blog,
    Contact: Contact,
    PrivacyPolicy: PrivacyPolicy,
    TermsOfService: TermsOfService,
    Security: Security,
    Compliance: Compliance,
    PublicDocumentation: PublicDocumentation,
    AuthRedirect: AuthRedirect
};

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<CreateProgram />} />
                <Route path="/CreateProgram" element={<CreateProgram />} />
                <Route path="/Analytics" element={<Analytics />} />
                <Route path="/Programs" element={<Programs />} />
                <Route path="/ProgramDetails" element={<ProgramDetails />} />
                <Route path="/Creators" element={<Creators />} />
                <Route path="/Settings" element={<Settings />} />
                <Route path="/home" element={<Home />} />
                <Route path="/CreatorDashboard" element={<CreatorDashboard />} />
                <Route path="/CreatorPrograms" element={<CreatorPrograms />} />
                <Route path="/CreatorProfile" element={<CreatorProfile />} />
                <Route path="/CreatorAnalytics" element={<CreatorAnalytics />} />
                <Route path="/CreatorProgramDetails" element={<CreatorProgramDetails />} />
                <Route path="/AuthCallback" element={<AuthCallback />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Documentation" element={<Documentation />} />
                <Route path="/Messages" element={<Messages />} />
                <Route path="/PortalRouter" element={<PortalRouter />} />
                <Route path="/About" element={<About />} />
                <Route path="/Blog" element={<Blog />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/TermsOfService" element={<TermsOfService />} />
                <Route path="/Security" element={<Security />} />
                <Route path="/Compliance" element={<Compliance />} />
                <Route path="/PublicDocumentation" element={<PublicDocumentation />} />
                <Route path="/AuthRedirect" element={<AuthRedirect />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}