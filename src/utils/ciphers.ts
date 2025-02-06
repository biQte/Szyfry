const polishAlphabet = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż";

const validateShiftKey = (key: number): void => {
  const alphabetLength = polishAlphabet.length;

  if (key <= 0 || key >= alphabetLength) {
    throw new Error(
      `Podano klucz szyfrujący z poza zakresu. Zakres wynosi od 1 do ${
        alphabetLength - 1
      }`
    );
  }
};

export const maxShiftKeyLength = polishAlphabet.length;
export const minShiftKeyLength = 1;

export const ceasarEncrypt = (text: string, key: number): string => {
  validateShiftKey(key);

  return text
    .split("")
    .map((char) => {
      const index = polishAlphabet.indexOf(char);
      if (index === -1) return char;
      return polishAlphabet[(index + key) % polishAlphabet.length];
    })
    .join("");
};

export const ceasarDecrypt = (text: string, key: number): string => {
  validateShiftKey(key);

  return text
    .split("")
    .map((char) => {
      const index = polishAlphabet.indexOf(char);
      if (index === -1) return char;
      return polishAlphabet[
        (index - key + polishAlphabet.length) % polishAlphabet.length
      ];
    })
    .join("");
};

export const polibiusEncrypt = (text: string): string => {
  const grid = Array.from(polishAlphabet);

  return text
    .split("")
    .map((char) => {
      const index = grid.indexOf(char);
      if (index === -1) return char;
      const row = Math.floor(index / 6) + 1;
      const col = (index % 6) + 1;
      return `${row}${col}`;
    })
    .join(" ");
};

export const polibiusDecrypt = (text: string): string => {
  const grid = Array.from(polishAlphabet);
  const pairs = text.match(/\d{2}/g) || [];

  return pairs
    .map((pair) => {
      const [row, col] = pair.split("", 2).map(Number);
      const index = (row - 1) * 6 + (col - 1);
      return grid[index] || "";
    })
    .join("");
};

export const vigenereEncrypt = (text: string, key: string): string => {
  const keyIndices = key.split("").map((k) => polishAlphabet.indexOf(k));

  return text
    .split("")
    .map((char, i) => {
      const charIndex = polishAlphabet.indexOf(char);
      if (charIndex === -1) return char;
      const shift = keyIndices[i % key.length];
      return polishAlphabet[(charIndex + shift) % polishAlphabet.length];
    })
    .join("");
};

export const vigenereDecrypt = (text: string, key: string): string => {
  const keyIndices = key.split("").map((k) => polishAlphabet.indexOf(k));

  return text
    .split("")
    .map((char, i) => {
      const charIndex = polishAlphabet.indexOf(char);
      if (charIndex === -1) return char;
      const shift = keyIndices[i % key.length];
      return polishAlphabet[
        (charIndex - shift + polishAlphabet.length) % polishAlphabet.length
      ];
    })
    .join("");
};

const generatePlayfairMatrix = (key: string): string[][] => {
  const matrix: string[][] = [];
  const seen = new Set<string>();

  const sanitizedKey = key.toLowerCase().replace(/[^a-ząćęłńóśźż]/g, "");
  const keyString = sanitizedKey + polishAlphabet;

  for (const char of keyString) {
    if (!seen.has(char)) {
      seen.add(char);
      if (matrix.flat().length % 6 === 0) matrix.push([]);
      matrix[matrix.length - 1].push(char);
    }
  }

  const placeholder = "-";
  while (matrix.flat().length < 36) {
    if (matrix.flat().length % 6 === 0) matrix.push([]);
    matrix[matrix.length - 1].push(placeholder);
  }

  return matrix;
};

const findInMatrix = (matrix: string[][], char: string): [number, number] => {
  for (let row = 0; row < matrix.length; row++) {
    const col = matrix[row].indexOf(char);
    if (col !== -1) return [row, col];
  }

  throw new Error(`Nie znaleziono litery: ${char} w macierzy`);
};

export const playfairEncrypt = (text: string, key: string): string => {
  const matrix = generatePlayfairMatrix(key);
  const sanitizedText = text.toLowerCase().replace(/[^a-ząćęłńóśźż]/g, "");

  const pairs: string[] = [];
  for (let i = 0; i < sanitizedText.length; i += 2) {
    const a = sanitizedText[i];
    const b = sanitizedText[i + 1] || "x";

    if (a === b) {
      pairs.push(a + "x");
      i--;
    } else {
      pairs.push(a + b);
    }
  }

  const encryptedPairs = pairs.map(([a, b]) => {
    const [row1, col1] = findInMatrix(matrix, a);
    const [row2, col2] = findInMatrix(matrix, b);

    if (row1 === row2) {
      return matrix[row1][(col1 + 1) % 6] + matrix[row2][(col2 + 1) % 6];
    } else if (col1 === col2) {
      return matrix[(row1 + 1) % 6][col1] + matrix[(row2 + 1) % 6][col2];
    } else {
      return matrix[row1][col2] + matrix[row2][col1];
    }
  });

  return encryptedPairs.join("");
};

export const playfairDecrypt = (text: string, key: string): string => {
  const matrix = generatePlayfairMatrix(key);
  const sanitizedText = text.toLowerCase().replace(/[^a-ząćęłńóśźż]/g, "");

  const pairs = sanitizedText.match(/.{1,2}/g) || [];

  const decryptedPairs = pairs.map(([a, b]) => {
    const [row1, col1] = findInMatrix(matrix, a);
    const [row2, col2] = findInMatrix(matrix, b);

    if (row1 === row2) {
      return matrix[row1][(col1 + 5) % 6] + matrix[row2][(col2 + 5) % 6];
    } else if (col1 === col2) {
      return matrix[(row1 + 5) % 6][col1] + matrix[(row2 + 5) % 6][col2];
    } else {
      return matrix[row1][col2] + matrix[row2][col1];
    }
  });

  let decryptedText = decryptedPairs.join("");
  if (decryptedText.endsWith("x")) {
    decryptedText = decryptedText.slice(0, -1);
  }

  return decryptedText;
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const modInverse = (e: number, phi: number): number => {
  let m0 = phi,
    t,
    q;
  let x0 = 0,
    x1 = 1;

  if (phi === 1) return 0;

  while (e > 1) {
    q = Math.floor(e / phi);
    t = phi;
    phi = e % phi;
    e = t;
    t = x0;
    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < 0) x1 += m0;
  return x1;
};

const p = 61;
const q = 53;
const n = p * q;
const phi = (p - 1) * (q - 1);

let e = 17;
while (gcd(e, phi) !== 1) {
  e++;
}

const d = modInverse(e, phi);

const rsaPrivateKey = { d, n };
const rsaPublicKey = { e, n };

export const rsaEncrypt = (text: string) => {
  return text.split("").map((char) => {
    const charCode = char.charCodeAt(0);
    console.log(
      BigInt(charCode) ** BigInt(rsaPublicKey.e) % BigInt(rsaPublicKey.n)
    );
    return BigInt(charCode) ** BigInt(rsaPublicKey.e) % BigInt(rsaPublicKey.n);
  });
};

export const rsaDecrypt = (cipher: any): string => {
  console.log(cipher);
  return cipher
    .map((num: any) => {
      const charCode =
        BigInt(num) ** BigInt(rsaPrivateKey.d) % BigInt(rsaPrivateKey.n);
      return String.fromCharCode(Number(charCode));
    })
    .join("");
};
