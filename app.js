document.addEventListener('DOMContentLoaded', () => {
  // تسجيل Service Worker للإشعارات
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  }

  // متغير حالة الإذن للإشعارات
  let notificationPermission = 'default';

  // تحقق وجود زر الاشتراك للإشعارات ثم أضف المستمع
  const subscribeBtn = document.getElementById('subscribeBtn');
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', async () => {
      try {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          notificationPermission = permission;

          const statusDiv = document.getElementById('notificationStatus');

          if (permission === 'granted') {
            statusDiv.innerHTML = '<span style="color: #32CD32;">✅ تم الاشتراك بنجاح! ستتلقى إشعارات عند نشر مسابقات جديدة</span>';

            // إرسال إشعار تجريبي
            setTimeout(() => {
              showNotification('مرحباً!', 'تم تفعيل الإشعارات بنجاح. ستتلقى إشعارات المسابقات الجديدة.');
            }, 1000);

          } else if (permission === 'denied') {
            statusDiv.innerHTML = '<span style="color: #FF6B6B;">❌ تم رفض الإشعارات. يمكنك تفعيلها من إعدادات المتصفح.</span>';
          } else {
            statusDiv.innerHTML = '<span style="color: #FFA500;">⏳ لم يتم اتخاذ قرار بعد.</span>';
          }
        } else {
          document.getElementById('notificationStatus').innerHTML = '<span style="color: #FF6B6B;">❌ المتصفح لا يدعم الإشعارات</span>';
        }
      } catch (error) {
        console.error('خطأ في طلب الإشعارات:', error);
        document.getElementById('notificationStatus').innerHTML = '<span style="color: #FF6B6B;">❌ حدث خطأ في تفعيل الإشعارات</span>';
      }
    });
  } else {
    console.warn('زر تفعيل الإشعارات غير موجود في الصفحة (subscribeBtn)');
  }

  // تفاعل اللوجو (تم إزالة الربط الخارجي)
  const logo = document.getElementById('Hamoda.png');
  if (logo) {
    logo.addEventListener('click', () => {
      console.log('تم النقر على اللوجو');
    });
  }

  // دالة المشاركة في المسابقات
  window.participateContest = function (contestType) {
    const contestNames = {
      'dance': 'مسابقة الرقصات',
      'shot': 'مسابقة أفضل لقطة',
      'squad': 'مسابقة السكوادات',
      'tournament': 'بطولة الأساطير'
    };

    const contestName = contestNames[contestType] || 'المسابقة';

    alert(`🎉 رائع! تم تسجيل مشاركتك في ${contestName}!\n\n📱 للمشاركة الفعلية تابع حساب إنستجرام: hamoda.777.1\n\n🍀 بالتوفيق!`);

    // إرسال إشعار للمشاركة
    showNotification('تم التسجيل!', `تم تسجيل مشاركتك في ${contestName} بنجاح!`);
  };

  // دالة إرسال الإشعارات
  window.showNotification = function (title, body) {
    if ('Notification' in window && notificationPermission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: 'images/Hamoda.png',
          badge: 'images/Hamoda.png',
          tag: 'freefire-contest'
        });
      } catch (error) {
        console.error('خطأ في إرسال الإشعار:', error);
      }
    }
  };

  // دالة لإعلان مسابقة جديدة (للاستخدام المستقبلي)
  window.announceNewContest = function (contestTitle, prize) {
    showNotification('مسابقة جديدة! 🎉', `مسابقة ${contestTitle} - الجائزة: ${prize}`);
  };

  // إضافة تأثيرات بصرية للعناصر
  const cards = document.querySelectorAll('.contest-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 200);
  });

  // محاكاة إشعار ترحيبي عشوائي
  setTimeout(() => {
    if (Math.random() > 0.7) {
      announceNewContest('الرقصات الأسبوعية', '1000 جوهرة 💎');
    }
  }, 3000);

  // تحديث حالة المسابقات بشكل دوري (محاكاة)
  setInterval(() => {
    const activeContests = document.querySelectorAll('.status.active');
    activeContests.forEach(status => {
      if (Math.random() > 0.95) {
        const participants = Math.floor(Math.random() * 100) + 50;
        const card = status.closest('.contest-card');
        const existing = card.querySelector('.participants');
        if (!existing) {
          const participantsDiv = document.createElement('div');
          participantsDiv.className = 'participants';
          participantsDiv.style.color = '#32CD32';
          participantsDiv.style.fontSize = '0.9em';
          participantsDiv.style.marginTop = '10px';
          participantsDiv.innerHTML = `👥 ${participants} مشارك`;
          card.appendChild(participantsDiv);
        }
      }
    });
  }, 10000);
});
