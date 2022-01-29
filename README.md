# be-based [TODO]

be-based is a package that contains a client-side web component decorator, a trans-render transformer, and a HTMLRewriter class.

## client-side decorator

```html
<template be-based='{
    "a": {
        "prepend": "https://www.supremecourt.gov/about/"
    }
}'>
    <a href="biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
</template>
```

transforms the template to:

```html
<template is-based='{
    "a": {
        "prepend": "https://www.supremecourt.gov/about/"
    }
}'>
    <a href="https://www.supremecourt.gov/about/biographies.aspx#SOConnor">O'Connor, Sandra Day</a>
</template>
```