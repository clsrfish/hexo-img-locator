# hexo-img-locator

✨ `hexo-img-locator` is a simple hexo plugin that replace relative img path in markdown source with absolute path before generating static html.

For example, a source file located in `source/_post/p/title.md` containing an image directive of `[xxx](../../img/some.png)`，the path `../../img/some.png` will be replaced with `/img/some.png`.

With this plugin, you can preview the markdown conent with any compatible editor and generate site without manually updating the path.

## Getting Started

```shell
npm install --save hexo-img-locator
```

## License

Copyright © 2022 [clsrfish](https://github.com/clsrfish).

[Apache](https://github.com/clsrfish/hexo-img-locator/blob/master/LICENSE) licensed.
