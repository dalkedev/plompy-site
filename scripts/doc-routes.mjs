export const releaseVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export function isReleaseSlug(slug) {
  return slug.startsWith('releases/') && releaseVersionPattern.test(slug.slice('releases/'.length));
}

export function docsRoute(slug) {
  // Vercel treats semver dots as a file extension and serves this route without a trailing slash.
  return isReleaseSlug(slug) ? `/docs/${slug}` : `/docs/${slug ? `${slug}/` : ''}`;
}
