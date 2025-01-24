export const USER_TRAINEE_INFO_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  phone: true,
  email: true,
};

export const USER_SEARCH_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  trainer: {
    select: {
      id: true,
    },
  },
  trainee: {
    select: {
      id: true,
    },
  },
};
