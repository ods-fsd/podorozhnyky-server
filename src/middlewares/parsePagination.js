export const parsePagination = (req, res, next) => {
  const page = Number(req.query.page ?? 1);
  const perPage = Number(req.query.perPage ?? 10);

  req.pagination = {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : 10,
  };

  next();
};