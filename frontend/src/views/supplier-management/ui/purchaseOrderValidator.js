// src/validators/purchaseOrderValidator.js

export function validateForm(data) {
  const errors = {};
  // Validate order date
  if (!data.orderDate) {
    errors.orderDate = 'Order date is required';
  } else if (new Date(data.orderDate) > new Date()) {
    errors.orderDate = 'Order date cannot be in the future';
  }
  
  // Validate expected date
  if (data.expectedDate && new Date(data.expectedDate) < new Date(data.orderDate)) {
    errors.expectedDate = 'Expected date cannot be before order date';
  }
  
  // Validate items
  if (!data.items || data.items.length === 0) {
    errors.items = 'At least one product item is required';
  } else {
    const itemErrors = [];
    let hasItemError = false;
    
    data.items.forEach((item, index) => {
      const itemError = {};
      if (!item.product_id) {
        itemError.product_id = 'Product is required';
        hasItemError = true;
      }
      if (item.quantity <= 0) {
        itemError.quantity = 'Quantity must be greater than zero';
        hasItemError = true;
      }
      if (item.unit_price < 0) {
        itemError.unit_price = 'Unit price cannot be negative';
        hasItemError = true;
      }
      if (item.discount < 0) {
        itemError.discount = 'Discount cannot be negative';
        hasItemError = true;
      }
      if (item.gst_rate < 0) {
        itemError.gst_rate = 'GST rate cannot be negative';
        hasItemError = true;
      }
      
      itemErrors[index] = itemError;
    });
    
    if (hasItemError) {
      errors.items = itemErrors;
    }
  }
  
  return errors;
}