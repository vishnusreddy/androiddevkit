import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!projectToken) return null;

  if (!posthogClient) {
    posthogClient = new PostHog(projectToken, {
      host: import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    });
  }
  return posthogClient;
}
