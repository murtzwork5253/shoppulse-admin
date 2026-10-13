import { useParams } from 'react-router';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';

// Placeholder until the product detail view is built.
export default function ProductDetail() {
  const { id } = useParams();
  return (
    <Card>
      <EmptyState title={`Product #${id}`} message="Product details will appear here." />
    </Card>
  );
}
