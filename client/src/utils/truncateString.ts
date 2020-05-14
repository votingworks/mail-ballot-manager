// truncateString("A-tisket a-tasket A green and yellow basket", 8);

export default function truncateString(
  str: string,
  length: number,
  suffix: string = '…'
) {
  if (str.length > length) {
    return `${str.slice(0, length)}${suffix}`
  }
  return str
}
