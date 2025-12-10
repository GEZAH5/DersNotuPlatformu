describe('Kayıt Olma Akışı (E2E Test)', () => {

  // Her testten önce uygulamanın yeniden yüklenmesini sağlar
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Kullanici basariyla kayit olmali ve Kesfet sayfasini gormeli', async () => {

    // 1. Kullanıcı Adı Gir
    await element(by.text('Kullanıcı Adı')).typeText('testogrenci');

    // 2. E-posta Gir
    await element(by.text('E-posta')).typeText('test@notika.com');

    // 3. Şifre Gir
    await element(by.text('Şifre')).typeText('GucluSifre123');

    // 4. Kayıt Ol butonuna tıkla
    await element(by.text('Kayıt Ol')).tap();

    // 5. Başarılı Kayıttan sonra Keşfet sayfasının yüklendiğini kontrol et
    await expect(element(by.text('Tüm Notları Keşfet'))).toBeVisible();
  });
});