export function concatAclTags(...args: (string[] | undefined)[]) {
  return Array.from(new Set(args.flatMap((arg) => arg ?? []))).sort();
}
