// Initialize News Ticker
function initNewsTicker() {
    const ticker = document.createElement('div');
    ticker.className = 'news-ticker';
    
    const content = document.createElement('div');
    content.className = 'ticker-content';
    
    // Sample headlines
    const headlines = [
        "📢 System Alert: Start menu now opens above news ticker",
        "🌐 Network: VPN connections now support 🦄 Rainbow Protocol",
        "🆕 Update: Task Manager now detects 🍪 Cookie processes",
        "⚠️ Reminder: Always check z-index values for overlapping elements",
        "🎉 Feature: Speech recognition now understands 🐈 Cat language"
    ];
    
    headlines.forEach(headline => {
        const item = document.createElement('span');
        item.className = 'ticker-item';
        item.textContent = headline + ' •';
        content.appendChild(item);
    });

    ticker.appendChild(content);
    document.body.appendChild(ticker);
}

document.addEventListener('DOMContentLoaded', initNewsTicker);