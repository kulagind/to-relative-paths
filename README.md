# Relative paths

Replaces tsconfig-related paths or aliases to relative

You can find us on [github](https://github.com/kulagind/to-relative-paths) and [npmjs](https://www.npmjs.com/package/to-relative-paths)

# How to use

```
npm i -g to-relative-paths
npx to-relative-paths --root="path/to/root" --dest="path/to/dest" --alias="@internal-path" --verbose
```

where is

- <code>root</code> it is your root path (like ./src)
- <code>alias</code> it is an alias import's path starts with (like @my-lib)
- <code>dest</code> it is the path to directory (alias directs to), must be related to root
- Optional <code>verbose</code> to show matched paths
