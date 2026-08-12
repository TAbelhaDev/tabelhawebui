export function isPathActive(currentPath: string, href: string): boolean {
  return currentPath === href || currentPath.startsWith(href + "/");
}
