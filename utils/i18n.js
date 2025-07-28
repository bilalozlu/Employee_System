const messages = {
    en: {
      list:      'List',
      add:       'Add Employee',
      edit:      'Edit',
      delConfirm:'Are you sure you want to delete this employee?',
      headers: [
        'First Name','Last Name','Date of Employment','Date of Birth',
        'Phone','Email','Department','Position','Actions'
      ],
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
      }
    },
    tr: {
      list:      'Liste',
      add:       'Yeni Çalışan',
      edit:      'Düzenle',
      delConfirm:'Bu çalışanı silmek istediğinize emin misiniz?',
      headers: [
        'Ad','Soyad','İşe Giriş Tarihi','Doğum Tarihi',
        'Telefon','E-posta','Departman','Pozisyon','Eylemler'
      ],
      form: {
        firstName:       'Ad',
        lastName:        'Soyad',
        employmentDate:  'İşe Giriş Tarihi',
        birthDate:       'Doğum Tarihi',
        phone:           'Telefon',
        email:           'E-posta',
        department:      'Departman',
        position:        'Pozisyon',
        save:            'Kaydet',
      }
    }
  };
  
  export function t(key, ...args) {
    const lang = document.documentElement.lang || 'en';
    const msg = messages[lang]?.[key] ?? messages.en[key];
    return typeof msg === 'function' ? msg(...args) : msg;
  }
  