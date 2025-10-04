export const getPlatformName = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    // Removes 'www.' and splits by '.' to get the name (e.g., "linkedin")
    const name = hostname.replace('www.', '').split('.')[0];
    // Capitalizes the first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch (error) {
    // If the URL is invalid, return the original string as a fallback
    return url;
  }
};