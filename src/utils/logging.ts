export function showAppVersion(nodeEnv: string, version: string) {
  const formatRegular = 'color: #ffffff; font-size: 11px;';
  const formatAccent = 'color: #dfb519; font-weight: bold; font-size: 11px;';

  console.log(
    `%cApp running in %c${nodeEnv.toUpperCase()} %cmode. Version %cv${version}`,
    formatRegular,
    formatAccent,
    formatRegular,
    formatAccent
  );
}
