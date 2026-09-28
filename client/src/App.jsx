import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'

// Public Pages
import Landing from './pages/public/Landing'
import ReportIssue from './pages/public/ReportIssue'
import TrackComplaint from './pages/public/TrackComplaint'

// Core Officer / Management Pages
import Dashboard from './pages/dashboard/Dashboard'
import AssetRegistry from './pages/assets/AssetRegistry'
import ComplaintsBoard from './pages/complaints/ComplaintsBoard'
import VerificationQueue from './pages/verification/VerificationQueue'
import InspectionCapture from './pages/inspections/InspectionCapture'
import ProjectList from './pages/projects/ProjectList'
import DlpTracker from './pages/maintenance/DlpTracker'
import WorkOrdersBoard from './pages/workorders/WorkOrdersBoard'
import GisMapViewer from './pages/map/GisMapViewer'
import AuditLogViewer from './pages/audit/AuditLogViewer'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Citizen Grievance Portal */}
        <Route path="/" element={<Landing />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/track" element={<TrackComplaint />} />

        {/* Authenticated Department Command Center */}
        <Route path="/portal" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<AssetRegistry />} />
          <Route path="/complaints" element={<ComplaintsBoard />} />
          <Route path="/verification" element={<VerificationQueue />} />
          <Route path="/inspections/new" element={<InspectionCapture />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/defects" element={<DlpTracker />} />
          <Route path="/work-orders" element={<WorkOrdersBoard />} />
          <Route path="/map" element={<GisMapViewer />} />
          <Route path="/audit" element={<AuditLogViewer />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
