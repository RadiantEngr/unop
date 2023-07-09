import config from "../config";


export default {
    getRandomNumber: (length: number) => {
        const char = '0123456789';
        let output = [];
        for (let i = 0; i < length; i++) {
          let pos = Math.floor(Math.random() * 10);
          output.push(char[pos]);
        }
      
        return output.join('');
    },

    splitNumberIntoDigits: (num: number) => {
      const digits = num.toString().split('');
      return digits.map(Number);
    },

    fillArrayWithZeros: (arr: number[]) => {
      const newArray = [...arr];
      while (newArray.length < config.otpLength) {
        newArray.unshift(0);
      }
    
      return newArray;
    },

    generatePassword: (length: number): string => {
      const characters = config.passwordGenerationCharacters;
      let password = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
      }
    
      return password;
    }
};
