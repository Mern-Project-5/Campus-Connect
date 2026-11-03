import React, { useState } from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { DemoHeaderBanner } from './components/DemoHeaderBanner';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { PendingApprovalView } from './components/PendingApprovalView';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { StudyNotesPage } from './pages/StudyNotesPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { EventsPage } from './pages/EventsPage';
import { TeammatesPage } from './pages/TeammatesPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const MainLayout: React.FC = () => {
  const { activeTab, currentUser } = useCampus();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check if current user is pending or rejected
  const isAwaitingApproval =
    currentUser && (currentUser.status === 'pending' || currentUser.status === 'rejected');

  const renderActiveTab = () => {
    // If account is not approved yet, restrict access to the main platform
    if (isAwaitingApproval) {
      return <PendingApprovalView />;
    }

    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'notes':
        return <StudyNotesPage />;
      case 'communities':
        return <CommunitiesPage />;
      case 'events':
        return <EventsPage />;
      case 'teammates':
        return <TeammatesPage />;
      case 'connections':
        return <ConnectionsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Demo Notification & Account Switcher Banner */}
      <DemoHeaderBanner onOpenRegister={() => setIsAuthModalOpen(true)} />

      {/* Main App Navbar */}
      <Navbar />

      {/* Main App Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8 flex gap-6">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 min-w-0">{renderActiveTab()}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Notifications */}
      <ToastContainer />

      {/* Registration & OTP Demo Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <CampusProvider>
      <MainLayout />
    </CampusProvider>
  );
}

export default App;

