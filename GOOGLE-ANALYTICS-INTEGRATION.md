# Google Analytics Integration with Cookie Consent

## 🎯 How to Integrate Google Analytics

This guide shows you how to load Google Analytics **only when users consent** to analytics cookies.

---

## 📝 Step-by-Step Integration

### Step 1: Get Your Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a property (if you haven't)
3. Copy your Measurement ID (looks like: `G-XXXXXXXXXX`)

---

### Step 2: Update cookie-consent.js

Open `assets/js/cookie-consent.js` and find the `enableAnalytics()` method (around line 90).

**Replace this:**
```javascript
enableAnalytics() {
    console.log('Analytics enabled');
    
    // Example: Load Google Analytics
    // if (typeof gtag === 'undefined') {
    //     const script = document.createElement('script');
    //     script.async = true;
    //     script.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID';
    //     document.head.appendChild(script);
    // }
}
```

**With this:**
```javascript
enableAnalytics() {
    console.log('Analytics enabled');
    
    // Load Google Analytics if not already loaded
    if (typeof gtag === 'undefined') {
        // Load gtag.js script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // Replace with your ID
        document.head.appendChild(script);
        
        // Initialize gtag
        script.onload = function() {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX'); // Replace with your ID
            console.log('✅ Google Analytics loaded');
        };
    }
}
```

**Important**: Replace `G-XXXXXXXXXX` with your actual Google Analytics Measurement ID (both places).

---

### Step 3: Update disableAnalytics()

Find the `disableAnalytics()` method and update it:

```javascript
disableAnalytics() {
    console.log('Analytics disabled');
    
    // Disable Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
    }
    
    // Remove analytics cookies
    this.deleteCookie('_ga');
    this.deleteCookie('_gid');
    this.deleteCookie('_gat');
    this.deleteCookie('_gat_gtag_' + 'G_XXXXXXXXXX'); // Replace with your ID
}
```

---

### Step 4: Remove Old GA Code (Optional)

If you have Google Analytics code in `_includes/head.html`, you should remove it since we're now loading it conditionally.

**Find and remove this from head.html:**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## ✅ Complete Example

Here's the complete updated `enableAnalytics()` and `disableAnalytics()` methods:

```javascript
enableAnalytics() {
    console.log('Analytics enabled');
    
    // Your Google Analytics Measurement ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // CHANGE THIS!
    
    // Load Google Analytics if not already loaded
    if (typeof gtag === 'undefined') {
        // Load gtag.js script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        // Initialize gtag when script loads
        script.onload = function() {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            // Set default consent
            gtag('consent', 'default', {
                'analytics_storage': 'granted'
            });
            
            gtag('js', new Date());
            gtag('config', GA_MEASUREMENT_ID);
            
            console.log('✅ Google Analytics loaded and configured');
        };
    } else {
        // Already loaded, just update consent
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
        console.log('✅ Google Analytics consent granted');
    }
}

disableAnalytics() {
    console.log('Analytics disabled');
    
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // CHANGE THIS!
    
    // Disable Google Analytics if loaded
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
    }
    
    // Remove analytics cookies
    this.deleteCookie('_ga');
    this.deleteCookie('_gid');
    this.deleteCookie('_gat');
    this.deleteCookie(`_gat_gtag_${GA_MEASUREMENT_ID.replace(/-/g, '_')}`);
    
    console.log('❌ Google Analytics disabled and cookies removed');
}
```

---

## 🧪 Testing

### Test Analytics Loading

1. **Open browser console** (F12)
2. **Reset consent**: `window.cookieConsent.resetConsent()`
3. **Click "Accept All"**
4. **Check console** - Should see: `✅ Google Analytics loaded and configured`
5. **Check Network tab** - Should see request to `gtag/js`
6. **Check Cookies** - Should see `_ga`, `_gid` cookies

### Test Analytics Blocking

1. **Reset consent**: `window.cookieConsent.resetConsent()`
2. **Click "Decline"**
3. **Check console** - Should see: `❌ Analytics disabled`
4. **Check Cookies** - Should NOT see `_ga`, `_gid` cookies
5. **Check Network tab** - Should NOT see request to `gtag/js`

### Test Consent Changes

1. **Accept analytics** initially
2. **Open footer** "Cookie Settings"
3. **Toggle analytics OFF**
4. **Save preferences**
5. **Check console** - Should see analytics disabled
6. **Check cookies** - Analytics cookies should be removed

---

## 🎯 How It Works

### User Flow

```
User Visits Site
    ↓
Cookie Banner Appears
    ↓
User Clicks "Accept All"
    ↓
enableAnalytics() Called
    ↓
Google Analytics Script Loaded
    ↓
Tracking Begins
```

### Consent Flow

```
Analytics Consent = TRUE
    ↓
Load gtag.js script
    ↓
Initialize Google Analytics
    ↓
Set consent to 'granted'
    ↓
Start tracking pageviews
```

### Decline Flow

```
Analytics Consent = FALSE
    ↓
Don't load gtag.js
    ↓
Remove existing cookies
    ↓
No tracking occurs
```

---

## 📊 Verify in Google Analytics

After implementing:

1. **Wait 24-48 hours** for data to appear
2. **Go to Google Analytics dashboard**
3. **Check Realtime reports** to see live visitors
4. **Verify tracking is working**

### Test Realtime Tracking

1. Open your site with analytics enabled
2. Go to Google Analytics > Realtime > Overview
3. You should see yourself as an active user
4. Navigate between pages
5. See pageviews in realtime

---

## 🔒 Privacy-Friendly Setup

### Anonymize IP Addresses

Add this to your `gtag('config')` call:

```javascript
gtag('config', GA_MEASUREMENT_ID, {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
});
```

### Respect Do Not Track

Add this check before loading analytics:

```javascript
enableAnalytics() {
    // Check for Do Not Track
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
        console.log('Do Not Track enabled - respecting user preference');
        return;
    }
    
    // ... rest of analytics code
}
```

---

## 🎨 Advanced: Multiple Analytics Services

### Add Multiple Services

```javascript
enableAnalytics() {
    console.log('Analytics enabled');
    
    // Google Analytics
    this.loadGoogleAnalytics();
    
    // Facebook Pixel (if you use it)
    this.loadFacebookPixel();
    
    // Other analytics services
    // this.loadHotjar();
    // this.loadMixpanel();
}

loadGoogleAnalytics() {
    if (typeof gtag === 'undefined') {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        document.head.appendChild(script);
        
        script.onload = function() {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
        };
    }
}

loadFacebookPixel() {
    // Facebook Pixel code here
}
```

---

## 🐛 Troubleshooting

### Analytics Not Loading

**Check:**
1. ✅ Correct Measurement ID
2. ✅ User accepted analytics cookies
3. ✅ No ad blockers active
4. ✅ Console shows "Analytics enabled"
5. ✅ Network tab shows gtag.js request

### Cookies Not Being Set

**Check:**
1. ✅ Site is on HTTPS (required for cookies)
2. ✅ No browser privacy settings blocking cookies
3. ✅ Correct domain in cookie settings
4. ✅ User accepted analytics cookies

### Data Not in Google Analytics

**Wait:**
- Realtime data: Shows immediately
- Standard reports: 24-48 hours delay
- First time setup: May take longer

**Verify:**
1. Correct Measurement ID
2. Property is active in GA
3. No filters blocking your IP
4. Tracking code is firing (check Realtime)

---

## 📝 Configuration Checklist

- [ ] Got Google Analytics Measurement ID
- [ ] Updated `enableAnalytics()` method
- [ ] Updated `disableAnalytics()` method
- [ ] Replaced `G-XXXXXXXXXX` with real ID (2 places)
- [ ] Removed old GA code from head.html (if exists)
- [ ] Tested with "Accept All"
- [ ] Tested with "Decline"
- [ ] Verified in browser console
- [ ] Checked cookies in DevTools
- [ ] Verified in GA Realtime reports

---

## 🎉 You're Done!

Your Google Analytics is now:
- ✅ **Privacy-compliant** - Only loads with consent
- ✅ **GDPR-ready** - Respects user choices
- ✅ **Cookie-aware** - Integrates with consent system
- ✅ **User-friendly** - Clear opt-in/opt-out

---

## 📚 Additional Resources

- [Google Analytics Documentation](https://developers.google.com/analytics)
- [Consent Mode Guide](https://developers.google.com/tag-platform/security/guides/consent)
- [Cookie Settings](https://developers.google.com/analytics/devguides/collection/gtagjs/cookies-user-id)

---

**Last Updated**: December 5, 2025

**Remember**: Always replace `G-XXXXXXXXXX` with your actual Google Analytics Measurement ID!
