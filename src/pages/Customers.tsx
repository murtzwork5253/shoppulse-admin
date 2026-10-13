import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';

// Placeholder until the customers list is built.
export default function Customers() {
  return (
    <Card>
      <EmptyState title="Customers" message="The customer list will appear here." />
    </Card>
  );
}
