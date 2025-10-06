// backend/inventory/utils/paginate.js
export const paginate = (page = 1, perPage = 10) => ({
  limit: parseInt(perPage),
  offset: (parseInt(page) - 1) * parseInt(perPage)
});