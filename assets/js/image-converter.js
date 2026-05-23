// Image Converter Tool
let uploadedImage = null;
let originalWidth = 0;
let originalHeight = 0;
let convertedDataURL = null;
let originalFileName = '';
let originalMimeType = '';

// Multi-file and advanced features state
let pendingFiles = [];
let conversionResults = [];
let support = { webp: false, avif: false };

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeImageConverter();
});

function initializeImageConverter() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const outputFormat = document.getElementById('outputFormat');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const qualityPreset = document.getElementById('qualityPreset');
    const enableResize = document.getElementById('enableResize');
    const lockAspectRatio = document.getElementById('lockAspectRatio');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const resizeMode = document.getElementById('resizeMode');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    const convertAllBtn = document.getElementById('convertAllBtn');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const formatSupportNote = document.getElementById('formatSupportNote');
    const flattenTransparency = document.getElementById('flattenTransparency');
    const backgroundColorGroup = document.getElementById('backgroundColorGroup');
    const autoOrient = document.getElementById('autoOrient');
    const filterGrayscale = document.getElementById('filterGrayscale');
    const filterBrightness = document.getElementById('filterBrightness');
    const filterContrast = document.getElementById('filterContrast');
    const svgRenderScale = document.getElementById('svgRenderScale');
    const svgRenderScaleValue = document.getElementById('svgRenderScaleValue');
    const removeBackground = document.getElementById('removeBackground');
    const removeBgThreshold = document.getElementById('removeBgThreshold');

    // Upload area click
    uploadArea.addEventListener('click', () => imageInput.click());

    // File input change (multi-file)
    imageInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Format change
    outputFormat.addEventListener('change', handleFormatChange);

    // Transparency flatten toggle
    if (flattenTransparency && backgroundColorGroup) {
        flattenTransparency.addEventListener('change', () => {
            backgroundColorGroup.style.display = flattenTransparency.checked ? 'block' : 'none';
        });
    }

    // Quality slider
    quality.addEventListener('input', function() {
        qualityValue.textContent = this.value;
        if (qualityPreset) qualityPreset.value = '';
    });

    // Quality preset selector
    if (qualityPreset) {
        // Initialize the slider from the selected preset
        if (qualityPreset.value) {
            quality.value = qualityPreset.value;
            qualityValue.textContent = qualityPreset.value;
        }
        qualityPreset.addEventListener('change', function() {
            if (this.value) {
                quality.value = this.value;
                qualityValue.textContent = this.value;
            }
        });
    }

    // SVG render scale slider
    if (svgRenderScale && svgRenderScaleValue) {
        svgRenderScale.addEventListener('input', function() {
            svgRenderScaleValue.textContent = `${parseFloat(this.value).toFixed(1)}×`;
        });
    }

    // Enable resize checkbox
    enableResize.addEventListener('change', function() {
        document.getElementById('resizeControls').style.display = 
            this.checked ? 'block' : 'none';
    });

    // Dimension inputs with aspect ratio lock
    widthInput.addEventListener('input', function() {
        if (lockAspectRatio.checked && originalWidth && originalHeight) {
            const ratio = originalHeight / originalWidth;
            heightInput.value = Math.round(this.value * ratio);
        }
    });

    heightInput.addEventListener('input', function() {
        if (lockAspectRatio.checked && originalWidth && originalHeight) {
            const ratio = originalWidth / originalHeight;
            widthInput.value = Math.round(this.value * ratio);
        }
    });

    // Convert button
    convertBtn.addEventListener('click', convertImage);

    // Batch conversion buttons
    if (convertAllBtn) convertAllBtn.addEventListener('click', convertAllImages);

    // Download button
    downloadBtn.addEventListener('click', downloadImage);

    if (downloadAllBtn) downloadAllBtn.addEventListener('click', downloadAllImages);

    // Reset button
    resetBtn.addEventListener('click', resetConverter);

    // Initial format check
    handleFormatChange();

    // Detect format support and update UI
    detectFormatSupport().then(() => {
        if (outputFormat) {
            const avifOption = Array.from(outputFormat.options).find(o => o.value === 'image/avif');
            if (avifOption && !support.avif) {
                avifOption.disabled = true;
                avifOption.textContent = 'AVIF (not supported by your browser)';
            }
            const webpOption = Array.from(outputFormat.options).find(o => o.value === 'image/webp');
            if (webpOption && !support.webp) {
                webpOption.disabled = true;
                webpOption.textContent = 'WebP (not supported by your browser)';
            }
        }
        if (formatSupportNote && !support.avif) {
            formatSupportNote.textContent = 'Tip: AVIF disabled if your browser lacks support.';
        }
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        addFilesToQueue(files);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
        addFilesToQueue(files);
    }
}

function addFilesToQueue(files) {
    const valid = [];
    for (const file of files) {
        if (!file.type.startsWith('image/')) {
            showError('Please upload valid image files only.');
            continue;
        }
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showError(`File ${file.name} exceeds 10MB. Skipped.`);
            continue;
        }
        valid.push(file);
    }
    if (!valid.length) return;
    pendingFiles.push(...valid);

    const nameEl = document.getElementById('uploadedFileName');
    if (nameEl) nameEl.textContent = `${pendingFiles.length} file(s) ready`;
    const controls = document.getElementById('conversionControls');
    if (controls) controls.style.display = 'block';
    const convertAllBtn = document.getElementById('convertAllBtn');
    if (convertAllBtn) convertAllBtn.style.display = pendingFiles.length > 1 ? 'inline-block' : 'none';

    // Load first file for preview
    handleFile(valid[0]);
}

async function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload a valid image file.');
        return;
    }

    // Inform about HEIC/HEIF limitations
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);
    if (isHeic) {
        showError('HEIC/HEIF is not natively supported by most browsers. Please export the photo to JPG or PNG (e.g., via your Photos app) and try again.');
        showNotification('Tip: Export HEIC to JPG/PNG, then convert here.');
        return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showError('File size exceeds 10MB. Please upload a smaller image.');
        return;
    }

    originalFileName = file.name;
    originalMimeType = file.type || '';

    // Attempt auto-orientation using ImageBitmap if enabled
    try {
        const auto = document.getElementById('autoOrient');
        if (window.createImageBitmap && auto && auto.checked) {
            const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
            loadImageFromBitmap(bitmap, URL.createObjectURL(file));
            return;
        }
    } catch (err) {
        console.warn('createImageBitmap failed, falling back to FileReader', err);
    }

    // Fallback to FileReader
    const reader = new FileReader();
    reader.onload = function(e) {
        loadImage(e.target.result);
    };
    reader.onerror = function() {
        showError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
}

function loadImage(dataURL) {
    const img = new Image();
    img.onload = function() {
        uploadedImage = img;
        originalWidth = img.width;
        originalHeight = img.height;
        
        // Update UI
        document.getElementById('uploadedFileName').textContent = 
            `Uploaded: ${originalFileName}`;
        document.getElementById('conversionControls').style.display = 'block';
        document.getElementById('originalDimensions').textContent = 
            `${originalWidth} × ${originalHeight}px`;
        
        // Set default dimensions
        document.getElementById('width').placeholder = originalWidth;
        document.getElementById('height').placeholder = originalHeight;
        
        // Show original preview
        document.getElementById('originalPreview').src = dataURL;
        document.getElementById('originalInfo').textContent = 
            `${originalWidth} × ${originalHeight}px`;
        
        // Toggle SVG controls
        const svgControls = document.getElementById('svgControls');
        if (svgControls) {
            svgControls.style.display = originalMimeType === 'image/svg+xml' ? 'block' : 'none';
            const scaleEl = document.getElementById('svgRenderScale');
            const scaleValEl = document.getElementById('svgRenderScaleValue');
            if (scaleEl && scaleValEl) {
                scaleEl.value = '1';
                scaleValEl.textContent = '1.0×';
            }
        }

        hideError();
    };
    img.onerror = function() {
        showError('Error loading image. Please try a different file.');
    };
    img.src = dataURL;
}

function loadImageFromBitmap(bitmap, previewURL) {
    uploadedImage = bitmap;
    originalWidth = bitmap.width;
    originalHeight = bitmap.height;

    document.getElementById('uploadedFileName').textContent = `Uploaded: ${originalFileName}`;
    document.getElementById('conversionControls').style.display = 'block';
    document.getElementById('originalDimensions').textContent = `${originalWidth} × ${originalHeight}px`;
    document.getElementById('width').placeholder = originalWidth;
    document.getElementById('height').placeholder = originalHeight;
    document.getElementById('originalPreview').src = previewURL;
    document.getElementById('originalInfo').textContent = `${originalWidth} × ${originalHeight}px`;
    // Toggle SVG controls
    const svgControls = document.getElementById('svgControls');
    if (svgControls) {
        svgControls.style.display = originalMimeType === 'image/svg+xml' ? 'block' : 'none';
        const scaleEl = document.getElementById('svgRenderScale');
        const scaleValEl = document.getElementById('svgRenderScaleValue');
        if (scaleEl && scaleValEl) {
            scaleEl.value = '1';
            scaleValEl.textContent = '1.0×';
        }
    }
    hideError();
}

function handleFormatChange() {
    const format = document.getElementById('outputFormat').value;
    const qualityControl = document.getElementById('qualityControl');
    
    // Show quality control only for lossy formats
    if (format === 'image/jpeg' || format === 'image/webp' || format === 'image/avif') {
        qualityControl.style.display = 'block';
    } else {
        qualityControl.style.display = 'none';
    }

    // Transparency handling UI
    const flattenTransparency = document.getElementById('flattenTransparency');
    const backgroundColorGroup = document.getElementById('backgroundColorGroup');
    if (flattenTransparency && backgroundColorGroup) {
        const needsFlatten = format === 'image/jpeg';
        flattenTransparency.checked = needsFlatten;
        backgroundColorGroup.style.display = flattenTransparency.checked ? 'block' : 'none';
    }
}

function convertImage() {
    if (!uploadedImage) {
        showError('Please upload an image first.');
        return;
    }

    try {
        const format = document.getElementById('outputFormat').value;
        const quality = parseFloat(document.getElementById('quality').value);
        const enableResize = document.getElementById('enableResize').checked;
        const flatten = document.getElementById('flattenTransparency')?.checked;
        const bgColor = document.getElementById('backgroundColor')?.value || '#ffffff';
        const grayscale = document.getElementById('filterGrayscale')?.checked;
        const brightness = parseFloat(document.getElementById('filterBrightness')?.value || '1');
        const contrast = parseFloat(document.getElementById('filterContrast')?.value || '1');
        const resizeMode = document.getElementById('resizeMode')?.value || 'contain';
        const removeBg = document.getElementById('removeBackground')?.checked;
        const removeBgStrength = parseInt(document.getElementById('removeBgThreshold')?.value || '22', 10);
        
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;
        
        if (enableResize) {
            const widthInput = document.getElementById('width').value;
            const heightInput = document.getElementById('height').value;
            
            if (widthInput) targetWidth = parseInt(widthInput);
            if (heightInput) targetHeight = parseInt(heightInput);
            
            // If only one dimension is provided, calculate the other
            if (widthInput && !heightInput) {
                targetHeight = Math.round(targetWidth * (originalHeight / originalWidth));
            } else if (heightInput && !widthInput) {
                targetWidth = Math.round(targetHeight * (originalWidth / originalHeight));
            }
        }

        // SVG render scaling
        let finalWidth = targetWidth;
        let finalHeight = targetHeight;
        const svgScale = (originalMimeType === 'image/svg+xml')
            ? parseFloat(document.getElementById('svgRenderScale')?.value || '1')
            : 1;
        if (svgScale && svgScale !== 1) {
            finalWidth = Math.round(targetWidth * svgScale);
            finalHeight = Math.round(targetHeight * svgScale);
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');

        // Optional background flatten
        if (flatten) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
        }

        // Apply filters
        const filters = [];
        if (grayscale) filters.push('grayscale(1)');
        if (brightness && brightness !== 1) filters.push(`brightness(${brightness})`);
        if (contrast && contrast !== 1) filters.push(`contrast(${contrast})`);
        if (filters.length) ctx.filter = filters.join(' ');

        // Draw image on canvas according to resize mode
        if (resizeMode === 'stretch' || (!enableResize && svgScale === 1)) {
            ctx.drawImage(uploadedImage, 0, 0, finalWidth, finalHeight);
        } else {
            // Contain: preserve aspect ratio and letterbox
            const scale = Math.min(finalWidth / originalWidth, finalHeight / originalHeight);
            const drawW = Math.round(originalWidth * scale);
            const drawH = Math.round(originalHeight * scale);
            const dx = Math.round((finalWidth - drawW) / 2);
            const dy = Math.round((finalHeight - drawH) / 2);
            ctx.drawImage(uploadedImage, dx, dy, drawW, drawH);
        }

        // Background removal (basic): sample border to estimate background and remove close colors
        if (removeBg) {
            try {
                const imgData = ctx.getImageData(0, 0, finalWidth, finalHeight);
                const data = imgData.data;
                // Sample edges
                const samples = [];
                const stepX = Math.max(1, Math.floor(finalWidth / 20));
                const stepY = Math.max(1, Math.floor(finalHeight / 20));
                // top and bottom rows
                for (let x = 0; x < finalWidth; x += stepX) {
                    // top
                    let idxT = (0 * finalWidth + x) * 4;
                    samples.push([data[idxT], data[idxT + 1], data[idxT + 2]]);
                    // bottom
                    let idxB = ((finalHeight - 1) * finalWidth + x) * 4;
                    samples.push([data[idxB], data[idxB + 1], data[idxB + 2]]);
                }
                // left and right columns
                for (let y = 0; y < finalHeight; y += stepY) {
                    let idxL = (y * finalWidth + 0) * 4;
                    samples.push([data[idxL], data[idxL + 1], data[idxL + 2]]);
                    let idxR = (y * finalWidth + (finalWidth - 1)) * 4;
                    samples.push([data[idxR], data[idxR + 1], data[idxR + 2]]);
                }
                const avg = samples.reduce((acc, s) => [acc[0] + s[0], acc[1] + s[1], acc[2] + s[2]], [0,0,0]).map(v => v / samples.length);
                const thr = removeBgStrength; // 5-80
                const thrSq = thr * thr;
                for (let i = 0; i < data.length; i += 4) {
                    const dr = data[i] - avg[0];
                    const dg = data[i + 1] - avg[1];
                    const db = data[i + 2] - avg[2];
                    const distSq = dr*dr + dg*dg + db*db;
                    if (distSq < thrSq) {
                        data[i + 3] = 0; // transparent
                    }
                }
                imgData.data.set(data);
                ctx.putImageData(imgData, 0, 0);

                if (format === 'image/jpeg') {
                    showNotification('Background removed; JPG replaces transparency with background color.');
                }
            } catch (e) {
                console.warn('Background removal failed:', e);
            }
        }

        // Convert using toBlob (better memory handling)
        canvas.toBlob(blob => {
            if (!blob) {
                showError('Conversion failed. Try a different format or smaller image.');
                return;
            }
            const url = URL.createObjectURL(blob);
            convertedDataURL = url;
            showPreview(url, finalWidth, finalHeight, format);
            hideError();
        }, format === 'image/png' ? 'image/png' : format, format === 'image/png' ? undefined : quality);
    } catch (error) {
        showError('Error converting image: ' + error.message);
    }
}

function showPreview(dataURL, width, height, format) {
    const previewSection = document.getElementById('previewSection');
    const convertedPreview = document.getElementById('convertedPreview');
    const convertedInfo = document.getElementById('convertedInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const gallery = document.getElementById('convertedGallery');
    const grid = document.getElementById('galleryGrid');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    
    convertedPreview.src = dataURL;
    
    const formatName = format.split('/')[1].toUpperCase();
    convertedInfo.textContent = `${width} × ${height}px • ${formatName}`;
    
    previewSection.style.display = 'block';
    downloadBtn.style.display = 'inline-block';

    // Add to gallery
    conversionResults.push({ url: dataURL, width, height, format, name: originalFileName });
    if (gallery) gallery.style.display = 'block';
    if (downloadAllBtn) downloadAllBtn.style.display = conversionResults.length > 1 ? 'inline-block' : 'none';
    if (grid) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('role', 'listitem');
        const safeName = (originalFileName || 'image').replace(/[<>&]/g, '');
        item.innerHTML = `
          <img src="${dataURL}" alt="${safeName} converted preview" loading="lazy">
          <div class="gallery-meta">${formatName} • ${width}×${height}</div>
          <button class="btn-outline" data-url="${dataURL}" data-name="${safeName}">Download</button>
        `;
        grid.appendChild(item);
        const btn = item.querySelector('button');
        if (btn) {
            btn.addEventListener('click', (ev) => {
                const url = ev.currentTarget.getAttribute('data-url');
                const baseName = (ev.currentTarget.getAttribute('data-name') || 'image').replace(/\.[^/.]+$/, '');
                const ext = format.split('/')[1];
                triggerDownload(url, `${baseName}_converted.${ext}`);
            });
        }
    }
    
    // Scroll to preview
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadImage() {
    if (!convertedDataURL) {
        showError('Please convert an image first.');
        return;
    }

    const format = document.getElementById('outputFormat').value;
    const extension = format.split('/')[1];
    const baseName = originalFileName.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_converted.${extension}`;
    triggerDownload(convertedDataURL, fileName);
    showNotification('Image downloaded successfully!');
}

function downloadAllImages() {
    if (!conversionResults.length) return;
    conversionResults.forEach(({ url, format, name }) => {
        const ext = (format || 'image/png').split('/')[1];
        const baseName = (name || 'image').replace(/\.[^/.]+$/, '');
        const fileName = `${baseName}_converted.${ext}`;
        triggerDownload(url, fileName);
    });
}

function triggerDownload(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function resetConverter() {
    // Reset all variables
    uploadedImage = null;
    originalWidth = 0;
    originalHeight = 0;
    convertedDataURL = null;
    originalFileName = '';
    pendingFiles = [];
    conversionResults = [];
    
    // Reset UI
    document.getElementById('imageInput').value = '';
    document.getElementById('uploadedFileName').textContent = '';
    document.getElementById('conversionControls').style.display = 'none';
    document.getElementById('previewSection').style.display = 'none';
    const gallery = document.getElementById('convertedGallery');
    if (gallery) gallery.style.display = 'none';
    const grid = document.getElementById('galleryGrid');
    if (grid) grid.innerHTML = '';
    document.getElementById('enableResize').checked = false;
    document.getElementById('resizeControls').style.display = 'none';
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
    // Reset quality and preset to balanced
    const qp = document.getElementById('qualityPreset');
    if (qp) qp.value = '0.85';
    document.getElementById('quality').value = '0.85';
    document.getElementById('qualityValue').textContent = '0.85';
    document.getElementById('outputFormat').value = 'image/png';
    const rm = document.getElementById('resizeMode');
    if (rm) rm.value = 'contain';
    const rb = document.getElementById('removeBackground');
    if (rb) rb.checked = false;
    const rbt = document.getElementById('removeBgThreshold');
    if (rbt) rbt.value = '22';
    const backgroundColorGroup = document.getElementById('backgroundColorGroup');
    if (backgroundColorGroup) backgroundColorGroup.style.display = 'none';
    const flattenTransparency = document.getElementById('flattenTransparency');
    if (flattenTransparency) flattenTransparency.checked = false;
    const autoOrient = document.getElementById('autoOrient');
    if (autoOrient) autoOrient.checked = true;
    const filterGrayscale = document.getElementById('filterGrayscale');
    if (filterGrayscale) filterGrayscale.checked = false;
    const filterBrightness = document.getElementById('filterBrightness');
    if (filterBrightness) filterBrightness.value = '1';
    const filterContrast = document.getElementById('filterContrast');
    if (filterContrast) filterContrast.value = '1';
    
    hideError();
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

async function detectFormatSupport() {
    support.webp = await canEncode('image/webp');
    support.avif = await canEncode('image/avif');
}

function canEncode(mime) {
    return new Promise(resolve => {
        try {
            const c = document.createElement('canvas');
            c.width = c.height = 1;
            const ok = c.toDataURL(mime).startsWith(`data:${mime}`);
            resolve(ok);
        } catch (e) {
            resolve(false);
        }
    });
}

function convertAllImages() {
    if (!pendingFiles.length) return;
    (async () => {
        const total = pendingFiles.length;
        resetBatchProgress(total);
        let index = 0;
        for (const file of pendingFiles) {
            await handleFile(file);
            convertImage();
            index += 1;
            updateBatchProgress(index, total);
        }
        showNotification('All images converted.');
        updateBatchProgress(total, total);
    })();
}

function resetBatchProgress(total) {
    const container = document.getElementById('batchProgress');
    const fill = document.getElementById('batchProgressFill');
    const text = document.getElementById('batchProgressText');
    if (container) container.style.display = total > 1 ? 'block' : 'none';
    if (fill) fill.style.width = '0%';
    if (text) text.textContent = `Converted 0/${total}`;
}

function updateBatchProgress(done, total) {
    const fill = document.getElementById('batchProgressFill');
    const text = document.getElementById('batchProgressText');
    const pct = total ? Math.round((done / total) * 100) : 0;
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `Converted ${done}/${total}`;
}
