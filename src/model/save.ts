export const Save = {
  set: (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
  get: () => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
  },
};
