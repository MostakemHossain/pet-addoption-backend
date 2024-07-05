export const userSearchAbleFields = ["email", "name"];
export const userFilterAbleFields = ["name", "email", "searchTerm", "status"];

export const userSelectedFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  profilePhoto: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserSelectedFields = typeof userSelectedFields;
