# be-based [WIP]

be-based is a package that allows a DOM document fragment filled with relative URL paths, to be adjusted based on a base URL. 

<a href="https://nodei.co/npm/be-based/"><img src="https://nodei.co/npm/be-based.png"></a>

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-based?style=for-the-badge)](https://bundlephobia.com/result?p=be-based)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-based?compression=gzip">

[![Playwright Tests](https://github.com/bahrus/be-based/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-based/actions/workflows/CI.yml)

## The syntax:

```html
<template be-based="https://www.supremecourt.gov/about/">
    <a href="biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
<template>
```

is shorthand for:

```html
<template be-based='{
    "base": "https://www.supremecourt.gov/about/",
    "forAll": ["href", "src"]
}'>
    <a href="biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
</template>
```

be-based transforms the template to:

```html
<template is-based='{
    "rules": [
        {
            "selector": "a",
            "attr": "href",
            "ifNot": "^(http|https)",
            "baseHref": "https://www.supremecourt.gov/about/"
        }
    ]
}'>
    <a href="https://www.supremecourt.gov/about/biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
</template>
```

## When?

The only question is "when does this happen"?  This packages allows it to happen in three places, but hopefully two additional places will be added in the future.

###  Template Instantiation

The package provides an entry point (trPlugin.js) to allow this to be done during template instantiation.

In particular, it can be incorporated via a single line declarative config setting into a [DTR-based](https://github.com/bahrus/trans-render#declarative-trans-render-syntax-via-plugins) template instantiation.

But it is a "non-blocking" dependency.  If the library hasn't been loaded by the time the template instantiation commences, *Arazorik ez*, let the second avenue for the transformation happen in the live DOM:

### As a custom attribute / decorator / behavior

be-based is one of a growing family of [be-decorated](https://github.com/bahrus/be-decorated) web component based custom attributes /  behaviors / decorators / directives.

By referencing be-based.js, elements with attribute be-based will be discovered and transformed.

Or we can reference index.js, which loads both trPlugin.js and be-based.js in parallel.

The element be-based can decorate is not limited to template elements.  It can be applied to any DOM element.

### Via a mutation observer [TODO]

If using [stream-orator](https://github.com/bahrus/stream-orator) to stream HTML to a target element, be-based can be used to watch all new elements, and apply all the rules as they are discovered.

### During Template Instantiation, But Programmatically

If using a non trans-render based template instantiation library, the following api allows the rules to be processed programmatically.

```TypeScript
import { BeBasedVirtualProps } from 'be-based/types';

async function processBeBasedRules(props: BeBasedVirtualProps | undefined, target: Element){
    if(props === undefined) return;
    const {processRules} = await import('be-based/processRules.js');
    processRules({proxy: target, rules: props.rules});
}

```


### As a cloudflare HTMLRewriter Class [TODO]

### As a service worker helper [TODO]

W3C [willing](https://discourse.wicg.io/t/proposal-support-cloudflares-htmlrewriter-api-in-workers/5721).

