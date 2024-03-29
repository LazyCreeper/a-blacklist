export const randomString = (length: number) => {
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numericChars = '0123456789';

  let randomString = '';

  // 添加一个小写字母
  randomString +=
    lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
  // 添加一个大写字母
  randomString +=
    upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
  // 添加一个数字
  randomString += numericChars[Math.floor(Math.random() * numericChars.length)];

  const remainingChars = lowerCaseChars + upperCaseChars + numericChars;

  for (let i = 3; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * remainingChars.length);
    randomString += remainingChars[randomIndex];
  }

  // 将字符串随机排序以确保随机性
  return randomString
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

export const objIsEmpty = (obj: object) => {
  return Object.values(obj).every((value) => value == null || value === '');
};

export async function isSafeData(body: { [propName: string]: any }) {
  // const strReg = /^(?!.*[`"']).*$/;
  const strReg = /^[^`"'\x5C]*$/;
  for (const key in body) {
    if (Object.hasOwnProperty.call(body, key)) {
      const value = body[key] as string;
      if (!strReg.test(value)) {
        throw new Error('数据不合法！');
      }
      if (typeof value === 'object') {
        isSafeData(value);
      }
    }
  }
}
