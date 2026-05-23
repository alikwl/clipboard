// Social Media Image Resizer
(function() {
  let uploadedImage = null;
  let currentPlatform = { width: 1080, height: 1080, name: 'instagram-square' };
  
  const imageInput = document.getElementById('imageInput');
  const uploadArea = document.getElementById('uploadArea');
  const platformSection = document.getElementById('platformSection');
  const previewSection = document.getElementById('previewSection');
  const downloadSection = document.getElementById('downloadSection');
  const previewCanvas = document.getElementById('previewCanvas');
  const resultImage = document.getElementById('resultImage');
  
  // Upload handling
  if (imageInput) {
    imageInput.addEventListener('change', handleImageUpload);
  }
  
  if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
      }
    });
  }
  
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  }
  
  function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImage = new Image();
      uploadedImage.onload = function() {
        showPlatformSelection();
        updatePreview();
      };
      uploadedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  function showPlatformSelection() {
    if (platformSection) platformSection.style.display = 'block';
    if (previewSection) previewSection.style.display = 'block';
  }
  
  // Platform selection
  const platformBtns = document.querySelectorAll('.platform-btn');
  platformBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      platformBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      currentPlatform = {
        width: parseInt(this.dataset.width),
        height: parseInt(this.dataset.height),
        name: this.dataset.platform
      };
      
      updatePreview();
    });
  });
  
  function updatePreview() {
    if (!uploadedImage || !previewCanvas) return;
    
    const ctx = previewCanvas.getContext('2d');
    const targetWidth = currentPlatform.width;
    const targetHeight = currentPlatform.height;
    
    // Set canvas size
    previewCanvas.width = targetWidth;
    previewCanvas.height = targetHeight;
    
    // Calculate crop dimensions
    const imgRatio = uploadedImage.width / uploadedImage.height;
    const targetRatio = targetWidth / targetHeight;
    
    let sourceWidth, sourceHeight, sourceX, sourceY;
    
    if (imgRatio > targetRatio) {
      // Image is wider than target
      sourceHeight = uploadedImage.height;
      sourceWidth = sourceHeight * targetRatio;
      sourceX = (uploadedImage.width - sourceWidth) / 2;
      sourceY = 0;
    } else {
      // Image is taller than target
      sourceWidth = uploadedImage.width;
      sourceHeight = sourceWidth / targetRatio;
      sourceX = 0;
      sourceY = (uploadedImage.height - sourceHeight) / 2;
    }
    
    // Draw cropped image
    ctx.drawImage(
      uploadedImage,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, targetWidth, targetHeight
    );
    
    // Show download section
    if (downloadSection) {
      downloadSection.style.display = 'block';
      resultImage.src = previewCanvas.toDataURL('image/png');
      document.getElementById('resultDimensions').textContent = `${targetWidth} × ${targetHeight} px`;
      
      // Estimate file size
      const dataUrl = previewCanvas.toDataURL('image/png');
      const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
      const sizeInKB = Math.round(sizeInBytes / 1024);
      document.getElementById('resultSize').textContent = `~${sizeInKB} KB`;
    }
  }
  
  // Download button
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      const link = document.createElement('a');
      link.download = `${currentPlatform.name}-${currentPlatform.width}x${currentPlatform.height}.png`;
      link.href = previewCanvas.toDataURL('image/png');
      link.click();
    });
  }
  
  // New image button
  const newImageBtn = document.getElementById('newImageBtn');
  if (newImageBtn) {
    newImageBtn.addEventListener('click', function() {
      location.reload();
    });
  }
  
  // Crop controls
  const rotateLeftBtn = document.getElementById('rotateLeft');
  const rotateRightBtn = document.getElementById('rotateRight');
  const flipHorizontalBtn = document.getElementById('flipHorizontal');
  const resetCropBtn = document.getElementById('resetCrop');
  
  let rotation = 0;
  let flipped = false;
  
  if (rotateLeftBtn) {
    rotateLeftBtn.addEventListener('click', function() {
      rotation = (rotation - 90) % 360;
      applyTransformations();
    });
  }
  
  if (rotateRightBtn) {
    rotateRightBtn.addEventListener('click', function() {
      rotation = (rotation + 90) % 360;
      applyTransformations();
    });
  }
  
  if (flipHorizontalBtn) {
    flipHorizontalBtn.addEventListener('click', function() {
      flipped = !flipped;
      applyTransformations();
    });
  }
  
  if (resetCropBtn) {
    resetCropBtn.addEventListener('click', function() {
      rotation = 0;
      flipped = false;
      applyTransformations();
    });
  }
  
  function applyTransformations() {
    if (!uploadedImage || !previewCanvas) return;
    
    const ctx = previewCanvas.getContext('2d');
    ctx.save();
    
    // Clear canvas
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    // Apply transformations
    ctx.translate(previewCanvas.width / 2, previewCanvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipped) ctx.scale(-1, 1);
    
    // Draw image
    const targetWidth = currentPlatform.width;
    const targetHeight = currentPlatform.height;
    
    ctx.drawImage(
      uploadedImage,
      -targetWidth / 2, -targetHeight / 2,
      targetWidth, targetHeight
    );
    
    ctx.restore();
    
    // Update result
    if (resultImage) {
      resultImage.src = previewCanvas.toDataURL('image/png');
    }
  }
})();
