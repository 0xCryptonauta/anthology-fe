export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 100
): Promise<T> => {
  let attempt = 0;
  let delay = initialDelay;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;

      console.warn(`Retry ${attempt} in ${delay}ms`);
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; // exponential backoff
    }
  }

  throw new Error("Unexpected retry failure"); // Should never reach here
};
