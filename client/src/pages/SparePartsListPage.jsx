import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Pencil } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import usePagination from '../hooks/usePagination.js';
import { getAllSpareParts } from '../services/spareParts.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatCurrency } from '../utils/formatters.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { IconLinkButton } from '../components/ui/IconButton.jsx';
import Table, { theadClass, thClass, tbodyClass, trClass, tdClass, tdEmphasisClass } from '../components/ui/Table.jsx';
import Pagination from '../components/ui/Pagination.jsx';

const SparePartsListPage = () => {
  const { user } = useAuth();
  const canManage = user.role === 'Admin' || user.role === 'Inventory Manager';

  const spareParts = useFetch(getAllSpareParts, []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParts = useMemo(() => {
    if (!spareParts.data) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return spareParts.data;
    return spareParts.data.filter(
      (part) =>
        part.part_name.toLowerCase().includes(term) ||
        part.part_number.toLowerCase().includes(term) ||
        part.supplier_name.toLowerCase().includes(term)
    );
  }, [spareParts.data, searchTerm]);

  const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(filteredParts, 10);

  if (spareParts.loading) return <Loader />;
  if (spareParts.error) return <ErrorBanner message="Unable to load spare parts right now." />;

  return (
    <div>
      <PageHeader
        icon={Package}
        title="Spare Parts"
        description="Catalog of replacement parts and suppliers"
        actions={canManage && <LinkButton to="/spare-parts/new">Add Spare Part</LinkButton>}
      />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by part name, part number, or supplier"
        className="mb-4"
      />

      {(!spareParts.data || spareParts.data.length === 0) && (
        <EmptyState icon={Package} title="No spare parts yet" description={canManage ? 'Click "Add Spare Part" to create one.' : undefined} />
      )}

      {spareParts.data && spareParts.data.length > 0 && filteredParts.length === 0 && (
        <EmptyState icon={Package} title="No spare parts match your search" />
      )}

      {pageItems.length > 0 && (
        <Table>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Part Name</th>
              <th className={thClass}>Part Number</th>
              <th className={thClass}>Quantity</th>
              <th className={thClass}>Unit Price</th>
              <th className={thClass}>Supplier</th>
              {canManage && <th className={thClass}>Actions</th>}
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {pageItems.map((part) => (
              <tr key={part.part_id} className={trClass}>
                <td className={tdEmphasisClass}>
                  <Link to={`/spare-parts/${part.part_id}`} className="hover:text-indigo-600">
                    {part.part_name}
                  </Link>
                </td>
                <td className={tdClass}>{part.part_number}</td>
                <td className={tdClass}>{part.quantity}</td>
                <td className={tdClass}>{formatCurrency(part.unit_price)}</td>
                <td className={tdClass}>{part.supplier_name}</td>
                {canManage && (
                  <td className={tdClass}>
                    <IconLinkButton to={`/spare-parts/${part.part_id}/edit`} icon={Pencil} label="Edit spare part" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} total={total} pageSize={pageSize} />
    </div>
  );
};

export default SparePartsListPage;
