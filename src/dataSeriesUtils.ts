type IntArray = Array<number>;

export function cumulativeSeries(arr: IntArray): IntArray {
  const result = [];
  arr.reduce((prev, curr, i) => {
    result[i] = prev + curr;
    return result[i];
  }, 0);

  return result;
}

export function doo() { return 5; }
