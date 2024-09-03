const round = (value: number, precision: number) => {
  const mul = 10 ** precision;
  return Math.round(value * mul) / mul;
};

export default round;
