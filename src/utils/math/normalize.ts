const normalize = (x: number, y: number) => {
  const len = Math.sqrt((x * x) + (y * y));

  return {
    x: x / len,
    y: y / len,
  };
};

export default normalize;
