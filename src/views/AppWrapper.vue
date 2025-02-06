<script lang="ts" setup>
import { ref } from "vue";
import { NSelect, NSwitch, NButton, NInput, NInputNumber } from "naive-ui";
import {
  maxShiftKeyLength,
  minShiftKeyLength,
  ceasarEncrypt,
  ceasarDecrypt,
  polibiusEncrypt,
  polibiusDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  playfairEncrypt,
  playfairDecrypt,
  rsaEncrypt,
  rsaDecrypt,
} from "../utils/ciphers";

const ciphersOptions = [
  {
    label: "Szyfr Cezara",
    value: "ceasar",
  },
  {
    label: "Szyfr Polibiusza",
    value: "polibius",
  },
  {
    label: "Szyfr Viegenere'a",
    value: "vigenere",
  },
  {
    label: "Szyfr Playfair",
    value: "playfair",
  },
  {
    label: "Szyfr RSA",
    value: "rsa",
  },
];
const selectedCipher = ref<string | null>(null);

const decrypting = ref<boolean>(false);

const text = ref<string>("");

const shiftKey = ref<number>(1);

const stringShiftKey = ref<string>("przykladowyklucz");

const encryptionOrDecryptionText = ref<string | BigInt[]>("");

const handleEncryptionOrDecryption = () => {
  switch (decrypting.value) {
    case true:
      switch (selectedCipher.value) {
        case "ceasar":
          encryptionOrDecryptionText.value = ceasarDecrypt(
            text.value,
            shiftKey.value
          );
          break;
        case "polibius":
          encryptionOrDecryptionText.value = polibiusDecrypt(text.value);
          break;
        case "vigenere":
          encryptionOrDecryptionText.value = vigenereDecrypt(
            text.value,
            stringShiftKey.value
          );
          break;
        case "playfair":
          encryptionOrDecryptionText.value = playfairDecrypt(
            text.value,
            stringShiftKey.value
          );
          break;
        case "rsa":
          encryptionOrDecryptionText.value = rsaDecrypt(text.value);
          break;
      }
      break;
    case false:
      switch (selectedCipher.value) {
        case "ceasar":
          encryptionOrDecryptionText.value = ceasarEncrypt(
            text.value,
            shiftKey.value
          );
          break;
        case "polibius":
          encryptionOrDecryptionText.value = polibiusEncrypt(text.value);
          break;
        case "vigenere":
          encryptionOrDecryptionText.value = vigenereEncrypt(
            text.value,
            stringShiftKey.value
          );
          break;
        case "playfair":
          encryptionOrDecryptionText.value = playfairEncrypt(
            text.value,
            stringShiftKey.value
          );
          break;
        case "rsa":
          encryptionOrDecryptionText.value = rsaEncrypt(text.value) as BigInt[];
          break;
      }
      break;
  }
};
</script>

<template>
  <h1>Szyfry</h1>
  <div>
    Wybrany Szyfr
    <n-select
      v-model:value="selectedCipher"
      :options="ciphersOptions"
      placeholder="Wybierz szyfr"
      filterable
    />
  </div>
  <n-switch v-model:value="decrypting">
    <template #checked> Deszyfrowanie </template>
    <template #unchecked> Szyfrowanie </template>
  </n-switch>
  <div>
    Tekst do {{ decrypting ? "odszyfrowania" : "zaszyfrowania" }}
    <n-input
      v-model:value="text"
      type="textarea"
      :placeholder="
        decrypting
          ? 'Podaj tekst do rozszyfrowania'
          : 'Podaj tekst do zaszyfrowania'
      "
    />
  </div>
  <div v-if="selectedCipher !== 'polibius' && selectedCipher">
    Klucz {{ decrypting ? "deszyfrujący" : "szyfrujący" }}
    <n-input-number
      v-if="selectedCipher === 'ceasar'"
      v-model:value="shiftKey"
      :placeholder="decrypting ? 'Klucz deszyfrujący' : 'Klucz szyfrujący'"
      :min="minShiftKeyLength"
      :max="maxShiftKeyLength"
    />
    <n-input
      v-if="selectedCipher !== 'ceasar'"
      v-model:value="stringShiftKey"
      :placeholder="decrypting ? 'Klucz deszyfrujący' : 'Klucz szyfrujący'"
    />
  </div>
  <n-button @click="handleEncryptionOrDecryption" type="primary">{{
    decrypting ? "Odszyfruj" : "Zaszyfruj"
  }}</n-button>
  {{ encryptionOrDecryptionText }}
</template>

<style scoped></style>
