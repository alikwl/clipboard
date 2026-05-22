source "https://rubygems.org"

# Use Jekyll directly for GitHub Actions builds (no Pages service gem pinning)
gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-include-cache"
  gem "jekyll-github-metadata"
end

# Windows specific fixes (Updated for Ruby 3.4+)
gem "webrick"
gem "tzinfo", "~> 1.2"
gem "tzinfo-data", platforms: [:windows, :jruby]

# Using a newer version of wdm that supports Ruby 3.x better
gem "wdm", ">= 0.1.1", :platforms => [:windows]

# Required fix for Ruby 3.4.0 error
# These standard library shims are only needed on Windows Ruby 3.4 local dev
# Guard them to avoid resolution/build failures on Linux CI runners
gem "bigdecimal", platforms: [:windows]
gem "base64", platforms: [:windows]
gem "csv", platforms: [:windows]
gem "mutex_m", platforms: [:windows]