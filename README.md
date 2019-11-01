
# Gue   [![Build Status](https://travis-ci.org/hosein2398/gue.svg?branch=master)](https://travis-ci.org/hosein2398/gue) [![Coverage Status](https://coveralls.io/repos/github/hosein2398/gue/badge.svg?branch=master&kill_cache=1)](https://coveralls.io/github/hosein2398/gue?branch=master)



> Vue js component generator

<p align="center">
<img width="430" src="./logo.png">
</p>

## Demo
<p align="center">
  <img src="./preview.gif">
</p>


Features
* 📜 Generate Vue component
* 🧰 Generate test file for the component 
* ⚙️ Dynamic path for component
* 📁 Configurable root directory for components and tests
* 📝 Custom templates for components and test
## Installing
> Note that this package is published under name of `vue-gue`
```
npm i -g vue-gue
```

## Getting started
Head over to root of your project in terminal, say you want to create a component named `footer`:
```
gue footer
```
This will generate `footer` component in `./src/components/footer.vue`
#### Change directory of component
You can define a directory which you want your component to be generated in.
```
gue tab ./menu
```
This will generate `tab` component in `./menu/tab.vue`
> Consider behavior of directory parameter when you have a config file and you don't. [details](#usage)  
> For a consistent way to change root directory of components see  [config](#config-file).

#### Generate test file
Now if you want a component and also it's corresponding unit test file you can do:
```
gue footer -u
```
This will generate `footer` component in `./src/components/footer.vue` and also a test file in `./tests/unit/footer.js`
> To change any of these directories see [config](#config-file)
## Usage
General usage is like:
```
$ gue --help

  Usage: gue <componentName> [direcroty] [options]

  Options:
    -u, --unit             create unit test of the component too
    -t, --template <name>  define which template to use
    -h, --help             output usage information

```
* &lt;componentName&gt; is mandatory.
* [directory] is optional, and is a relative path.
  If you have a config file this will be a `subdirectory` of your [componentRoot](#options)
  If you don't, then this will lead to generation of component in exact `direcroty` 
* [options] are optional, available options are `-u` which will generate test file, and `-t` which is used to define which template for components to use.

## Config file
Gue accepts a config file to change default settings. In root directory of project make a file `gue.json`, and Gue will automatically recognize and use it.
#### Options
Here are available options for config file:
* `componentRoot`: root directory which components will be generated in. should be relative path.
* `componentSource`: path to custom component template. Or an object to define [multiple templates](#using-multiple-custom-templates).
* `unitRoot`:  directory which test  will be generated in. should be a relative path.
* `unitSource`: path to custom test file template.

An example of a config file with all options:
```json
{
  "componentRoot":"./front-end/src/components",
  "unitRoot":"./front-end/test",
  "componentSource":"./myTemplates/myVueTemplate.vue",
  "unitSource":"./myTemplates/myTestTemplate.js"
}
```
Now if you run gue to create a `clock` component in your project, it'll generate it in `./front-end/src/components/clock.vue`. 
If you run following command in the same project:
```
gue title ./header
```
Will generate `./front-end/src/components/header/title.vue`

#### Custom templates
As said you can use custom templates in Gue, define path to them with `componentSource` and `unitSource` so that Gue will use them instead of it's default ones.
##### Variables
In your component template you can use variable `<%NAME%>` and Gue will replace it with name of component when generating.
And also in test template you use `<%NAME%>` and `<%PATH%>` which will be replaced with path where component is located, relative to path of test file.
Here is an example of custom component template:
```
<template>
  <div class="app">
    Hey I'm a component generated with Gue, my name is <%NAME%>
  </div>
</template>

export default {
name: "<%NAME%>",
data() {
  return {
    someData: "a sample"
  }
}
<style scoped>
</style>
```
To see other examples look at [templates folder](https://github.com/hosein2398/gue/tree/master/src/templates).
##### Using multiple custom templates
You can use multiple custom templates. So `componentSource` can be object (multiple templates) or a string (single template). Multiple templates can be created like:
```json
{
  "componentSource": {
    "component"  :  "./tmps/component.vue",
    "page"  :  "./tmps/page.vue"
  }
}
```
And when using Gue you have to tell it which component template to use:
```
gue menu -t component
gue setting ./pages -t page
```
You can define one of your templates as `default` one, so that you don't have to type `-t` every time. Default component can be specified with `:default` postfix:
```json
{
  "componentSource": {
    "component:default"  :  "./tmps/component.vue",
    "page"  :  "./tmps/page.vue"
  }
}
```
Now if you type any command without `-t`, component template will be used.
```
gue foo 
```
Will use `component` template to generate foo component. No need of `-t component`