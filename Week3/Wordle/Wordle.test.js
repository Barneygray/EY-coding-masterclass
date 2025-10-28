describe( 'checkWord', () => {
    it('should return an array of 5 green strings if the word is correct', () => {
        expect(checkWord(['C', 'U', 'M', 'I', 'N'])).toBe(['green', 'green', 'green', 'green', 'green'])
    });
})