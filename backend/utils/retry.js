export async function retry(fn, retries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.error(`Retry ${attempt} failed`);

      if (attempt < retries) {
        await new Promise(resolve =>
          setTimeout(resolve, delay * attempt)
        );
      }
    }
  }

  throw lastError;
}
