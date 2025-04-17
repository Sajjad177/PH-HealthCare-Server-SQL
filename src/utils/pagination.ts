type IPagination = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

type IResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

export const paginationHelpers = (option: IPagination): IResult => {
  const page = Number(option.page || 1);
  const limit = Number(option.limit || 10);
  const skip = (Number(page) - 1) * limit;
  const sortBy = option.sortBy || "createdAt";
  const sortOrder = option.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
