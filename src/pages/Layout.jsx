
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Company, Creator } from "@/api/entities";
import { auth } from "@/lib/supabase";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Plus,
  Zap,
  Crown,
  Sparkles,
  LogOut,
  Menu,
  X,
  HelpCircle,
  MessageSquare,
  Loader2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// FOUNDER NAVIGATION - Purple/Pink Theme
const founderNavigationItems = [
  { title: "Dashboard", url: createPageUrl("dashboard"), icon: LayoutDashboard },
  { title: "Programs", url: createPageUrl("Programs"), icon: Crown },
  { title: "Creators", url: createPageUrl("Creators"), icon: Users },
  { title: "Analytics", url: createPageUrl("Analytics"), icon: BarChart3 },
  { title: "Messages", url: createPageUrl("Messages"), icon: MessageSquare },
  { title: "Documentation", url: createPageUrl("Documentation"), icon: HelpCircle },
  { title: "Settings", url: createPageUrl("Settings"), icon: Settings },
];

// CREATOR NAVIGATION - Blue/Cyan Theme
const creatorNavItems = [
    { title: "Dashboard", url: createPageUrl("CreatorDashboard"), icon: LayoutDashboard },
    { title: "Browse Programs", url: createPageUrl("CreatorPrograms"), icon: Crown },
    { title: "My Analytics", url: createPageUrl("CreatorAnalytics"), icon: BarChart3 },
    { title: "Messages", url: createPageUrl("Messages"), icon: MessageSquare },
    { title: "Documentation", url: createPageUrl("Documentation"), icon: HelpCircle },
    { title: "My Profile", url: createPageUrl("CreatorProfile"), icon: Settings },
];

const publicPages = [
    'Home', 'AuthRedirect', 'AuthCallback', 'PortalRouter', 'About', 'Blog', 'Contact',
    'PrivacyPolicy', 'TermsOfService', 'Security', 'Compliance', 'PublicDocumentation'
];

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [canSwitchPortals, setCanSwitchPortals] = useState(false);
  const [currentPortal, setCurrentPortal] = useState('founder'); // Track current portal explicitly

  useEffect(() => {
    // Skip authentication for public pages
    if (publicPages.includes(currentPageName)) {
      setInitialized(true);
      return;
    }

    const initializeSession = async () => {
      try {
        // Get user from localStorage (set during auth callback)
        const storedUser = localStorage.getItem('stakeshare_user');
        if (storedUser) {
          const fetchedUser = JSON.parse(storedUser);
          setUser(fetchedUser);
          
          // Set the current portal based on user role
          const portal = fetchedUser.role || 'founder';
          setCurrentPortal(portal);

          const [companies, creators] = await Promise.all([
            Company.filter({ created_by: fetchedUser.email }),
            Creator.filter({ email: fetchedUser.email })
          ]);
          setCanSwitchPortals(companies.length > 0 && creators.length > 0);
        } else {
          // Check if user is authenticated with Supabase
          const { user: supabaseUser } = await auth.getCurrentUser();
          if (supabaseUser) {
            // Hydrate a default local user with inferred role
            const pendingRole = localStorage.getItem('stakeshare_role');
            const inferredRole = pendingRole || (location.pathname.toLowerCase().includes('creator') ? 'creator' : 'founder');
            const hydratedUser = {
              id: supabaseUser.id,
              email: supabaseUser.email,
              full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
              avatar_url: supabaseUser.user_metadata?.avatar_url,
              role: inferredRole
            };
            localStorage.setItem('stakeshare_user', JSON.stringify(hydratedUser));
            setUser(hydratedUser);
            setCurrentPortal(inferredRole);

            const [companies, creators] = await Promise.all([
              Company.filter({ created_by: hydratedUser.email }),
              Creator.filter({ email: hydratedUser.email })
            ]);
            setCanSwitchPortals(companies.length > 0 && creators.length > 0);
          } else {
            setUser(null);
            setCurrentPortal('founder');
          }
        }
      } catch (error) {
        setUser(null);
        setCurrentPortal('founder');
        console.error("Error fetching user data:", error);
      } finally {
        setInitialized(true);
      }
    };

    initializeSession();
  }, [currentPageName, navigate, location.pathname]);

  useEffect(() => {
    // For public pages, don't redirect
    if (publicPages.includes(currentPageName)) {
      return;
    }
    
    // For authenticated pages, redirect to home if no user
    if (initialized && !user) {
      navigate(createPageUrl('home'));
    }
  }, [initialized, user, currentPageName, navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    
    // Clear localStorage
    localStorage.removeItem('stakeshare_user');
    localStorage.removeItem('stakeshare_role');
    
    setUser(null);
    setCurrentPortal('founder');
    setInitialized(false);
    
    const homeUrl = window.location.origin + createPageUrl('home');
    if (window.top && window.top !== window) {
      window.top.location.href = homeUrl;
    } else {
      window.location.href = homeUrl;
    }
  };

  const handleSwitchToCreator = async () => {
    try {
      // Update user role in localStorage
      const storedUser = localStorage.getItem('stakeshare_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.role = 'creator';
        localStorage.setItem('stakeshare_user', JSON.stringify(user));
        setUser(user);
      }
      setCurrentPortal('creator');
      // Navigate to creator dashboard
      navigate(createPageUrl('CreatorDashboard'));
    } catch (error) {
      console.error("Error switching to creator:", error);
    }
  };

  const handleSwitchToFounder = async () => {
    try {
      // Update user role in localStorage
      const storedUser = localStorage.getItem('stakeshare_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.role = 'founder';
        localStorage.setItem('stakeshare_user', JSON.stringify(user));
        setUser(user);
      }
      setCurrentPortal('founder');
      // Navigate to founder dashboard
      navigate(createPageUrl('dashboard'));
    } catch (error) {
      console.error("Error switching to founder:", error);
    }
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!user || publicPages.includes(currentPageName)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <PublicStyles />
        {children}
      </div>
    );
  }

  // Use currentPortal state instead of user preference to avoid confusion
  if (currentPortal === 'creator') {
    return <CreatorLayout user={user} onLogout={handleLogout} onSwitchToFounder={handleSwitchToFounder} canSwitch={canSwitchPortals}>{children}</CreatorLayout>;
  }

  // Default to founder portal
  return <FounderLayout user={user} onLogout={handleLogout} onSwitchToCreator={handleSwitchToCreator} canSwitch={canSwitchPortals}>{children}</FounderLayout>;
}

// PUBLIC PAGES STYLES
const PublicStyles = () => (
  <style>{`
    :root {
      --bg-primary: rgb(88 28 135);
      --bg-secondary: rgb(30 58 138);
      --glass-bg: rgba(255, 255, 255, 0.1);
      --glass-border: rgba(255, 255, 255, 0.2);
    }
    .glass { background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); }
    .glass-card { background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); }
    .glow { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1); }
  `}</style>
);

// FOUNDER PORTAL LAYOUT - Purple/Pink Theme
function FounderLayout({ children, user, onLogout, onSwitchToCreator, canSwitch }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <FounderStyles />
        <Sidebar className="bg-white/95 backdrop-blur-sm border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-6 bg-white/50">
            <div className="flex items-center gap-3">
              <img 
                src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
                alt="StakeShare Logo" 
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h2 className="font-bold text-gray-800 text-lg">StakeShare</h2>
                <p className="text-xs text-gray-600">Founder Portal</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4 bg-white/50">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-600 uppercase tracking-wider px-3 py-2">
                Platform
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {founderNavigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`transition-all duration-200 rounded-xl mb-1 ${
                          window.location.pathname === item.url
                            ? 'founder-sidebar-active'
                            : 'founder-sidebar-item'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupContent>
                <Link to={createPageUrl("CreateProgram")} className="block">
                  <div className="bg-white/80 rounded-xl p-4 hover:bg-white/90 transition-all duration-200 cursor-pointer group border border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">New Program</p>
                        <p className="text-xs text-gray-600">Start recruiting</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </SidebarGroupContent>
            </SidebarGroup>

            {canSwitch && (
              <div className="p-3 mt-4">
                <Button onClick={onSwitchToCreator} variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                  Switch to Creator
                </Button>
              </div>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4 bg-white/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{user?.full_name || 'Founder'}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout} className="text-gray-600 hover:bg-gray-200/80 hover:text-gray-900">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 text-gray-700" />
              <h1 className="text-xl font-bold text-gray-800">StakeShare Founder</h1>
            </div>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}

// CREATOR PORTAL LAYOUT - Blue/Cyan Theme
function CreatorLayout({ children, user, onLogout, onSwitchToFounder, canSwitch }) {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white">
          <CreatorStyles />
          
          {/* Desktop Sidebar */}
          <Sidebar className="bg-white/95 backdrop-blur-sm border-r border-gray-200 hidden md:flex">
              <SidebarHeader className="border-b border-gray-200 p-6 bg-white/50">
                  <div className="flex items-center gap-3">
                      <img 
                        src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
                        alt="StakeShare Logo" 
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                          <h2 className="font-bold text-gray-800 text-lg">StakeShare</h2>
                          <p className="text-xs text-gray-600">Creator Portal</p>
                      </div>
                  </div>
              </SidebarHeader>
              <SidebarContent className="p-4 bg-white/50">
                  <SidebarMenu>
                      {creatorNavItems.map((item) => (
                          <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild className={`transition-all duration-200 rounded-xl mb-1 ${ window.location.pathname === item.url ? 'creator-sidebar-active' : 'creator-sidebar-item' }`}>
                                  <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                                      <item.icon className="w-5 h-5" />
                                      <span>{item.title}</span>
                                  </Link>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                  {canSwitch && (
                    <div className="p-3 mt-4">
                       <Button onClick={onSwitchToFounder} variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                         Switch to Founder
                       </Button>
                    </div>
                  )}
              </SidebarContent>
              <SidebarFooter className="border-t border-gray-200 p-4 bg-white/50">
                  <div className="flex items-center gap-3">
                      <img 
                        src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
                        alt="StakeShare Logo" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{user?.full_name}</p>
                          <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={onLogout} className="text-gray-600 hover:bg-gray-200/80 hover:text-gray-900">
                          <LogOut className="w-5 h-5" />
                      </Button>
                  </div>
              </SidebarFooter>
          </Sidebar>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 bg-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
                      alt="StakeShare Logo" 
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <h2 className="font-bold text-gray-800 text-lg">Creator Portal</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-gray-600">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-4 bg-white/50">
                  <div className="space-y-2">
                    {creatorNavItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          location.pathname === item.url ? 'creator-sidebar-active' : 'creator-sidebar-item'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                  {canSwitch && (
                    <div className="p-3 mt-4">
                       <Button onClick={onSwitchToFounder} variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                         Switch to Founder
                       </Button>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white/50">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
                      alt="StakeShare Logo" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{user?.full_name}</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onLogout} className="text-gray-600 hover:bg-gray-200/80 hover:text-gray-900">
                        <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 overflow-auto">
            {/* Mobile Header */}
            <header className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-4 py-3 md:hidden flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
              <h1 className="text-lg font-bold text-white">Creator Portal</h1>
              <div className="w-10"></div>
            </header>

            <div className="p-4 md:p-8">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    );
}

// FOUNDER PORTAL STYLES - Purple Theme
const FounderStyles = () => (
  <style>{`
    :root {
      --founder-primary: rgb(147 51 234);
      --founder-secondary: rgb(236 72 153);
    }
    .glass { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); }
    .glass-card { background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); }
    .glow { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3), 0 0 40px rgba(147, 51, 234, 0.1); }
    .founder-sidebar-item { color: rgb(51, 65, 85) !important; font-weight: 600 !important; }
    .founder-sidebar-item:hover { color: rgb(30, 41, 59) !important; background-color: rgba(147, 51, 234, 0.1) !important; }
    .founder-sidebar-active { background-color: rgba(147, 51, 234, 0.2) !important; color: rgb(147, 51, 234) !important; font-weight: 700 !important; }
    .glass::placeholder { color: rgba(255, 255, 255, 0.6) !important; opacity: 1; }
  `}</style>
);

// CREATOR PORTAL STYLES - Blue Theme  
const CreatorStyles = () => (
  <style>{`
    :root {
      --creator-primary: rgb(59 130 246);
      --creator-secondary: rgb(6 182 212);
    }
    .glass { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); }
    .glass-card { background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); }
    .glow { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1); }
    .creator-sidebar-item { color: rgb(51, 65, 85) !important; font-weight: 600 !important; }
    .creator-sidebar-item:hover { color: rgb(30, 41, 59) !important; background-color: rgba(59, 130, 246, 0.1) !important; }
    .creator-sidebar-active { background-color: rgba(59, 130, 246, 0.2) !important; color: rgb(59, 130, 246) !important; font-weight: 700 !important; }
    .glass::placeholder { color: rgba(255, 255, 255, 0.6) !important; opacity: 1; }
  `}</style>
);
