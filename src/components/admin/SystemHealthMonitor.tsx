import React, { useState, useEffect } from 'react';
import { Activity, Database, Server, Wifi, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
}

const SystemHealthMonitor: React.FC = () => {
  const [health, setHealth] = useState({
    database: { status: 'healthy', latency: 0 } as HealthStatus,
    api: { status: 'healthy', latency: 0 } as HealthStatus,
    auth: { status: 'healthy', latency: 0 } as HealthStatus,
  });

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    // Check database
    const dbStart = Date.now();
    try {
      await supabase.from('profiles').select('id').limit(1);
      setHealth(prev => ({
        ...prev,
        database: { status: 'healthy', latency: Date.now() - dbStart }
      }));
    } catch {
      setHealth(prev => ({
        ...prev,
        database: { status: 'down', latency: Date.now() - dbStart }
      }));
    }

    // Check API
    const apiStart = Date.now();
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        }
      });
      setHealth(prev => ({
        ...prev,
        api: { status: response.ok ? 'healthy' : 'degraded', latency: Date.now() - apiStart }
      }));
    } catch {
      setHealth(prev => ({
        ...prev,
        api: { status: 'down', latency: Date.now() - apiStart }
      }));
    }

    // Check Auth
    const authStart = Date.now();
    try {
      const { data } = await supabase.auth.getSession();
      setHealth(prev => ({
        ...prev,
        auth: { status: data.session ? 'healthy' : 'degraded', latency: Date.now() - authStart }
      }));
    } catch {
      setHealth(prev => ({
        ...prev,
        auth: { status: 'down', latency: Date.now() - authStart }
      }));
    }
  };

  const getStatusIcon = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'degraded':
        return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      case 'down':
        return <XCircle className="h-3 w-3 text-red-400" />;
    }
  };

  const getStatusColor = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 border-green-500/30';
      case 'degraded': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'down': return 'bg-red-500/20 border-red-500/30';
    }
  };

  const services = [
    { key: 'database', label: 'DB', icon: Database, health: health.database },
    { key: 'api', label: 'API', icon: Server, health: health.api },
    { key: 'auth', label: 'Auth', icon: Wifi, health: health.auth },
  ];

  const allHealthy = Object.values(health).every(h => h.status === 'healthy');

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${getStatusColor(allHealthy ? 'healthy' : 'degraded')}`}>
        <Activity className={`h-3 w-3 ${allHealthy ? 'text-green-400' : 'text-yellow-400'}`} />
        <span className="text-[10px] font-medium text-white/80">System</span>
      </div>
      
      {services.map((service) => (
        <div
          key={service.key}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border ${getStatusColor(service.health.status)}`}
          title={`${service.label}: ${service.health.latency}ms`}
        >
          {getStatusIcon(service.health.status)}
          <span className="text-[10px] font-medium text-white/70">{service.label}</span>
          {service.health.latency !== undefined && (
            <span className="text-[9px] text-white/50">{service.health.latency}ms</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SystemHealthMonitor;
