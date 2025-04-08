// changeLanguage.js

// Create WeakMap to store original text values
const originalTexts = new WeakMap();

// Create language menu structure
const langContainer = document.createElement('div');
langContainer.className = 'language-container';
langContainer.style.position = 'relative';

const langButton = document.createElement('button');
langButton.className = 'start-button';
langButton.textContent = '🗣️ Language';

const langMenu = document.createElement('div');
langMenu.style.cssText = `
    position: absolute;
    bottom: 100%;  /* Position above the button */
    right: 0;
    background: #c0c0c0;
    border: 2px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
    min-width: 150px;
    max-height: 300px;
    overflow-y: auto;
    display: none;
    z-index: 1001;  /* Higher than news ticker */
`;

// List of available languages
const languages = [
    'Arabic', 'Chinese', 'Hindi', 'Russian', 'Japanese', 'Korean',
    'Greek', 'Hebrew', 'Thai', 'Bengali', 'Ukrainian', 'Georgian',
    'Armenian', 'Amharic', 'Tamil', 'Telugu', 'Gujarati', 'Malayalam',
    'Kannada', 'Sinhala', 'Burmese', 'Khmer', 'Tibetan', 'Lao',
    'Mongolian', 'Syriac', 'Devanagari'
];

// Create language options
languages.forEach(lang => {
    const option = document.createElement('div');
    option.className = 'p-2';
    option.textContent = lang;
    option.style.cursor = 'pointer';
    option.style.transition = 'background 0.2s ease';
    
    option.addEventListener('mouseover', () => {
        option.style.background = '#000080';
        option.style.color = 'white';
    });
    
    option.addEventListener('mouseout', () => {
        option.style.background = '#c0c0c0';
        option.style.color = 'inherit';
    });
    
    option.addEventListener('click', () => {
        changeLanguage(lang);
        langMenu.style.display = 'none';
    });
    
    langMenu.appendChild(option);
});

// Toggle menu visibility
langButton.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.style.display = langMenu.style.display === 'none' ? 'block' : 'none';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!langContainer.contains(e.target)) {
        langMenu.style.display = 'none';
    }
});

// Assemble components
langContainer.appendChild(langButton);
langContainer.appendChild(langMenu);

// Add to taskbar
const taskbar = document.querySelector('.taskbar');
taskbar.insertBefore(langContainer, taskbar.children[1]);

// Translation functionality
async function changeLanguage(langName) {
    try {
        const response = await fetch(`locales/${langName.toLowerCase()}.json`);
        const translations = await response.json();
        applyTranslations(translations);
    } catch (error) {
        console.error('Error loading language file:', error);
    }
}

function applyTranslations(translations) {
    const translateNode = (node) => {
        // Handle text nodes
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (!text) return;

            // Store original text if not already stored
            if (!originalTexts.has(node)) {
                originalTexts.set(node, text);
            }
            
            const original = originalTexts.get(node);
            node.textContent = translations[original] || original;
        }
        // Handle elements
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // Handle input elements
            if (['INPUT', 'TEXTAREA'].includes(node.tagName)) {
                if (!originalTexts.has(node)) {
                    originalTexts.set(node, node.value.trim());
                }
                const original = originalTexts.get(node);
                node.value = translations[original] || original;
            }

            // Handle special attributes
            ['placeholder', 'title', 'alt'].forEach(attr => {
                if (node.hasAttribute(attr)) {
                    const value = node.getAttribute(attr).trim();
                    if (!value) return;

                    // Create attribute storage if not exists
                    if (!originalTexts.has(node)) {
                        originalTexts.set(node, {});
                    }
                    const storage = originalTexts.get(node);
                    
                    if (!storage[attr]) {
                        storage[attr] = value;
                    }
                    
                    const original = storage[attr];
                    node.setAttribute(attr, translations[original] || original);
                }
            });

            // Recursively process child nodes
            node.childNodes.forEach(translateNode);
        }
    };

    // Start translation from body
    document.body.childNodes.forEach(translateNode);
}