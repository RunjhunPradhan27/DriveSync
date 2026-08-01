import { useState } from 'react';
import { Tag, Hash, Layers, IndianRupee, Truck } from 'lucide-react';
import FormField from './FormField.jsx';
import Button from './ui/Button.jsx';

/**
 * Shared form for creating and editing a spare part. The backend allows the
 * exact same field set on create and update, so like SaleForm/InventoryForm
 * there's no field-set distinction by mode — only the submit button label
 * differs.
 */
const SparePartForm = ({ initialValues, onSubmit, submitting, serverError, submitLabel }) => {
  const [values, setValues] = useState(() => ({
    part_name: '',
    part_number: '',
    quantity: 0,
    unit_price: '',
    supplier_name: '',
    ...initialValues
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.part_name.trim()) nextErrors.part_name = 'Part name is required.';
    if (!values.part_number.trim()) nextErrors.part_number = 'Part number is required.';
    if (values.quantity === '' || Number(values.quantity) < 0) {
      nextErrors.quantity = 'Enter a valid quantity.';
    }
    if (values.unit_price === '' || Number(values.unit_price) <= 0) {
      nextErrors.unit_price = 'Enter a valid unit price.';
    }
    if (!values.supplier_name.trim()) nextErrors.supplier_name = 'Supplier name is required.';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      part_name: values.part_name.trim(),
      part_number: values.part_number.trim(),
      quantity: Number(values.quantity),
      unit_price: Number(values.unit_price),
      supplier_name: values.supplier_name.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Part Name"
          id="part_name"
          icon={Tag}
          value={values.part_name}
          onChange={handleChange('part_name')}
          error={errors.part_name}
        />

        <FormField
          label="Part Number"
          id="part_number"
          icon={Hash}
          value={values.part_number}
          onChange={handleChange('part_number')}
          error={errors.part_number}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Quantity"
          id="quantity"
          type="number"
          min="0"
          icon={Layers}
          value={values.quantity}
          onChange={handleChange('quantity')}
          error={errors.quantity}
        />

        <FormField
          label="Unit Price"
          id="unit_price"
          type="number"
          step="0.01"
          min="0"
          icon={IndianRupee}
          value={values.unit_price}
          onChange={handleChange('unit_price')}
          error={errors.unit_price}
        />
      </div>

      <FormField
        label="Supplier Name"
        id="supplier_name"
        icon={Truck}
        value={values.supplier_name}
        onChange={handleChange('supplier_name')}
        error={errors.supplier_name}
      />

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={submitting} className="w-full" size="lg">
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
};

export default SparePartForm;
