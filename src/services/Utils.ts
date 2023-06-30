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
    }
};
