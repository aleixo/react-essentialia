export default function (a?: string, b?: string) {
  for (
    b = a = '';
    a++ < 36;
    b +=
      ~a % 5 | ((a * 3) & 4)
        ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
        : '-'
  );
  return b;
}
