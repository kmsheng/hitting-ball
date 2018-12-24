export default function shuffle(arr) {

  let currentIndex = arr.length;

  while (0 !== currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
  }

  return arr;
}
