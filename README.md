# be-based 

be-based is a package that contains a client-side web component decorator, a generic transformer on a DOM Element, and a HTMLRewriter class [TODO].

## client-side decorator

```html
<template be-based='{
    "rules": [
        {
            "selector": "a",
            "attr": "href",
            "ifNot": "^(http|https)",
            "prependVal": "https://www.supremecourt.gov/about/"
        }
    ]
}'>
    <a href="biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
</template>
```

transforms the template to:

```html
<template is-based='{
    "rules": [
        {
            "selector": "a",
            "attr": "href",
            "ifNot": "^(http|https)",
            "prependVal": "https://www.supremecourt.gov/about/"
        }
    ]
}'>
    <a href="https://www.supremecourt.gov/about/biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
</template>
```

The element be-based can decorate is not limited to template elements.  It can be applied to any DOM element.

## Generic transformer

```TypeScript
import { BeBasedVirtualProps } from 'be-based/types';

async function processBeBasedRules(props: BeBasedVirtualProps | undefined, target: Element){
    if(props === undefined) return;
    const {processRules} = await import('be-based/processRules.js');
    processRules({proxy: target, rules: props.rules});
}

```