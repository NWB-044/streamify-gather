
export const isAdmin = (): boolean => {
  return localStorage.getItem('isAdmin') === 'true';
};

export const requireAdmin = (): void => {
  if (!isAdmin()) {
    window.location.href = '/';
  }
};
