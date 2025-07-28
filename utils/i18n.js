const messages = {
    en: {
      list:      'Employee List',
      delConfirm:'Selected Employee record will be deleted',
      headers: [
        'First Name','Last Name','Date of Employment','Date of Birth',
        'Phone','Email','Department','Position','Actions'
      ],
      delete: 'Delete',
      edit: 'Edit',
      form: {
        firstName:       'First Name',
        lastName:        'Last Name',
        employmentDate:  'Date of Employment',
        birthDate:       'Date of Birth',
        phone:           'Phone',
        email:           'Email',
        department:      'Department',
        position:        'Position',
        save:            'Save',
        cancel:          'Cancel',
        required: 'is required',
        validDate: ' must be after '
      }
    },
    tr: {
      list:      'Çalışan Listesi',
      delConfirm:'Seçili çalışan silinecektir',
      headers: [
        'Ad','Soyad','İşe Giriş Tarihi','Doğum Tarihi',
        'Telefon','E-posta','Bölüm','Pozisyon','İşlemler'
      ],
      delete: 'Sil',
      edit: 'Düzenle',
      form: {
        firstName:       'Ad',
        lastName:        'Soyad',
        employmentDate:  'İşe Giriş Tarihi',
        birthDate:       'Doğum Tarihi',
        phone:           'Telefon',
        email:           'E-posta',
        department:      'Bölüm',
        position:        'İşlemler',
        save:            'Kaydet',
        cancel:          'İptal',
        required: 'zorunlu alandır',
        validDate: ' daha sonra olmalıdır: '
      }
    }
  };
  
  export function t(key, ...args) {
    const lang = document.documentElement.lang || 'en';
    const msg = messages[lang]?.[key] ?? messages.en[key];
    return typeof msg === 'function' ? msg(...args) : msg;
  }
  