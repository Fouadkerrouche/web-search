// Configuration
const TOTAL_PAGES = 75;
const PAGES_PATH = 'pages/';

// State
let allPages = [];
let currentFilter = 'all';
let searchResults = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsContainer = document.getElementById('results');
const loadingEl = document.getElementById('loading');
const noResultsEl = document.getElementById('noResults');
const statsEl = document.getElementById('stats');
const filterSection = document.getElementById('filterSection');
const suggestionsEl = document.getElementById('suggestions');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    preloadPages();
});

// Setup Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    searchInput.addEventListener('input', (e) => {
        clearBtn.style.display = e.target.value ? 'block' : 'none';
        if (e.target.value.length > 2) {
            showSuggestions(e.target.value);
        } else {
            suggestionsEl.classList.remove('show');
        }
    });
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        clearResults();
        suggestionsEl.classList.remove('show');
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayResults(searchResults);
        });
    });
    
    // Topic chips
    document.querySelectorAll('.topic-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            searchInput.value = chip.dataset.query;
            performSearch();
        });
    });
}

// Preload all pages
async function preloadPages() {
    console.log('Preloading pages...');
    const promises = [];
    
    for (let i = 1; i <= TOTAL_PAGES; i++) {
        promises.push(fetchPageData(i));
    }
    
    allPages = await Promise.all(promises);
    console.log(`Loaded ${allPages.length} pages`);
}

// Fetch and parse a single page
async function fetchPageData(pageNum) {
    try {
        const response = await fetch(`${PAGES_PATH}page${pageNum}.html`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const title = doc.querySelector('title')?.textContent || '';
        const metaDescription = doc.querySelector('meta[name="description"]')?.content || '';
        const metaKeywords = doc.querySelector('meta[name="keywords"]')?.content || '';
        const h1 = doc.querySelector('h1')?.textContent || '';
        const h2 = doc.querySelector('h2')?.textContent || '';
        const paragraphs = Array.from(doc.querySelectorAll('p')).map(p => p.textContent).join(' ');
        const images = Array.from(doc.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt
        }));
        
        return {
            pageNum,
            url: `${PAGES_PATH}page${pageNum}.html`,
            title,
            h1,
            h2,
            metaDescription,
            metaKeywords,
            paragraphs,
            images,
            allText: `${title} ${h1} ${h2} ${metaDescription} ${metaKeywords} ${paragraphs}`.toLowerCase()
        };
    } catch (error) {
        console.error(`Error loading page ${pageNum}:`, error);
        return null;
    }
}

// Show search suggestions
function showSuggestions(query) {
    if (!query || query.length < 3) return;
    
    const suggestions = new Set();
    const queryLower = query.toLowerCase();
    
    // Helper function to check exact word match for suggestions
    const startsWithQuery = (text, query) => {
        const regex = new RegExp(`\\b${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
        return regex.test(text);
    };
    
    allPages.forEach(page => {
        if (!page) return;
        
        // Extract keywords from meta tags
        const keywords = page.metaKeywords.split(',').map(k => k.trim());
        keywords.forEach(keyword => {
            if (startsWithQuery(keyword, queryLower) && keyword.length > 3) {
                suggestions.add(keyword);
            }
        });
        
        // Extract words from title
        const titleWords = page.title.split(' ').filter(w => w.length > 3);
        titleWords.forEach(word => {
            if (startsWithQuery(word, queryLower)) {
                suggestions.add(word);
            }
        });
    });
    
    if (suggestions.size > 0) {
        const suggestionItems = Array.from(suggestions).slice(0, 5).map(s => 
            `<div class="suggestion-item" onclick="selectSuggestion('${s}')">
                🔍 ${s}
            </div>`
        ).join('');
        
        suggestionsEl.innerHTML = suggestionItems;
        suggestionsEl.classList.add('show');
    }
}

// Select a suggestion
function selectSuggestion(suggestion) {
    searchInput.value = suggestion;
    suggestionsEl.classList.remove('show');
    performSearch();
}

// Perform search with priority
async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    suggestionsEl.classList.remove('show');
    showLoading();
    
    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 0);
    const results = [];
    
    // Helper function to check exact word match
    const hasExactWord = (text, word) => {
        const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(text);
    };
    
    allPages.forEach(page => {
        if (!page) return;
        
        let matchScore = 0;
        let matchType = '';
        let matchDetails = [];
        
        // Priority 1: Title match (highest score)
        const titleLower = page.title.toLowerCase();
        queryWords.forEach(word => {
            if (hasExactWord(page.title, word)) {
                matchScore += 100;
                matchType = matchType || 'title';
                matchDetails.push(`Title contains "${word}"`);
            }
        });
        
        // Priority 2: H1 match
        const h1Lower = page.h1.toLowerCase();
        queryWords.forEach(word => {
            if (hasExactWord(page.h1, word)) {
                matchScore += 80;
                matchType = matchType || 'title';
            }
        });
        
        // Priority 3: Meta tags and keywords
        const metaText = page.metaDescription + ' ' + page.metaKeywords;
        queryWords.forEach(word => {
            if (hasExactWord(metaText, word)) {
                matchScore += 50;
                matchType = matchType || 'meta';
                matchDetails.push(`Meta contains "${word}"`);
            }
        });
        
        // Priority 4: Image alt attributes
        page.images.forEach(img => {
            queryWords.forEach(word => {
                if (hasExactWord(img.alt, word)) {
                    matchScore += 40;
                    matchType = matchType || 'meta';
                }
            });
        });
        
        // Priority 5: H2 match
        const h2Lower = page.h2.toLowerCase();
        queryWords.forEach(word => {
            if (hasExactWord(page.h2, word)) {
                matchScore += 30;
                matchType = matchType || 'content';
            }
        });
        
        // Priority 6: Body text content
        const bodyLower = page.paragraphs.toLowerCase();
        queryWords.forEach(word => {
            if (hasExactWord(page.paragraphs, word)) {
                matchScore += 20;
                matchType = matchType || 'content';
                matchDetails.push(`Content contains "${word}"`);
            }
        });
        
        if (matchScore > 0) {
            results.push({
                ...page,
                matchScore,
                matchType,
                matchDetails
            });
        }
    });
    
    // Sort by match score (highest first)
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    searchResults = results;
    
    setTimeout(() => {
        hideLoading();
        if (results.length > 0) {
            filterSection.style.display = 'flex';
            displayResults(results);
        } else {
            showNoResults();
        }
    }, 500);
}

// Display results
function displayResults(results) {
    // Filter results based on current filter
    let filteredResults = results;
    if (currentFilter !== 'all') {
        filteredResults = results.filter(r => r.matchType === currentFilter);
    }
    
    if (filteredResults.length === 0) {
        showNoResults();
        return;
    }
    
    // Show stats
    statsEl.innerHTML = `Found <strong>${filteredResults.length}</strong> result${filteredResults.length !== 1 ? 's' : ''} ${currentFilter !== 'all' ? `(filtered by ${currentFilter})` : ''}`;
    statsEl.classList.add('show');
    
    // Display results
    resultsContainer.innerHTML = filteredResults.map((result, index) => {
        const mainImage = result.images[0] || { src: '', alt: 'No image' };
        const keywords = result.metaKeywords.split(',').slice(0, 5);
        
        return `
            <div class="result-card" style="animation-delay: ${index * 0.1}s" onclick="openPage('${result.url}')">
                <img src="${mainImage.src}" alt="${mainImage.alt}" class="result-image" loading="lazy" onload="this.classList.add('loaded')">
                <div class="result-content">
                    <div class="result-title">
                        ${result.h1 || result.title}
                        <span class="match-badge ${result.matchType}">${result.matchType}</span>
                    </div>
                    <div class="result-description">
                        ${result.metaDescription.substring(0, 150)}${result.metaDescription.length > 150 ? '...' : ''}
                    </div>
                    <div class="result-tags">
                        ${keywords.map(k => `<span class="tag">${k.trim()}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    noResultsEl.style.display = 'none';
}

// Open page in new tab
function openPage(url) {
    window.open(url, '_blank');
}

// Show loading state
function showLoading() {
    loadingEl.style.display = 'block';
    resultsContainer.innerHTML = '';
    noResultsEl.style.display = 'none';
    statsEl.classList.remove('show');
    filterSection.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingEl.style.display = 'none';
}

// Show no results
function showNoResults() {
    noResultsEl.style.display = 'block';
    statsEl.classList.remove('show');
    filterSection.style.display = 'none';
}

// Clear results
function clearResults() {
    resultsContainer.innerHTML = '';
    noResultsEl.style.display = 'none';
    statsEl.classList.remove('show');
    filterSection.style.display = 'none';
    currentFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') btn.classList.add('active');
    });
}

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus search on '/' key
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Clear on 'Escape'
    if (e.key === 'Escape') {
        if (searchInput.value) {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            clearResults();
        }
        searchInput.blur();
        suggestionsEl.classList.remove('show');
    }
});
