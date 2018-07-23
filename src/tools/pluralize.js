/* eslint-disable */
// https:// github.com/swestrich/pluralize-es

const pluralize = (str: string): string => {
  if (!str) return ''
  let plural

  const last = str[str.length - 1] // Last letter of str
  const lastTwo = str.slice(-2)
  const lastThree = str.slice(-3)

  if (last === 'x' || last === 's') {
    plural = str
  }
  else if (last === 'z') {
    // drop the z and add ces
    const radical = str.substring(0, str.length - 1)
    plural = radical + 'ces'
  }
  else if (last === 'c') {
    // drop the z and add ces
    const radical = str.substring(0, str.length - 1)
    plural = radical + 'ques'
  }
  else if (last === 'g') {
    // add an extra u
    plural = str + 'ues'
  }
  else if (last === 'a' || last === 'e' || last === 'é' || last === 'i' || last === 'o' || last === 'u') {
    // easy, just add s
    plural = str + 's'
  }
  else if (last === 'á') {
    const radical = str.substring(0, str.length - 1)
    plural = radical + 'aes'
  }
  else if (last === 'ó') {
    const radical = str.substring(0, str.length - 1)
    plural = radical + 'oes'
  }
  else if (lastThree === 'ión') {
    const radical = str.substring(0, str.length - 3)
    plural = radical + 'iones'
  }
  else if (lastTwo === 'ín') {
    const radical = str.substring(0, str.length - 2)
    plural = radical + 'ines'
  } else {
    plural = str + 'es'
  }
  return plural
}

export default pluralize
