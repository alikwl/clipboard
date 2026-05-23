# Downloads Folder

This folder contains downloadable resources for the Free Resources Hub.

## Current Files

### Flow Veo 3 Auto-Generator & Downloader
- **File Name**: `flow-veo-automator-v2.0.zip`
- **Location**: Place your ZIP file here: `assets/downloads/flow-veo-automator-v2.0.zip`
- **Description**: Chrome extension for automating Flow Veo 3 video generation
- **Version**: 2.0

## How to Add the ZIP File

1. Place your extension ZIP file in this folder
2. Name it exactly: `flow-veo-automator-v2.0.zip`
3. The download link on the landing page will automatically work
4. Jekyll will copy this file to `_site/assets/downloads/` during build

## File Structure

```
assets/
└── downloads/
    ├── README.md (this file)
    └── flow-veo-automator-v2.0.zip (your extension file - add this)
```

## Adding Future Downloads

For future downloadable resources:

1. Add the file to this folder
2. Update the landing page HTML with the correct path:
   ```html
   <a href="{{ site.baseurl }}/assets/downloads/your-file.zip" 
      download="your-file.zip">Download</a>
   ```
3. Rebuild Jekyll: `bundle exec jekyll build`

## Important Notes

- Keep file names lowercase with hyphens (kebab-case)
- Include version numbers in file names for clarity
- Large files (>100MB) should be hosted externally (GitHub Releases, CDN, etc.)
- This folder is included in the Jekyll build and deployed to GitHub Pages
