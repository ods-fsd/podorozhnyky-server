export const calculatePaginationData = (totalItems, perPage, page) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const hasNextPage = totalPages > 0 && page < totalPages;
  const hasPreviousPage = page > 1 && totalPages > 0 && page <= totalPages + 1;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};