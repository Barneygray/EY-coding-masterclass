function sum(matrix) {
  let diag1 = 0;
  let diag2 = 0;
  for (let i = 0; i < matrix.length; i ++) {
    for (let j = 0; j < matrix.length; j ++) {
      if (i === j) {
        diag1 += matrix[i][j];
        console.log(diag1)
      } 
      if (matrix.length - (i+1) === j) {
        diag2 += matrix[i][j];
        console.log(diag2)
      }
    }
  }
  return diag1 + diag2;
}

console.log(sum([[1,2,3], [4,5,6], [7,8,9]]))