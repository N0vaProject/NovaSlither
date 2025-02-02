const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = prefersDark.matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// 切换主题
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  
  themeToggle.innerHTML = isDark 
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
  
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 监听系统主题变化
prefersDark.addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    initTheme();
  }
});

// 初始化主题和事件监听
initTheme();
themeToggle.addEventListener('click', toggleTheme);