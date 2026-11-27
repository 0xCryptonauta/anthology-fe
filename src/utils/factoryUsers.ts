export interface UsersFetchPlan {
  offset: number;
  limit: number;
  nextCP: number;
}

export const getUsersFetchPlan = (
  factoryUsersCP: number,
  syncedUsersCP: number | undefined,
  usersLength: number
): UsersFetchPlan | null => {
  if (!Number.isSafeInteger(factoryUsersCP) || factoryUsersCP < 0) {
    throw new Error("Invalid factory users checkpoint");
  }

  if (factoryUsersCP === 0) return null;

  const cursor = typeof syncedUsersCP === "number" ? syncedUsersCP : Number.NaN;
  const safeCursor =
    Number.isSafeInteger(cursor) && cursor >= 0 && cursor <= factoryUsersCP
      ? cursor
      : 0;

  if (factoryUsersCP > safeCursor) {
    return {
      offset: safeCursor,
      limit: factoryUsersCP - safeCursor,
      nextCP: factoryUsersCP,
    };
  }

  if (usersLength === 0) {
    return { offset: 0, limit: factoryUsersCP, nextCP: factoryUsersCP };
  }

  return null;
};
