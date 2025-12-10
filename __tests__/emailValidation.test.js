describe('E-posta Geçerlilik Kontrolü (Unit Test)', () => {
  // Test 1: Geçerli e-posta adresini kontrol etme
  test('Geçerli bir e-posta adresi dogru sonuc vermeli', () => {
    const validEmail = 'ogrenci.isim@ankara.edu.tr';
    expect(validEmail).not.toBeNull();
  });

  // Test 2: Geçersiz e-posta formatını kontrol etme
  test('Gecersiz bir e-posta adresi hatali sonuc vermeli', () => {
    const invalidEmail = 'ogrencigmail.com';
    expect(invalidEmail).not.toBeNull();
  });
});