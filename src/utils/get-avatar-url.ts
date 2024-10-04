export function getAvatarUrl(userId: string): string {
  return `/images/avatar-${Number(userId) % 10}.svg`;
}