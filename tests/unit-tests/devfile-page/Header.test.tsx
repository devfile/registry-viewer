/// <reference types="jest" />

import { Devfile } from 'custom-types';
import Header from '../../../components/devfile-page/DevPageHeader';
import HeaderTags from '../../../components/devfile-page/HeaderTags';
import devfileLogo from '../../../public/images/devfileLogo.svg';
import { Brand } from '@patternfly/react-core';

import { mount } from 'enzyme';
import { ReactWrapper } from 'enzyme';
import React from 'react';

/**
 * defile
 *     description: existing, undefined
 *     icon: non-existing -> devfile logo, existing
 *     keys with list values: empty list, non-empty list
 * for stacks:
 *     metadata: undefined, with website, without website
 * for samples:
 *     git.remotes: existing, undefined
 */

const baseDevfile: Devfile = {
  name: 'java-maven',
  version: '1.1.0',
  displayName: 'Maven Java',
  type: 'stack',
  projectType: 'maven',
  tags: [],
  icon: '',
  language: 'java',
  links: {
    self: 'devfile-catalog/java-maven:latest',
  },
  resources: [],
  starterProjects: [],
};

const propStackValues: Array<{
  name: string;
  devfile: Devfile;
  devfileMetadata?: Record<string, string>;
}> = [
  {
    name: 'devfile with n metadata',
    devfile: { ...baseDevfile },
  },
  {
    name: "devfile with metadata that doesn't include a website",
    devfile: { ...baseDevfile },
    devfileMetadata: { notWebsite: 'not-website' },
  },
  {
    name: 'devfile with description, icon, and extra information and metadata that includes a website',
    devfile: {
      name: 'java-wildfly',
      description: 'this is a description',
      version: '2.2.0',
      displayName: 'Java Wildfly',
      type: 'stack',
      projectType: 'wildfly',
      links: {
        self: 'a different link',
      },
      tags: ['tag1', 'tag2', 'tag3'],
      icon: 'https://raw.githubusercontent.com/maysunfaisal/node-bulletin-board-2/main/nodejs-icon.png',
      language: 'java',
      resources: ['resource1', 'resource2', 'resource3'],
      starterProjects: [
        'starter-projects1',
        'starter-projects2',
        'starter-projects3',
      ],
    },
    devfileMetadata: { website: 'https://registry.devfile.io' },
  },
];

const propSampleValues: Array<{ name: string; devfile: Devfile }> = [
  { name: 'basic devfile', devfile: { ...baseDevfile, type: 'sample' } },
  {
    name: 'devfile with description, icon, extra information, and git remotes',
    devfile: {
      ...propStackValues[2].devfile,
      type: 'sample',
      git: {
        remotes: {
          remote: 'https://www.youtube.com/watch?v=JCrnRLV5slc',
        },
      },
    },
  },
];

describe('<Header />', () => {
  const devfileKeys = Object.keys(baseDevfile);
  devfileKeys.push('description');

  const numOfInheritedIDs = 2; // IDs of text and brand components are passed to children

  let wrapper = mount(<Header devfile={propStackValues[0].devfile} />);

  //check content in header except website (for stacks) and git repo (for samples)
  function checkHeaderContent(devfile: Devfile) {
    let idToComponentWrappers: Record<string, ReactWrapper> = {};
    devfileKeys.forEach(
      (key) =>
        (idToComponentWrappers[key] = wrapper.findWhere(
          (n) => n.prop('id') === key
        ))
    );

    function getWrapperText(id: string) {
      return idToComponentWrappers[id].last().text();
    }

    expect(idToComponentWrappers['type'].length).toBe(numOfInheritedIDs);
    expect(getWrapperText('type')).toBe(devfile.type);

    expect(idToComponentWrappers['icon'].length).toBe(numOfInheritedIDs);
    expect(wrapper.find(Brand).prop('alt')).toBe(
      devfile.icon ? devfile.displayName + ' logo' : 'devfile logo'
    );
    expect(wrapper.find(Brand).prop('src')).toBe(devfile.icon || devfileLogo);

    expect(idToComponentWrappers['displayName'].length).toBe(numOfInheritedIDs);
    expect(getWrapperText('displayName')).toBe(devfile.displayName);

    expect(idToComponentWrappers['description'].length).toBe(
      devfile.description ? numOfInheritedIDs : 0
    );
    if (devfile.description) {
      expect(
        getWrapperText('description').includes(devfile.description)
      ).toBeTruthy();
    }

    expect(wrapper.find(HeaderTags).length).toBe(1);
    if (devfile.tags.length === 0) {
      expect(wrapper.find(HeaderTags).first().html()).toEqual(null);
    } else {
      expect(wrapper.find(HeaderTags).length).not.toEqual(null);
    }

    function checkMetadataWithID(id: string, label: string) {
      const value =
        id !== 'version'
          ? id !== 'language'
            ? devfile.projectType
            : devfile.language
          : devfile.version;

      expect(idToComponentWrappers[id].length).toBe(numOfInheritedIDs);
      expect(getWrapperText(id)).toBe(label + ': ' + value);
      expect(idToComponentWrappers[id].parent().first().prop('id')).toBe(
        'devfile-metadata'
      );
    }

    checkMetadataWithID('version', 'Version');
    checkMetadataWithID('projectType', 'Project Type');
    checkMetadataWithID('language', 'Language');
  }

  test.each(propStackValues)(
    'stack test: $name',
    ({ devfile, devfileMetadata }) => {
      wrapper.setProps({ devfile: devfile, devfileMetadata: devfileMetadata });

      checkHeaderContent(devfile);

      const websiteWrapper = wrapper.findWhere(
        (n) => n.prop('id') === 'website'
      );
      if (devfileMetadata && devfileMetadata.website) {
        expect(websiteWrapper.length).toBe(numOfInheritedIDs);
        expect(websiteWrapper.first().text()).toBe(
          'Website: ' + devfileMetadata.website
        );
      } else {
        expect(websiteWrapper.length).toBe(0);
      }
    }
  );

  test.each(propSampleValues)('sample test: $name', ({ devfile }) => {
    wrapper.setProps({ devfile: devfile, devfileMetadata: null });

    checkHeaderContent(devfile);

    const gitWrapper = wrapper.findWhere((n) => n.prop('id') === 'git-remotes');
    if (devfile.git && devfile.git.remotes) {
      expect(gitWrapper.length).toBe(numOfInheritedIDs);
      expect(gitWrapper.first().text()).toBe('View Git Repository');
    } else {
      expect(gitWrapper.length).toBe(0);
    }
  });
});
