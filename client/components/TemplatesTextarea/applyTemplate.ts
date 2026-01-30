export function applyTemplate<T extends Record<string, any>>(
  template: string,
  data?: T | null
) {
  if (!data) return template;

  let res = template;

  Object.entries(data).forEach(([key, value]) => {
    res = res.replaceAll(`{${key}}`, String(value));
  });

  return res;
}
