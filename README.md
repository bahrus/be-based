# be-based

be-based is a package that allows a DOM document fragment filled with relative URL paths, to be adjusted based on a base URL. This is quite critical when streaming HTML from a third-party element to a DOM node contained within the Live DOM tree.

[![NPM version](https://badge.fury.io/js/be-based.png)](http://badge.fury.io/js/be-based)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-based?style=for-the-badge)](https://bundlephobia.com/result?p=be-based)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-based?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/be-based/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-based/actions/workflows/CI.yml)

## The syntax:

```html
<div be-based="https://www.supremecourt.gov/about/">
    <a href="biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
<div>
```

is shorthand for:

```html
<div be-based='{
    "base": "https://www.supremecourt.gov/about/",
    "forAll": ["href", "src", "xlink:href"]
}'>
    <a href="biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
</div>
```

be-based rewrites the attribute within:

```html
<div is-based="https://www.supremecourt.gov/about/">
    <a href="https://www.supremecourt.gov/about/biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
</div>
```

## Side service

*be-based* also takes it upon itself, in the absence of any apparent alternatives, to make the same Declarative Shadow DOM syntax that works when streaming HTML to the browser, to also work while streaming a seprate HTML fetch request to a DOM element.

### As a custom attribute / decorator / behavior

be-based is one of a growing family of [be-decorated](https://github.com/bahrus/be-decorated) web component based custom attributes /  behaviors / decorators / directives.

By referencing be-based.js, elements with attribute be-based will be discovered and transformed.

Or we can reference index.js, which loads both trPlugin.js (template instantiation plug-in) and be-based.js in parallel.

The element be-based can decorate is not limited to template elements.  It can be applied to any DOM element.


If using [stream-orator](https://github.com/bahrus/stream-orator) to stream HTML to a target element, be-based can be used to watch all new elements, and apply all the rules as they are discovered.

This seems to work quite well with Chromium based browsers running on windows (rewriting image url's before the browser tries the original, invalid url), but isn't so effective with Firefox.

### During Template Instantiation, But Programmatically 

This package contains a plugin, trPlugin.js, which does its thing during template instantiation if registered as a plugin while using [DTR.js](https://github.com/bahrus-trans-render) transforms.

### As a cloudflare HTMLRewriter Class [TODO]

### As a service worker helper [TODO]

W3C [willing](https://discourse.wicg.io/t/proposal-support-cloudflares-htmlrewriter-api-in-workers/5721).

