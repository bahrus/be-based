# be-based 

be-based is a package that contains a client-side web component decorator, a trans-render transformer, and a HTMLRewriter class [TODO].

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