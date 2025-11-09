import { CommissionDashboard } from '@/components/admin/CommissionDashboard';
import CommissionReportTrigger from '@/components/admin/CommissionReportTrigger';
import { Helmet } from 'react-helmet-async';

const CommissionsPage = () => {
  return (
    <>
      <Helmet>
        <title>Platform Commissions - Admin Dashboard</title>
        <meta name="description" content="Track platform commission earnings and transaction revenue" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <CommissionDashboard />
        <CommissionReportTrigger />
      </div>
    </>
  );
};

export default CommissionsPage;
