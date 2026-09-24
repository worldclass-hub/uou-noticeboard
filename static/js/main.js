document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // Auto-generate slug from name (Category form)
  // ============================================
  const nameInput = document.querySelector('#id_name');
  const slugInput = document.querySelector('#id_slug');

  if (nameInput && slugInput) {
    let userTouchedSlug = false;

    if (slugInput.value.trim() !== '') {
      userTouchedSlug = true;
    }

    slugInput.addEventListener('input', () => {
      userTouchedSlug = true;
    });

    nameInput.addEventListener('input', () => {
      if (userTouchedSlug) return;

      const slug = nameInput.value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      slugInput.value = slug;
    });

    slugInput.addEventListener('blur', () => {
      if (slugInput.value.trim() === '') {
        userTouchedSlug = false;
        if (nameInput.value.trim() !== '') {
          nameInput.dispatchEvent(new Event('input'));
        }
      }
    });
  }

  // ============================================
  // LIVE SEARCH on dashboard
  // ============================================
  const searchInput = document.querySelector('#live-search-input');
  const clearBtn = document.querySelector('#clear-search');
  const searchBtn = document.querySelector('#search-btn');
  const noticesGrid = document.querySelector('#notices-grid');
  const noResults = document.querySelector('#no-results');
  const loading = document.querySelector('#search-loading');
  const noticesCount = document.querySelector('#notices-count');
  const noticesHeading = document.querySelector('#notices-heading');
  const importantSection = document.querySelector('#important-section');
  const categoryPills = document.querySelectorAll('.category-pill');

  let currentCategory = '';
  let searchTimeout = null;

  const urlParams = new URLSearchParams(window.location.search);
  currentCategory = urlParams.get('category') || '';

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function buildNoticeCard(n) {
    const categoryHtml = n.category
      ? `<span class="self-start px-2.5 py-1 rounded-full text-xs font-semibold bg-${n.category_color}-100 text-${n.category_color}-700">${escapeHtml(n.category)}</span>`
      : '';

    return `
      <a href="${n.url}"
         class="notice-card bg-white rounded-xl shadow-sm hover:shadow-xl transition p-5 border border-gray-100 flex flex-col overflow-hidden min-w-0">
        ${categoryHtml}
        <h3 class="font-bold text-gray-900 mt-3 text-lg break-words">${escapeHtml(n.title)}</h3>
        <p class="text-gray-600 text-sm mt-2 flex-1 break-words overflow-hidden">${escapeHtml(n.content_snippet)}</p>
        <div class="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t gap-2 flex-wrap">
          <span class="truncate max-w-[50%]">${escapeHtml(n.author)}</span>
          <span class="whitespace-nowrap">${escapeHtml(n.published_at)}</span>
        </div>
      </a>
    `;
  }

  function renderNotices(notices, count) {
    if (!notices || notices.length === 0) {
      noticesGrid.innerHTML = '';
      noticesGrid.classList.add('hidden');
      noResults.classList.remove('hidden');
      noticesCount.textContent = `0 notice${count === 1 ? '' : 's'}`;
    } else {
      noticesGrid.classList.remove('hidden');
      noResults.classList.add('hidden');
      noticesGrid.innerHTML = notices.map(buildNoticeCard).join('');
      noticesCount.textContent = `${count} notice${count === 1 ? '' : 's'}`;
    }

    if (searchInput.value.trim() || currentCategory) {
      noticesHeading.textContent = 'Search Results';
      if (importantSection) importantSection.classList.add('hidden');
    } else {
      noticesHeading.textContent = 'Latest Notices';
      if (importantSection) importantSection.classList.remove('hidden');
    }

    if (searchInput.value.trim()) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  async function fetchNotices() {
    const q = searchInput.value.trim();

    if (!q && !currentCategory) {
      window.location.href = window.location.pathname;
      return;
    }

    loading.classList.remove('hidden');

    try {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (currentCategory) params.append('category', currentCategory);

      const response = await fetch(`/api/notices/search/?${params.toString()}`);
      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      renderNotices(data.notices, data.count);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      loading.classList.add('hidden');
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(fetchNotices, 250);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(searchTimeout);
        fetchNotices();
      }
      if (e.key === 'Escape') {
        searchInput.value = '';
        fetchNotices();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearTimeout(searchTimeout);
      fetchNotices();
      searchInput.focus();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      clearTimeout(searchTimeout);
      fetchNotices();
    });
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      currentCategory = pill.dataset.category || '';

      categoryPills.forEach(p => {
        p.classList.remove('bg-uou', 'text-white', 'border-uou');
        p.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
      });
      pill.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
      pill.classList.add('bg-uou', 'text-white', 'border-uou');

      const newUrl = currentCategory
        ? `${window.location.pathname}?category=${currentCategory}`
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);

      fetchNotices();
    });
  });

  // ============================================
  // Auto-dismiss flash messages after 5s
  // ============================================
  document.querySelectorAll('.bg-green-100').forEach(el => {
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '0';
      setTimeout(() => {
        el.remove();

        const parent = el.parentElement;
        if (parent && parent.tagName === 'DIV' && parent.children.length === 0) {
          parent.remove();
        }
      }, 500);
    }, 5000);
  });

});