/* Ignore parserOptions.project warning. 
  This file is only run pre-build */
const fs = require(`fs`);
const path = require(`path`);

const configFileString = 'The config file "./webpage_info/layout-text.json"';

function checkDefined(layoutText) {
  if (!layoutText) {
    throw TypeError(`${configFileString} has no object`);
  }

  if (!layoutText.title) {
    throw TypeError(`${configFileString} has no "title" property`);
  }

  if (!layoutText.bannerTitle) {
    throw TypeError(`${configFileString} has no "bannerTitle" property`);
  }

  if (!layoutText.bannerBody) {
    throw TypeError(`${configFileString} has no "bannerBody" property`);
  }

  if (!layoutText.headerLinks) {
    throw TypeError(`${configFileString} has no "headerLinks" property`);
  }

  if (!layoutText.footerLinks) {
    throw TypeError(`${configFileString} has no "footerLinks" property`);
  }

  if (!layoutText.logo) {
    throw TypeError(`${configFileString} has no "logo" property`);
  }
}

function checkPropertyTypes(layoutText) {
  if (typeof layoutText.title !== 'string') {
    throw TypeError(`${configFileString} "title" property is not a string`);
  }

  if (typeof layoutText.bannerTitle !== 'string') {
    throw TypeError(`${configFileString} "bannerTitle" property is not a string`);
  }

  if (typeof layoutText.bannerBody !== 'string') {
    throw TypeError(`${configFileString} "bannerBody" property is not a string`);
  }

  if (!Array.isArray(layoutText.headerLinks)) {
    throw TypeError(`${configFileString} "headerLinks" property is not an array`);
  }

  if (!Array.isArray(layoutText.footerLinks)) {
    throw TypeError(`${configFileString} "footerLinks" property is not an array`);
  }

  if (typeof layoutText.logo !== 'string') {
    throw TypeError(`${configFileString} "logo" property is not a string`);
  }
}

function checkArrayPropertyTypes(arr, arrName) {
  arr.forEach((elem) => {
    if (!elem.name) {
      throw TypeError(
        `${configFileString} "${arrName}" array has an element with no "name" property`,
      );
    }
    if (!elem.link) {
      throw TypeError(
        `${configFileString} "${arrName}" array has an element with no "link" property`,
      );
    }
    if (typeof elem.name !== 'string') {
      throw TypeError(
        `${configFileString} "${arrName}" array has an element with "name" property not as a string`,
      );
    }
    if (typeof elem.link !== 'string') {
      throw TypeError(
        `${configFileString} "${arrName}" array has an element with "link" property not as a string`,
      );
    }
  });
}

function main() {
  const filePath = path.join(process.cwd(), 'webpage_info', 'layout-text.json');
  const layoutTextUnparsed = fs.readFileSync(filePath);
  const layoutText = JSON.parse(layoutTextUnparsed);

  checkDefined(layoutText);
  checkPropertyTypes(layoutText);
  checkArrayPropertyTypes(layoutText.headerLinks, 'headerLinks');
  checkArrayPropertyTypes(layoutText.footerLinks, 'footerLinks');
}

main();
