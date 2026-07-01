import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SyncStatusDto } from '@/src/types/types';
import { formatDistanceToNow } from 'date-fns';

interface SyncStatusProps {
  syncStatus: SyncStatusDto;
}

export function SyncStatus({ syncStatus }: SyncStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">Sync Status</h3>
          <p className="text-sm text-muted-foreground">Last synchronization</p>
        </div>

        <Badge className={cn('text-white', getStatusColor(syncStatus.status))}>
          {syncStatus.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sync ID</span>
          <span className="font-mono text-xs">{syncStatus.syncId}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last Sync</span>
          <span>
            {formatDistanceToNow(new Date(syncStatus.syncDate), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}