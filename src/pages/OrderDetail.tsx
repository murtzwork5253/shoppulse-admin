import { useParams } from 'react-router';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';

// Placeholder until the order detail view is built.
export default function OrderDetail() {
  const { id } = useParams();
  return (
    <Card>
      <EmptyState title={`Order #${id}`} message="Order details will appear here." />
    </Card>
  );
}
