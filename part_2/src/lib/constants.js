// NOTE (assumption): the assignment does not specify an exact category list.
// This list matches the categories used by the local mock data set and is a
// reasonable general-purpose set for the sample products returned by the API.
export const CATEGORY_OPTIONS = [
  "Accessories",
  "Electronics",
  "Office Supplies",
  "Furniture",
  "Networking",
  "Storage",
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Created date" },
  { value: "price", label: "Price" },
  { value: "stock", label: "Stock" },
  { value: "name", label: "Name" },
];

export const DEFAULT_PAGE_SIZE = 10;
